/* jshint esversion:6 */
import * as tf from '@tensorflow/tfjs';
import {default_config, defaults} from "./defaults";
import {log, useIfElse, replace_elem_with_array_of_elems} from "./shared";
import * as toxicity from '@tensorflow-models/toxicity';

export const TextChanger = function (settings, config) {
	this.current_settings = settings;
	this.current_config = config;
};

// Convert a text string into an array of
// elements that represent the bits and pieces
// that do and do not match the regex
TextChanger.prototype.find_match_nonmatch_chunks = function (text, re) {
	let match;
	let broken_texts = [];
	let end = 0;
	// First, break what was a text node into an
	// array of text chunks representing trump and
	// non-trump sections
	/* jshint boss:true */
	while (match = re.exec(text)) {
		let start = match.index;
		let new_end = re.lastIndex;
		// Log("start: " + start + ' end: ' + end);
		let before_text = text.substr(end, start - end);
		if (before_text.length > 0) {
			broken_texts.push({
				match: false,
				text: before_text
			});
		}

		let match_text = text.substr(start, new_end - start);
		broken_texts.push({
			match: true,
			text: match_text
		});
		end = new_end;
	}

	if (broken_texts.length && (end < text.length)) {
		let after_text = text.substr(end, text.length - 1);
		broken_texts.push({
			match: false,
			text: after_text
		});
	}

	// If (broken_texts.length) {
	//   log(broken_texts);
	// }
	return broken_texts;
};

TextChanger.prototype.make_replacement_elems_array = function (args) {
	let action_name = useIfElse(args, 'action_name', '__error_missing_action_name');
	let {action} = args;
	let replacement = useIfElse(args, 'replacement', 'XXXXXXX');
	let {broken_texts} = args;
	let orig_node = args.node;
	let match_style = useIfElse(args, 'match_style', 'background-color: black; color: black;');
	let repl_array = [];
	let repl_count = 0, chunk;
	for (let k = 0; k < broken_texts.length; k++) {
		chunk = broken_texts[k];
		if (chunk.match) {
			let unode = document.createElement('span');
			unode.style = match_style;
			unode.title = 'was: "' + chunk.text + '"';
			unode.className = defaults.insult_classname;
			unode.append(document.createTextNode(replacement));
			repl_array.push(unode);
			repl_count += 1;
		} else {
			let newnode = orig_node.cloneNode(false);
			newnode.nodeValue = chunk.text;
			repl_array.push(newnode);
		}
	}

	return {
		repl_array,
		repl_count
	};
};

TextChanger.prototype.run = async function (elements = null, getRunnableActions) {
	log('switch_text START');

	if (this.current_config === null) {
		log('current_config is invalid');
		return;
	}

	// If we got a list, but it is an empty list, then we're done
	if (elements && !elements.length) {return;}

	let action_name;
	let n;

	await tf.setBackend('cpu');
	let tthis = this;
	if (true) {
		let action_count = 0;
		let actions_to_run = getRunnableActions(tthis.current_config.actions, this.current_settings);
		let {replacement} = tthis.current_config;
		let {match_style} = tthis.current_config;

		for (n = 0; n < actions_to_run.length; n++) {
			action_name = actions_to_run[n];
			log('action_name: ' + action_name);
			let visit_attrib_name = '_dtv_' + action_name;
			let action = tthis.current_config.actions[action_name];
			// Log(action);

			let search_regex = new RegExp(action.find_regex[0],
				action.find_regex[1]);
			if (!elements) {elements = document.getElementsByTagName('*');}

			for (let i = 0; i < elements.length; i++) {
				const element = elements[i];
				try {
					if (!element.hasAttribute(visit_attrib_name)) {
						for (let j = 0; j < element.childNodes.length; j++) {
							let node = element.childNodes[j];
							if (node.nodeType === 3) {
								if ((node.parentElement !== undefined) &&
                                    (node.parentElement.nodeName === 'TITLE')) {
									continue;
								}

								let text = node.nodeValue;
								let broken_texts = tthis.find_match_nonmatch_chunks(text, search_regex);

								if (broken_texts.length) {
									let rr = tthis.make_replacement_elems_array({
										action_name,
										action,
										broken_texts,
										match_style,
										replacement,
										node
										// Choice: stored_choices[action_name]
									});

									if (rr.repl_count) {
										replace_elem_with_array_of_elems(node, rr.repl_array);
									}

									// Regardless of whether we made a change or not,
									// we mark this element searched so that it does
									// not get replaced on a subsequent run.
									// This lets us 1) use insults that have the search
									// string in them and 2) not have insults skipped
									// purposely not be skipped on subsequent runs
									element.setAttribute(visit_attrib_name, '1');
								}
							}
						}
					}
				} catch (error) {
                    log('exception');
                    log(error);
					log(element);
				}
			}

			log('action_done: ' + action_name);

			action_count += 1;
		}
	}
};
