/* jshint esversion:6 */
import {log, useIfElse} from './shared';

export const ImageChanger = function (settings, config) {
	this.current_settings = settings;
	this.current_config = config;
};

// This routine starts with an element and tries to work up
// the hierarchy to see if it is enclosed anywhere by an 'a',
// and then if that a's link matches the regex supplies, we
// return true.
ImageChanger.prototype.findParentLinkMatch = function (elem, re) {
	let celem = elem;
	let count = 0;
	while (count < 15) {
		if (celem && (celem.nodeName === 'A')) {
			if (celem.href) {
				if (re.exec(decodeURIComponent(celem.href))) {
					return true;
				}

				return false;
			}
		}

		count += 1;
		celem = celem.parentElement;
		if (celem === null) {
			return false;
		}
	}

	return false;
};

const swapOldNewSrc = function (elem) {
	const old_src = elem.getAttribute('old_src');
	if (old_src) {
		const new_old_src = elem.src;
		elem.setAttribute('old_src', new_old_src);
		elem.src = old_src;
	}
};

const unReplaceEventHandler = function (ev) {
	ev.preventDefault();
	swapOldNewSrc(ev.target);
	ev.target.removeEventListener('click', unReplaceEventHandler);
};

ImageChanger.prototype.run = function (imgs = null, getRunnableActions) {
	log('switch_imgs()');

	// We do not need to do anything if we get a zero length list
	if (imgs && !imgs.length) {
		return;
	}

	const tthis = this;

	const mode = useIfElse(this.current_settings, 'replace_images', false);

	if (mode) {
		log('trying to replace images');
		const actions_to_run = getRunnableActions(tthis.current_config.actions, this.current_settings);

		for (let n = 0; n < actions_to_run.length; n++) {
			const action_name = actions_to_run[n];
			const action = tthis.current_config.actions[action_name];
			const alt_re = new RegExp(action.find_regex[0],
				action.find_regex[1]);
			let src_re;
			if (action.hasOwnProperty('img_find_regex')) {
				src_re = new RegExp(action.img_find_regex[0],
					action.img_find_regex[1]);
			} else {
				src_re = new RegExp(action.find_regex[0], 'i');
			}

			if (!imgs) {
				imgs = document.querySelectorAll('img');
			}

			for (let i = 0; i < imgs.length; i++) {
				const img = imgs[i];
				const one_of_ours = img.getAttribute('blackedout');
				if (one_of_ours) {
					log('already blackedout: ' + img.src);
					break;
				}

				// Super-sophisticated image detection algorithm here:
				// -- does the alt text look trumpian?
				const alt_match = alt_re.exec(img.alt);
				// Does the image source itself look trumpian?
				const src_match = src_re.exec(decodeURIComponent(img.src));
				// Is there anything trumpian in the style tag?
				const sty_match = src_re.exec(decodeURIComponent(img.style));
				// Is there an enclosing "A" parent whose href looks trumpian?
				let parent_link_match = false;
				try {
					parent_link_match = tthis.findParentLinkMatch(img, src_re);
				} catch (error) {}

				if (alt_match || src_match || sty_match || parent_link_match) {
					log('alt: ' + alt_match + ' src: ' + src_match + ' sty: ' + sty_match +
                            ' prnt: ' + parent_link_match);
					let replsrc;
					let ni = null;
					log('looking to replace: ' + img.src);
					const iw = img.clientWidth;
					const ih = img.clientHeight;
					replsrc = chrome.runtime.getURL('icons/black-400.png');
					if (!img.getAttribute('replcfg_blackedout')) {
						log('[replcfg]: replacing ' + img.src + ' with ' + replsrc);
						ni = document.createElement('img');
						ni.title = 'Click to see original image';
						ni.style.width = Math.floor(iw + 0.5).toString() + 'px';
						ni.style.height = Math.floor(ih + 0.5).toString() + 'px';
						ni.setAttribute('replcfg_blackedout', true);
						ni.setAttribute('old_src', img.src);
						ni.src = replsrc;
						img.parentNode.replaceChild(ni, img);
						ni.addEventListener('click', unReplaceEventHandler);
					}
				}
			}
		}
	}
};
