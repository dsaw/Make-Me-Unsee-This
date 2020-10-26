/* jshint esversion:6 */
export var debug_mode = false;

export var log_count = 0;

export function log(t) {
	try {
		let sd = document.querySelector('#statusdiv');
		sd.innerText += '(' + log_count + '): ' + t + '\n';
		sd.scrollTop = sd.scrollHeight;
		log_count += 1;
	} catch (error) {}

	if (debug_mode) {
		console.log(t);
	}
}

export function zapStorage(cb) {
	chrome.storage.local.clear(() => {
            cb(null);
    });
}

export let loadConfig = function (settings, cb, default_config) {
	chrome.storage.local.get(['cfgdata'], items => {
		if (items.cfgdata) {
			cb(null, items.cfgdata);
		} else {
			chrome.storage.local.set({
				cfgdata: default_config
			}, () => {
				chrome.storage.local.get(['cfgdata'], (items) => {
                    cb(null, items.cfgdata);
                });
			});
		}
	});
};

export function copyDictByKeys(dst, src) {
	const ks = Object.keys(src);
	for (let i = 0; i < ks.length; i++) {
		dst[ks[i]] = src[ks[i]];
	}
}

export function removeChildrenReplaceWith(elem, newchildren) {
	while (elem.firstChild) {
		elem.removeChild(elem.firstChild);
	}

	for (let i = 0; i < newchildren.length; i++) {
		elem.append(newchildren[i]);
	}
}

export function useIfElse(dict, name, deflt) {
	return dict.hasOwnProperty(name) ? dict[name] : deflt;
}

export function replace_elem_with_array_of_elems(orig, arry) {
	// Log('replace_elem_with_array_of_elems');
	const newnode = document.createElement('span');
	for (let k = 0; k < arry.length; k++) {
		newnode.append(arry[k]);
	}

	orig.parentNode.replaceChild(newnode, orig);
}
