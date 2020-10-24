(function(modules) {
  var installedModules = {};
  function __webpack_require__(moduleId) {
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }
    var module = installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {}
    };
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    module.l = true;
    return module.exports;
  }
  __webpack_require__.m = modules;
  __webpack_require__.c = installedModules;
  __webpack_require__.d = function(exports, name, getter) {
    if (!__webpack_require__.o(exports, name)) {
      Object.defineProperty(exports, name, {
        enumerable: true,
        get: getter
      });
    }
  };
  __webpack_require__.r = function(exports) {
    if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
      Object.defineProperty(exports, Symbol.toStringTag, {
        value: "Module"
      });
    }
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
  };
  __webpack_require__.t = function(value, mode) {
    if (mode & 1) value = __webpack_require__(value);
    if (mode & 8) return value;
    if (mode & 4 && typeof value === "object" && value && value.__esModule) return value;
    var ns = Object.create(null);
    __webpack_require__.r(ns);
    Object.defineProperty(ns, "default", {
      enumerable: true,
      value: value
    });
    if (mode & 2 && typeof value != "string") for (var key in value) __webpack_require__.d(ns, key, function(key) {
      return value[key];
    }.bind(null, key));
    return ns;
  };
  __webpack_require__.n = function(module) {
    var getter = module && module.__esModule ? function getDefault() {
      return module["default"];
    } : function getModuleExports() {
      return module;
    };
    __webpack_require__.d(getter, "a", getter);
    return getter;
  };
  __webpack_require__.o = function(object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  };
  __webpack_require__.p = "";
  return __webpack_require__(__webpack_require__.s = 1);
})([ , function(module, exports) {
  function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (var i = arr1.length; i--; ) {
      if (arr1[i] !== arr2[i]) return false;
    }
    return true;
  }
  var OptionsThingy = function() {
    this.current_settings = {};
    this.restorethings = [ [ "site_filter", "site_filter", false ], [ "track_mutations", "track_mutations", true ], [ "replace_images", "replace_images", true ], [ "user_blacklist", "user_blacklist", false ], [ "user_whitelist", "user_whitelist", false ] ];
    var tthis = this;
    this.savethings = [ [ "site_filter", "change", function() {
      tthis.grayWhitelist();
      tthis.saveGen("site_filter", "site_filter", false);
    } ], [ "track_mutations", "change", function() {
      tthis.saveGen("track_mutations", "track_mutations", true);
    } ], [ "replace_images", "change", function() {
      tthis.saveGen("replace_images", "replace_images", true);
    } ], [ "user_blacklist", "change", function() {
      tthis.saveGen("user_blacklist", "user_blacklist", false);
    } ], [ "user_whitelist", "change", function() {
      tthis.saveGen("user_whitelist", "user_whitelist", false);
    } ], [ "blacklist_save_button", "click", function() {
      neatenList("user_blacklist");
      tthis.saveGen("user_blacklist", "user_blacklist", false);
    } ], [ "whitelist_save_button", "click", function() {
      neatenList("user_whitelist");
      tthis.saveGen("user_whitelist", "user_whitelist", false);
    } ], [ "blacklist_add_button", "click", function() {
      getCurrentWindowHost(host => {
        if (host) {
          neatenList("user_blacklist", host);
          tthis.saveGen("user_blacklist", "user_blacklist", false);
        }
      });
    } ], [ "whitelist_add_button", "click", function() {
      getCurrentWindowHost(host => {
        if (host) {
          neatenList("user_whitelist", host);
          tthis.saveGen("user_whitelist", "user_whitelist", false);
        }
      });
    } ], [ "whitelist_addconfig_button", "click", function() {
      var configwhitelist = tthis.getConfigWhitelist();
      if (configwhitelist) {
        document.getElementById("user_whitelist").value = configwhitelist;
        neatenList("user_whitelist");
        tthis.saveGen("user_whitelist", "user_whitelist", false);
      }
    } ], [ "reset_storage", "click", function() {
      tthis.resetStorage();
    } ], [ "save_edits", "click", function() {
      tthis.save_config_edits();
    } ] ];
  };
  OptionsThingy.prototype.grayWhitelist = function() {
    var use_whitelist = document.getElementById("site_filter").value == "use_whitelist";
    [ [ "whitelist_save_button", false ], [ "whitelist_add_button", false ], [ "whitelist_addconfig_button", false ], [ "wl_td", false ], [ "user_whitelist", false ], [ "blacklist_save_button", true ], [ "blacklist_add_button", true ], [ "user_blacklist", true ], [ "bl_td", true ] ].forEach(n => {
      var disable = use_whitelist && n[1] || !use_whitelist && !n[1];
      var el = document.getElementById(n[0]);
      el.disabled = disable ? true : false;
      el.className = disable ? "disabled" : "";
    });
  };
  OptionsThingy.prototype.getConfigWhitelist = function() {
    if (this.current_settings && this.current_settings.cfgdata && this.current_settings.cfgdata.whitelist) {
      return this.current_settings.cfgdata.whitelist.join(" ");
    }
    return null;
  };
  var neatenList = function(listname, to_add = null) {
    var bl = document.getElementById(listname);
    if (to_add) bl.value += " " + to_add;
    var il = bl.value.split(/[^\w\.-]+/).map(x => x.trim()).filter(x => x.length);
    var id = {};
    il.forEach(i => {
      id[i] = 1;
    });
    il = Object.keys(id).sort();
    bl.value = il.join(" ");
    return il;
  };
  OptionsThingy.prototype.storeThings = function(dict, cb) {
    var tthis = this;
    chrome.storage.local.set(dict, (function() {
      copyDictByKeys(tthis.current_settings, dict);
      return cb(tthis.current_settings);
    }));
  };
  OptionsThingy.prototype.selectConfig = function(e) {
    this.genericSelect(e, "configsrc", this.saveConfigURL.bind(this));
  };
  OptionsThingy.prototype.selectImgReplConfig = function(e) {
    this.genericSelect(e, "imgreplsrcinput", this.saveImgReplURL.bind(this));
  };
  OptionsThingy.prototype.genericSelect = function(e, srcename, save_fn) {
    var tgt = e.target || e.srcElement;
    var id = tgt.id;
    var new_url = tgt.value;
    log("genericSelect(): " + new_url);
    var srcelem = document.getElementById(srcename);
    var curr_url = srcelem.value;
    if (new_url !== curr_url) {
      srcelem.value = new_url;
      save_fn();
    }
  };
  OptionsThingy.prototype.save_config_edits = function() {
    var jselem = document.getElementById("configjson");
    var jsontext = jselem.value;
    var new_config = null;
    try {
      new_config = JSON.parse(jsontext);
    } catch (e) {
      log(e);
    }
    if (new_config) {
      chrome.storage.local.set({
        cfgdata: new_config
      }, (function() {
        jselem.value = JSON.stringify(new_config, null, 2);
      }));
    }
  };
  OptionsThingy.prototype.resetStorage = function() {
    this.current_settings = {};
    var tthis = this;
    zapStorage((function(config_source) {
      tthis.current_settings.config_source = config_source;
      log("storage zapped");
      loadConfig(tthis.current_settings, (function(err, res) {
        tthis.updateConfigDisplay(err, res);
        tthis.restorePluginOptions();
      }));
    }));
  };
  OptionsThingy.prototype.dumb_cb = function() {};
  OptionsThingy.prototype.getCannedConfigList = function(cb) {
    var args = [ "buttonsdiv", "confselect", "configsrc", this.selectConfig.bind(this), defaults.buttons_fetch_url ];
    cb(null);
  };
  OptionsThingy.prototype.restorePluginOptions = function() {
    log("restorePluginOptions START");
    var tthis = this;
    chrome.storage.local.get(null, (function(settings) {
      copyDictByKeys(tthis.current_settings, settings);
      log("resetting config_source in restorePluginOptions");
      tthis.storeThings({
        config_source: defaults.config_source
      }, (function() {}));
      tthis.finishRestoringOptions();
      loadConfig(tthis.current_settings, tthis.updateConfigDisplay.bind(tthis));
    }));
  };
  OptionsThingy.prototype.finishRestoringOptions = function() {
    log("finishRestoringOptions START");
    var tthis = this;
    var restoreThing = function(name, inpname, checkbox = false) {
      var thingelem = document.getElementById(inpname);
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
        }, (function() {
          if (checkbox) {
            thingelem.checked = defaults[name];
          } else {
            thingelem.value = defaults[name];
          }
        }));
      }
    };
    for (var i = 0; i < this.restorethings.length; i++) restoreThing.apply(this, this.restorethings[i]);
    this.grayWhitelist();
    log("finishRestoringOptions DONE");
  };
  OptionsThingy.prototype.saveEnabledActions = function() {
    log("saveEnabledActions");
    var enelem = document.getElementById("actionstd");
    var children = enelem.childNodes;
    enabled = {};
    for (var i = 0; i < children.length; i++) {
      var groupdiv = children[i];
      var divchildren = groupdiv.childNodes;
      for (var j = 0; j < divchildren.length; j++) {
        var cbox = divchildren[j];
        if (cbox.nodeName === "INPUT") {
          var m = cbox.id.match(/^([\w-]+)_check/);
          if (m) {
            var action = m[1];
            enabled[action] = cbox.checked;
          }
        }
      }
    }
    this.storeThings({
      enabled_actions: enabled
    }, (function() {
      log(enabled);
      log("saved action changes");
    }));
  };
  OptionsThingy.prototype.showEnabledActionsList = function(settings, cfg_actions) {
    log("showEnabledActionsList()");
    var enelem = document.getElementById("actionstd");
    var enabled = {};
    var action;
    var enable_this = true;
    var i;
    var action_names = Object.keys(cfg_actions);
    for (i = 0; i < action_names.length; i++) {
      action = action_names[i];
      enable_this = true;
      if (settings.hasOwnProperty("enabled_actions") && settings.enabled_actions.hasOwnProperty(action)) {
        enable_this = settings.enabled_actions[action];
      } else if (cfg_actions[action].hasOwnProperty("default_enabled")) {
        enable_this = Boolean(cfg_actions[action].default_enabled);
      }
      enabled[action] = enable_this;
    }
    removeChildrenReplaceWith(enelem, []);
    for (i = 0; i < action_names.length; i++) {
      action = action_names[i];
      var label_elem = document.createElement("span");
      label_elem.textContent = action + " ";
      var check_elem = document.createElement("input");
      check_elem.type = "checkbox";
      check_elem.name = action + "_check";
      check_elem.value = action;
      check_elem.id = action + "_check";
      check_elem.checked = enabled[action];
      check_elem.onchange = this.saveEnabledActions.bind(this);
      var groupingdiv = document.createElement("div");
      groupingdiv.appendChild(label_elem);
      groupingdiv.appendChild(check_elem);
      groupingdiv.style.display = "inline-block";
      enelem.appendChild(groupingdiv);
      if (i !== action_names.length - 1) {
        var pipe_elem = document.createElement("span");
        pipe_elem.textContent = " | ";
        enelem.appendChild(pipe_elem);
      }
    }
  };
  OptionsThingy.prototype.updateConfigDisplay = function(err, cfg) {
    log("updateConfigDisplay START");
    var jselem = document.getElementById("configjson");
    var urlem = document.getElementById("configsrc");
    if (this && this.hasOwnProperty("current_settings") && err === null) {
      this.showEnabledActionsList(this.current_settings, cfg.actions);
      jselem.value = JSON.stringify(cfg, null, 2);
    } else {
      log("error");
      jselem.value = "ERROR:" + err;
    }
    log("updateConfigDisplay DONE");
  };
  OptionsThingy.prototype.saveGen = function(name, inpname, checkbox = false) {
    log("saving " + name);
    var elem = document.getElementById(inpname);
    var v;
    if (checkbox) {
      v = elem.checked;
    } else {
      v = elem.value;
    }
    var sv = {};
    sv[name] = v;
    this.storeThings(sv, (function() {
      log(name + " saved");
    }));
  };
  OptionsThingy.prototype.saveImgReplURL = function() {
    log("saveImgReplURL START");
    var srcelem = document.getElementById("imgreplsrcinput");
    var url = srcelem.value;
    var not_an_url = url.match(/^__(\w+)__$/);
    if (not_an_url) {
      this.storeThings({
        imgreplsrc: url
      }, (function() {}));
      return;
    }
    var tthis = this;
    chrome.runtime.sendMessage(null, {
      cmd: "get",
      url: url + "/img_list.json"
    }, null, (function(resp) {
      var imgrepldata = null;
      if (resp.err == "OK") {
        try {
          resp.text += "\n";
          imgrepldata = JSON.parse(resp.text);
          log(imgrepldata);
          tthis.storeThings({
            imgreplsrc: url,
            imgrepldata: imgrepldata
          }, (function() {
            log("imgrepldata saved");
            chrome.storage.local.get([ "imgreplsrc" ], (function(x) {
              log(x);
            }));
          }));
        } catch (e) {
          return "err_fetching_imgrepldata";
        }
      } else {
        log("imgrepldata not saved");
      }
    }));
  };
  OptionsThingy.prototype.saveConfigURL = function() {
    log("saveConfigURL START");
    var srcelem = document.getElementById("configsrc");
    var url = srcelem.value;
    var tthis = this;
    this.storeThings({
      config_source: url,
      config_valid: false,
      config_date: 0
    }, (function() {
      log("config_source saved");
      loadConfig(tthis.current_settings, tthis.updateConfigDisplay);
      tthis.restorePluginOptions();
      log("saveConfigURL DONE");
    }));
  };
  OptionsThingy.prototype.setupSaveHandlers = function() {
    for (var i = 0; i < this.savethings.length; i++) {
      var st = this.savethings[i];
      document.getElementById(st[0]).addEventListener(st[1], st[2]);
    }
  };
  getCurrentWindowHost = function(cb) {
    chrome.windows.getCurrent({
      populate: true
    }, w => {
      for (var i = 0; i < w.tabs.length; i++) {
        var tab = w.tabs[i];
        if (tab && tab.active) {
          var a = document.createElement("a");
          a.href = tab.url;
          var host = a.hostname;
          return cb(host);
        }
      }
      return cb(null);
    });
  };
  function setup_handlers() {
    var ot = new OptionsThingy;
    log("adding onloaded handler");
    document.addEventListener("DOMContentLoaded", ot.restorePluginOptions.bind(ot));
    log("adding save handler");
    ot.setupSaveHandlers();
    document.getElementById("showconfigcheck").addEventListener("change", (function(ev) {
      var configdiv = document.getElementById("configdiv");
      var tgt = ev.target || ev.srcElement;
      configdiv.style.display = tgt.checked ? "block" : "none";
    }));
  }
  setup_handlers();
} ]);