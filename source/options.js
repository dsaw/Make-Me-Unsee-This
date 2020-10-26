/*jshint esversion:6 */
import {default_config, defaults} from "./defaults";
import {log, zapStorage, loadConfig, copyDictByKeys, removeChildrenReplaceWith, useIfElse, replace_elem_with_array_of_elems} from "./shared";

function arraysEqual (arr1, arr2) {
    if (arr1.length !== arr2.length)
        return false;
    for (let i = arr1.length; i--;) {
        if (arr1[i] !== arr2[i])
            return false;
    }
    return true;
}
let getCurrentWindowHost = function (cb) {
    chrome.windows.getCurrent({populate: true }, (w) => {
        for (let i=0;i<w.tabs.length;i++) {
            let tab = w.tabs[i];
            if (tab && tab.active) {
                let a = document.createElement('a');
                a.href = tab.url;
                let host = a.hostname;
                return cb(host);
            }
        }

        return cb(null);
    });
};

let OptionsThingy = function() {
    this.current_settings = {};

    this.restorethings = [
        ['site_filter', 'site_filter', false],
        ['track_mutations', 'track_mutations', true],
        ['replace_images', 'replace_images', true],
        ['user_blacklist', 'user_blacklist', false],
        ['user_whitelist', 'user_whitelist', false],
    ];

    let tthis = this;
    this.savethings = [
        ['site_filter', 'change', function() {
            tthis.grayWhitelist();
            tthis.saveGen('site_filter',
                'site_filter',
                false);
        }],
        ['track_mutations', 'change', function() {
            tthis.saveGen('track_mutations',
                'track_mutations',
                true);
        }],
        ['replace_images', 'change', function() {
            tthis.saveGen('replace_images',
                'replace_images',
                true);
        }],
        ['user_blacklist', 'change', function() {
            tthis.saveGen('user_blacklist',
                'user_blacklist',
                false);
        }],
        ['user_whitelist', 'change', function() {
            tthis.saveGen('user_whitelist',
                'user_whitelist',
                false);
        }],
        ['blacklist_save_button', 'click', function() {
            neatenList('user_blacklist');
            tthis.saveGen('user_blacklist',
                'user_blacklist',
                false);
        }],
        ['whitelist_save_button', 'click', function() {
            neatenList('user_whitelist');
            tthis.saveGen('user_whitelist',
                'user_whitelist',
                false);
        }],
        ['blacklist_add_button', 'click', function() {
            getCurrentWindowHost((host) => {
                if (host) {
                    neatenList('user_blacklist',host);
                    tthis.saveGen('user_blacklist',
                        'user_blacklist',
                        false);
                }
            });

        }],
        ['whitelist_add_button', 'click', function() {
            getCurrentWindowHost((host) => {
                if (host) {
                    neatenList('user_whitelist',host);
                    tthis.saveGen('user_whitelist',
                        'user_whitelist',
                        false);
                }
            });

        }],
        ['whitelist_addconfig_button', 'click', function() {
            let configwhitelist = tthis.getConfigWhitelist();
            if (configwhitelist) {
                document.getElementById('user_whitelist').value = 
                    configwhitelist;
                neatenList('user_whitelist');
                tthis.saveGen('user_whitelist', 'user_whitelist', false);
            }
        }],
        ['reset_storage', 'click', function() {
            tthis.resetStorage();
        }],
        ['save_edits', 'click', function() {
            tthis.save_config_edits();
        }],
    ];
};

OptionsThingy.prototype.grayWhitelist = function() {

    let use_whitelist = 
        document.getElementById('site_filter').value == 'use_whitelist';

    [
        [ 'whitelist_save_button', false, ],
        [ 'whitelist_add_button', false, ],
        [ 'whitelist_addconfig_button', false, ],
        [ 'wl_td', false, ],
        [ 'user_whitelist', false, ],
        [ 'blacklist_save_button', true, ],
        [ 'blacklist_add_button', true, ],
        [ 'user_blacklist', true, ],
        [ 'bl_td', true, ],
    ].forEach(n => {
        let disable = (use_whitelist && n[1]) || (!use_whitelist && !n[1]);
        let el = document.getElementById(n[0]);
        el.disabled = disable ? true : false;
        el.className = disable ? 'disabled' : '';
    });
};

OptionsThingy.prototype.getConfigWhitelist = function() {
    if (this.current_settings && this.current_settings.cfgdata &&
        this.current_settings.cfgdata.whitelist) {
        return this.current_settings.cfgdata.whitelist.join(' ');
    }

    return null;
};

let neatenList = function (listname, to_add = null) {
    let bl = document.getElementById(listname);
    if (to_add) bl.value += ' ' + to_add;
    let il = bl.value.split(/[^\w\.-]+/)
        .map((x) => { return x.trim(); })
        .filter((x) => { return x.length; });
    let id = {};
    il.forEach((i) => { id[i] = 1; });
    il = Object.keys(id).sort();
    bl.value = il.join(' ');
    return il;
};

