/* jshint esversion:6 */
var TextChanger = function(settings, config) {
    this.current_settings = settings;
    this.current_config = config;
};


// convert a text string into an array of
// elements that represent the bits and pieces
// that do and do not match the regex
TextChanger.prototype.find_match_nonmatch_chunks = function(text, re) {
    var match;
    var broken_texts = [];
    var end = 0;
    // first, break what was a text node into an
    // array of text chunks representing trump and
    // non-trump sections
    /*jshint boss:true */
    while (match = re.exec(text)) {
        var start = match.index;
        var new_end = re.lastIndex;
        // log("start: " + start + ' end: ' + end);
        var before_text = text.substr(end, start - end);
        if (before_text.length > 0) {
            broken_texts.push({
                'match': false,
                'text': before_text
            });
        }
        var match_text = text.substr(start, new_end - start);
        broken_texts.push({
            'match': true,
            'text': match_text
        });
        end = new_end;
    }
    if (broken_texts.length && (end < text.length)) {
        var after_text = text.substr(end, text.length - 1);
        broken_texts.push({
            'match': false,
            'text': after_text
        });
    }
    // if (broken_texts.length) {
    //   log(broken_texts);
    // }
    return broken_texts;
};

TextChanger.prototype.make_replacement_elems_array = function(args) {

    var action_name = useIfElse(args, 'action_name', '__error_missing_action_name');
    var action = args.action;
    var replacement = useIfElse(args,'replacement','XXXXXXX');
    var broken_texts = args.broken_texts;
    var orig_node = args.node;
    var match_style = useIfElse(args,'match_style','background-color: black; color: black;');
    var repl_array = [];
    var repl_count = 0;
    for (var k = 0; k < broken_texts.length; k++) {
        chunk = broken_texts[k];
        if (chunk.match) {
            var unode = document.createElement('span');
            unode.style = match_style;
            unode.title = 'was: "' + chunk.text + '"';
            unode.className = defaults.insult_classname;
            unode.appendChild(document.createTextNode(replacement));
            repl_array.push(unode);
            repl_count += 1;
        } else {
            var newnode = orig_node.cloneNode(false);
            newnode.nodeValue = chunk.text;
            repl_array.push(newnode);
        }
    }
    return {
        repl_array: repl_array,
        repl_count: repl_count
    };
};


TextChanger.prototype.run = function(elements = null) {
    log('switch_text START');

    if (this.current_config === null) {
        log("current_config is invalid");
        return;
    }

    // if we got a list, but it is an empty list, then we're done
    if (elements && !elements.length) return;

    var action_name;
    var n;

    var tthis = this;
    if (true) {
        var action_count = 0;
        var actions_to_run = getRunnableActions(tthis.current_config.actions, this.current_settings);
        var replacement = tthis.current_config.replacement;
        var match_style= tthis.current_config.match_style;

        for (n = 0; n < actions_to_run.length; n++) {
            action_name = actions_to_run[n];
            log('action_name: ' + action_name);
            var visit_attrib_name = '_dtv_' + action_name;
            var action = tthis.current_config.actions[action_name];
            // log(action);

            var search_regex = new RegExp(action.find_regex[0],
                action.find_regex[1]);
            if (!elements) elements = document.getElementsByTagName('*');

            for (var i = 0; i < elements.length; i++) {
                var element = elements[i];
                try {
                    if (!element.hasAttribute(visit_attrib_name)) {
                        for (var j = 0; j < element.childNodes.length; j++) {
                            var node = element.childNodes[j];
                            if (node.nodeType === 3) {
                                if ((node.parentElement !== undefined) &&
                                    (node.parentElement.nodeName == 'TITLE')) {
                                    continue;
                                }
                                var text = node.nodeValue;
                                broken_texts = tthis.find_match_nonmatch_chunks(text, search_regex);

                                if (broken_texts.length) {
                                    var rr = tthis.make_replacement_elems_array({
                                        action_name: action_name,
                                        action: action,
                                        broken_texts: broken_texts,
                                        match_style: match_style,
                                        replacement: replacement,
                                        node: node,
                                        // choice: stored_choices[action_name]
                                    });

                                    if (rr.repl_count) {
                                        replace_elem_with_array_of_elems(node, rr.repl_array);
                                    }
                                    // regardless of whether we made a change or not,
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
                } catch (e) {
                    log('exception');
                    log(e);
                    log(element);
                }
            }
            log('action_done: ' + action_name);

            action_count += 1;
        }
    }
};
