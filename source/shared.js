/*jshint esversion:6 */
export var debug_mode = false;

export var log_count = 0;

export function log(t) {
    try {
        sd = document.getElementById('statusdiv');
        sd.innerText += '(' + log_count + '): ' + t + "\n";
        sd.scrollTop = sd.scrollHeight;
        log_count += 1;
    } catch (e) {}
    if (debug_mode) {
        console.log(t);
    }
}

export function zapStorage(cb) {
    chrome.storage.local.clear(function() {
            cb(null);
    });
}


export var loadConfig = function(settings, cb, default_config) {
    chrome.storage.local.get(['cfgdata'],(items) => {
        if (items.cfgdata) {
            cb(null, items.cfgdata);
        } else {
            chrome.storage.local.set({
                'cfgdata': default_config,
            }, () => {
                chrome.storage.local.get(['cfgdata'],function(items) {
                    cb(null, items.cfgdata);
                });
            });
        }
    });
};


export function copyDictByKeys(dst, src) {
    var ks = Object.keys(src);
    for (var i = 0; i < ks.length; i++) {
        dst[ks[i]] = src[ks[i]];
    }
}

export function removeChildrenReplaceWith(elem, newchildren) {
    while (elem.firstChild) {
        elem.removeChild(elem.firstChild);
    }
    for (var i = 0; i < newchildren.length; i++) {
        elem.appendChild(newchildren[i]);
    }
}

export function useIfElse(dict, name, deflt) {
    return dict.hasOwnProperty(name) ? dict[name] : deflt;
}

export function replace_elem_with_array_of_elems(orig, arry) {
    // log('replace_elem_with_array_of_elems');
    var newnode = document.createElement('span');
    for (var k = 0; k < arry.length; k++) {
        newnode.appendChild(arry[k]);
    }
    orig.parentNode.replaceChild(newnode, orig);
}
