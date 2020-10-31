/* jshint esversion:6 */
import * as tf from '@tensorflow/tfjs';
import * as toxicity from '@tensorflow-models/toxicity';
import {
    default_config,
    defaults
} from "./defaults";
import {
    log,
    useIfElse,
    replace_elem_with_array_of_elems
} from "./shared";

export const TextChanger = function (settings, config) {
	this.current_settings = settings;
	this.current_config = config;
};

// Convert a text string into an array of
// elements that represent the bits and pieces
// that do and do not match the regex
TextChanger.prototype.find_match_nonmatch_chunks = function (text, re) {
	let match;
	const broken_texts = [];
	let end = 0;
	// First, break what was a text node into an
	// array of text chunks representing trump and
	// non-trump sections
	while (match = re.exec(text)) {
		const start = match.index;
		const new_end = re.lastIndex;
		const before_text = text.substr(end, start - end);
		if (before_text.length > 0) {
			broken_texts.push({
				match: false,
				text: before_text
			});
		}

		const match_text = text.substr(start, new_end - start);
		broken_texts.push({
			match: true,
			text: match_text
		});
		end = new_end;
	}

	if (broken_texts.length && (end < text.length)) {
		const after_text = text.substr(end, text.length - 1);
		broken_texts.push({
			match: false,
			text: after_text
		});
	}

	return broken_texts;
};

TextChanger.prototype.make_replacement_elems_array = function (args) {
	const action_name = useIfElse(args, 'action_name', '__error_missing_action_name');
	const {
		action
	} = args;
	const replacement = useIfElse(args, 'replacement', 'XXXXXXX');
	const {
		broken_texts
	} = args;
	const orig_node = args.node;
	const match_style = useIfElse(args, 'match_style', 'background-color: black; color: black;');
	const repl_array = [];
	let repl_count = 0;
        let chunk;
	for (let k = 0; k < broken_texts.length; k++) {
		chunk = broken_texts[k];
		if (chunk.match) {
			const unode = document.createElement('span');
			unode.style = match_style;
			unode.title = 'was: "' + chunk.text + '"';
			unode.className = defaults.insult_classname;
			unode.append(document.createTextNode(replacement));
			repl_array.push(unode);
			repl_count += 1;
		} else {
			const newnode = orig_node.cloneNode(false);
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
	if (elements && !elements.length) {
		return;
	}

	let action_name;
	let toxicComment,  visit_attrib_name = "dtv_";
	const threshold = 0.9;

	await tf.setBackend('cpu');
	const model = await toxicity.load(threshold);
	const tthis = this;

	const {
		replacement
	} = tthis.current_config;
	const {
		match_style
	} = tthis.current_config;

	if (!elements) {
		elements = document.querySelectorAll('p');
	}

	for (let i = 0; i < elements.length; i++) {
		const element = elements[i];
		try {
			if (!element.hasAttribute(visit_attrib_name)) {
				for (let j = 0; j < element.childNodes.length; j++) {
					const node = element.childNodes[j];
					if (node.nodeType === 3) {
						if ((node.parentElement !== undefined) &&
                                            (node.parentElement.nodeName === 'TITLE')) {
							continue;
						}

						const text = node.nodeValue;
						const comment = [text];
						model.classify(comment).then(predictions => {
							predictions.forEach(prediction => {
								if (toxicComment) {
									return;
								}

								prediction.results.forEach((result, index) => {
									if (toxicComment) {
										return;
									}

									if (result.match) {
										toxicComment = comment[0];
										const repl_array = [];
										let repl_count = 0;
										
											const unode = document.createElement('span');
											unode.style = match_style;
											unode.title = 'was: "' + toxicComment + '"';
											unode.className = defaults.insult_classname;
											unode.append(document.createTextNode(replacement));
											repl_array.push(unode);
											repl_count += 1;
										

										if (repl_count) {
											replace_elem_with_array_of_elems(node, repl_array);
										}

										// Regardless of whether we made a change or not,
										// we mark this element searched so that it does
										// not get replaced on a subsequent run.
										// This lets us 1) use insults that have the search
										// string in them and 2) not have insults skipped
										// purposely not be skipped on subsequent runs
										element.setAttribute(visit_attrib_name, '1');
									}
								});
							});
						});
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
};