OptionsThingy.prototype.storeThings = function (dict, cb) {
    const tthis = this;
    chrome.storage.local.set(dict, () => {
        copyDictByKeys(tthis.current_settings, dict);
        return cb(tthis.current_settings);
    });
};

OptionsThingy.prototype.selectConfig = function (e) {
    this.genericSelect(e, 'configsrc', this.saveConfigURL.bind(this));
};

OptionsThingy.prototype.selectImgReplConfig = function (e) {
    this.genericSelect(e, 'imgreplsrcinput', this.saveImgReplURL.bind(this));
};

OptionsThingy.prototype.genericSelect = function (e, srcename, save_fn) {
    let tgt = e.target || e.srcElement;
    let id = tgt.id;
    let new_url = tgt.value;
    log('genericSelect(): ' + new_url);
    let srcelem = document.getElementById(srcename);
    let curr_url = srcelem.value;

    if (new_url !== curr_url) {
        srcelem.value = new_url;
        save_fn();
    }
};

OptionsThingy.prototype.save_config_edits = function () {
    let jselem = document.getElementById('configjson');
    let jsontext = jselem.value;
    let new_config = null;
    try {
        new_config = JSON.parse(jsontext);
    } catch (e) {
        log(e);
    }

    if (new_config) {
        chrome.storage.local.set({
            'cfgdata': new_config,
        }, () => {
            jselem.value = JSON.stringify(new_config, null, 2);
        });
    }
};

OptionsThingy.prototype.resetStorage = function () {
    this.current_settings = {};
    let tthis = this;
    zapStorage(function (config_source) {
        tthis.current_settings.config_source = config_source;
        log('storage zapped');
        loadConfig(tthis.current_settings, (err, res) => {
            tthis.updateConfigDisplay(err, res);
            tthis.restorePluginOptions();
        }, default_config);
    });
};

OptionsThingy.prototype.dumb_cb = function () {
    // log('dumb_cb');
};

OptionsThingy.prototype.getCannedConfigList = function (cb) {
    cb(null);
};

OptionsThingy.prototype.restorePluginOptions = function () {
    log('restorePluginOptions START');

    let tthis = this;
    chrome.storage.local.get(null, function (settings) {

        copyDictByKeys(tthis.current_settings, settings);

        log('resetting config_source in restorePluginOptions');
        tthis.storeThings({
                'config_source': defaults.config_source
            },
            function () {});

        tthis.finishRestoringOptions();
        loadConfig(tthis.current_settings, tthis.updateConfigDisplay.bind(tthis), default_config);
    });
};

OptionsThingy.prototype.finishRestoringOptions = function () {
    log('finishRestoringOptions START');
    let tthis = this;
    let restoreThing = function(name, inpname, checkbox = false) {
        const thingelem = document.getElementById(inpname);
        log(inpname);
        log(thingelem);
        if (tthis.current_settings.hasOwnProperty(name)) {
            if (checkbox) {
                thingelem.checked = tthis.current_settings[name];
            } else {
                thingelem.value = tthis.current_settings[name];
            }
        } else {
            chrome.storage.local.set({
                name: defaults[name]
            }, function () {
                if (checkbox) {
                    thingelem.checked = defaults[name];
                } else {
                    thingelem.value = defaults[name];
                }
            });
        }
    };

    for (let i = 0; i < this.restorethings.length; i++)
        restoreThing.apply(this, this.restorethings[i]);

    this.grayWhitelist();

    log('finishRestoringOptions DONE');
};

OptionsThingy.prototype.saveEnabledActions = function () {
    log('saveEnabledActions');
    let enelem = document.getElementById('actionstd');
    let children = enelem.childNodes;
    let enabled = {};
    for (let i = 0; i < children.length; i++) {
        let groupdiv = children[i];
        let divchildren = groupdiv.childNodes;
        for (let j = 0; j < divchildren.length; j++) {
            let cbox = divchildren[j];
            if (cbox.nodeName === 'INPUT') {
                const m = cbox.id.match(/^([\w-]+)_check/);
                if (m) {
                    let action = m[1];
                    enabled[action] = cbox.checked;
                }
            }
        }
    }

    this.storeThings({
        'enabled_actions': enabled
    }, function () {
        log(enabled);
        log('saved action changes');
    });
};


