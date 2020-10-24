/* jshint esversion:6 */
var ImageChanger = function(settings, config) {
    this.current_settings = settings;
    this.current_config = config;
};

// this routine starts with an element and tries to work up
// the hierarchy to see if it is enclosed anywhere by an 'a',
// and then if that a's link matches the regex supplies, we
// return true.
ImageChanger.prototype.findParentLinkMatch = function(elem, re) {
    var done = false;
    var celem = elem;
    var count = 0;
    while (count < 15) {
        if (celem && (celem.nodeName === 'A')) {
            var ss = decodeURIComponent(celem.href);
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

var swapOldNewSrc = function(elem) {
    var old_src = elem.getAttribute('old_src');
    if (old_src) {
        var new_old_src = elem.src;
        elem.setAttribute('old_src',new_old_src);
        elem.src = old_src;
    }
};
var unReplaceEventHandler = function(ev) {
    ev.preventDefault();
    swapOldNewSrc(ev.target);
    ev.target.removeEventListener('click',unReplaceEventHandler);
};



ImageChanger.prototype.run = function(imgs = null) {
    log('switch_imgs()');

    // we do not need to do anything if we get a zero length list
    if (imgs && !imgs.length) return;

    var tthis = this;

    if (true) {
        var action_count = 0;

        var mode = useIfElse(this.current_settings,'replace_images',false);

        if (mode) {
            log('trying to replace images');
            var actions_to_run = getRunnableActions(tthis.current_config.actions, this.current_settings);

            for (var n = 0; n < actions_to_run.length; n++) {
                action_name = actions_to_run[n];
                var action = tthis.current_config.actions[action_name];
                var alt_re = new RegExp(action.find_regex[0],
                    action.find_regex[1]);
                var src_re;
                if (action.hasOwnProperty('img_find_regex')) {
                    src_re = new RegExp(action.img_find_regex[0],
                        action.img_find_regex[1]);
                } else {
                    src_re = new RegExp(action.find_regex[0], 'i');
                }

                if (!imgs) imgs = document.getElementsByTagName('img');
                for (var i = 0; i < imgs.length; i++) {
                    var img = imgs[i];
                    var one_of_ours = img.getAttribute('blackedout');
                    if (one_of_ours) {
                        log('already blackedout: ' + img.src);
                        break;
                    }

                    // Super-sophisticated image detection algorithm here:
                    // -- does the alt text look trumpian?
                    var alt_match = alt_re.exec(img.alt);
                    // does the image source itself look trumpian?
                    var src_match = src_re.exec(decodeURIComponent(img.src));
                    // is there anything trumpian in the style tag?
                    var sty_match = src_re.exec(decodeURIComponent(img.style));
                    // is there an enclosing "A" parent whose href looks trumpian?
                    var parent_link_match = false;
                    try {
                        parent_link_match = tthis.findParentLinkMatch(img, src_re);
                    } catch (w) {}

                    if (alt_match || src_match || sty_match || parent_link_match) {
                        log('alt: ' + alt_match + ' src: ' + src_match + ' sty: ' + sty_match +
                            ' prnt: ' + parent_link_match);
                        var replsrc;
                        var ni = null;
                        log('looking to replace: ' + img.src);
                        var iw = img.clientWidth;
                        var ih = img.clientHeight;
                        replsrc = chrome.runtime.getURL("icons/black-400.png");
                        if (!img.getAttribute('replcfg_blackedout')) {
                            log('[replcfg]: replacing ' + img.src + ' with ' + replsrc);
                            ni = document.createElement('img');
                            ni.title = 'Click to see original image';
                            ni.style.width = Math.floor(iw + 0.5).toString() + 'px';
                            ni.style.height = Math.floor(ih + 0.5).toString() + 'px';
                            ni.setAttribute('replcfg_blackedout', true);
                            ni.setAttribute('old_src',img.src);
                            ni.src = replsrc;
                            img.parentNode.replaceChild(ni, img);
                            ni.addEventListener('click', unReplaceEventHandler);
                        }
                    } else {
                        // log('no match');
                    }
                }
            }
        }
    }
};
