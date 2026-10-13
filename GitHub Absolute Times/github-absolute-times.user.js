// ==UserScript==
// @name         Github: always show absolute times
// @namespace    dev.mohemohe.absoluteTimes.GitHub
// @match        https://github.com/*
// @grant       none
// @version     1.0
// @author      -
// @description 2024/4/22 14:40:04
// @require     https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js
// ==/UserScript==

const stopPropagation = (e) => e.stopPropagation();

const linkify = () => {
  document.querySelectorAll("relative-time").forEach(function(el) {
        var parent = el.parentNode;
        var timestamp = el.datetime;
        var span = document.createElement("span");
        span.innerHTML = new Date(timestamp).toLocaleString();
        parent.removeChild(el);
        parent.appendChild(span);
    });
};

const mo = new MutationObserver(_.debounce(changes => {
  linkify();
}), 1000);
mo.observe(document.body, {
    childList: true,
    subtree: true,
});
linkify();