OptionsThingy.prototype.showEnabledActionsList = function (settings, cfg_actions) {
    log('showEnabledActionsList()');
    let enelem = document.getElementById('actionstd');

    let enabled = {};
    let action;
    let enable_this = true;
    let i;

    let action_names = Object.keys(cfg_actions);

    // NEW way to handle enabled actions:
    // get a list of actions that the user can enable or disable.
    // if the user has a preference already stored for an action of 
    // that name, use it, otherwise set it to enabled.
    for (i = 0; i < action_names.length; i++) {
        action = action_names[i];
        enable_this = true;
        if (settings.hasOwnProperty('enabled_actions') &&
            settings.enabled_actions.hasOwnProperty(action)) {
            enable_this = settings.enabled_actions[action];
        } else if (cfg_actions[action].hasOwnProperty('default_enabled')) {
            enable_this = Boolean(cfg_actions[action].default_enabled);
        }

        enabled[action] = enable_this;
    }

    removeChildrenReplaceWith(enelem, []);
    for (i = 0; i < action_names.length; i++) {
        action = action_names[i];
        const label_elem = document.createElement('span');
        label_elem.textContent = action + ' ';
        const check_elem = document.createElement('input');
        check_elem.type = 'checkbox';
        check_elem.name = action + '_check';
        check_elem.value = action;
        check_elem.id = action + '_check';
        check_elem.checked = enabled[action];
        check_elem.onchange = this.saveEnabledActions.bind(this);
        let groupingdiv = document.createElement('div');
        groupingdiv.appendChild(label_elem);
        groupingdiv.appendChild(check_elem);
        groupingdiv.style.display = 'inline-block';
        enelem.appendChild(groupingdiv);
        if (i !== action_names.length - 1) {
            let pipe_elem = document.createElement('span');
            pipe_elem.textContent = ' | ';
            enelem.appendChild(pipe_elem);
        }

    }
};

OptionsThingy.prototype.updateConfigDisplay = function (err, cfg) {
    log('updateConfigDisplay START');

    let jselem = document.getElementById('configjson');
    let urlem = document.getElementById('configsrc');

    if (this && this.hasOwnProperty('current_settings') && (err === null)) {
        // this is here rather than in earlier in restorePluginOptions
        // becauase generating this list requires the config as well as
        // the plugin options
        this.showEnabledActionsList(this.current_settings, cfg.actions);
        jselem.value = JSON.stringify(cfg, null, 2);
    } else {
        log('error');
        jselem.value = "ERROR:" + err;
    }
    log('updateConfigDisplay DONE');
};

OptionsThingy.prototype.saveGen = function (name, inpname, checkbox = false) {
    log('saving ' + name);
    let elem = document.getElementById(inpname);
    let v;
    if (checkbox) {
        v = elem.checked;
    } else {
        v = elem.value;
    }
    let sv = {};
    sv[name] = v;

    this.storeThings(sv, function () {
        log(name + ' saved');
    });
};


OptionsThingy.prototype.saveImgReplURL = function () {
    log('saveImgReplURL START');
    let srcelem = document.getElementById('imgreplsrcinput');
    let url = srcelem.value;

    let not_an_url = url.match(/^__(\w+)__$/);
    if (not_an_url) {
        this.storeThings({
            imgreplsrc: url,
        }, function() {});
        return;
    }

    let tthis = this;
    chrome.runtime.sendMessage(
        null, {
            cmd: 'get',
            url: url + '/img_list.json'
        }, null,
        function(resp) {
            let imgrepldata = null;
            if (resp.err == 'OK') {
                try {
                    resp.text += "\n";
                    imgrepldata = JSON.parse(resp.text);
                    log(imgrepldata);
                    tthis.storeThings({
                        imgreplsrc: url,
                        imgrepldata: imgrepldata,
                    }, function() {
                        log('imgrepldata saved');
                        chrome.storage.local.get(['imgreplsrc'], function(x) {
                            log(x);
                        });
                    });
                } catch (e) {
                    return 'err_fetching_imgrepldata';
                }

            } else {
                log('imgrepldata not saved');
            }
        });
};


OptionsThingy.prototype.saveConfigURL = function() {
    log('saveConfigURL START');
    let srcelem = document.getElementById('configsrc');
    let url = srcelem.value;

    let tthis = this;
    this.storeThings({
            'config_source': url,
            'config_valid': false,
            'config_date': 0
        },
        function() {
            log('config_source saved');
            loadConfig(tthis.current_settings, tthis.updateConfigDisplay, default_config);
            tthis.restorePluginOptions();
            log('saveConfigURL DONE');
        }
    );
};

OptionsThingy.prototype.setupSaveHandlers = function() {
    for (let i = 0; i < this.savethings.length; i++) {
        let st = this.savethings[i];
        document.getElementById(st[0]).addEventListener(st[1], st[2]);
    }
};


function setup_handlers() {

    let ot = new OptionsThingy();

    log('adding onloaded handler');
    document.addEventListener('DOMContentLoaded', ot.restorePluginOptions.bind(ot));

    log('adding save handler');
    ot.setupSaveHandlers();

    document.getElementById('showconfigcheck').addEventListener('change', function(ev) {
        let configdiv = document.getElementById('configdiv');
        let tgt = ev.target || ev.srcElement;
        configdiv.style.display = tgt.checked ? 'block' : 'none';
    });
}

setup_handlers();
