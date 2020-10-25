/* jshint esversion:6 */
// the config itself.
import {default_config} from "./defaults";
import {log, loadConfig} from "./shared";
import {TextChanger} from "./text_changer";
import {ImageChanger} from "./image_changer";
import {ControlTimers} from "./timers";
var current_config = null;
var current_settings = null;

var runReplacementOnce = function(elems = null, img_elems = null) {
    var tc = new TextChanger(current_settings, current_config);
    tc.run(elems, getRunnableActions);
    var ic = new ImageChanger(current_settings, current_config);
    ic.run(img_elems, getRunnableActions);
};

export function getRunnableActions(config_actions, items) {
    // generate a shortened list of actions that the user has enabled
    var actions_to_run = [];
    var action_names = Object.keys(current_config.actions);
    for (var i = 0; i < action_names.length; i++) {
        var action_name = action_names[i];
        var enable_this = true;
        if (items.hasOwnProperty('enabled_actions') &&
            items.enabled_actions.hasOwnProperty(action_name)) {
            enable_this = items.enabled_actions[action_name];
        } else if (current_config.actions[action_name].hasOwnProperty('default_enabled')) {
            enable_this = Boolean(config_actions[action_name].default_enabled);
        }
        if (enable_this) actions_to_run.push(action_name);
    }
    return actions_to_run;

};

var ct = new ControlTimers(runReplacementOnce);

function init() {
    chrome.storage.local.get(null,
        function(settings) {
            current_settings = settings;
            ct.preconfig_init(settings);
            loadConfig(settings, function(err, res) {
                if (!err) {
                    current_config = res;
                    ct.postconfig_init(res,settings);
                }
            }, default_config);
        });
}


log("starting");
setTimeout(init, 500);
