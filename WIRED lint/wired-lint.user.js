// ==UserScript==
// @name         WIRED lint
// @namespace    dev.mohemohe.lint.WIRED
// @version      1
// @description  fix WIRED.jp and/or other fucking page
// @author       mohemohe
// @match        *://*/*
// @grant        none
// ==/UserScript==

(() => {
    const dic = [
        {wrong: 'ヴァ', ja: 'バ'},
        {wrong: 'ヴィ', ja: 'ビ'},
        {wrong: 'ヴュ', ja: 'ビュ'},
        {wrong: 'ヴェ', ja: 'ベ'},
        {wrong: 'ヴォ', ja: 'ボ'},
        {wrong: 'ヴ', ja: 'ブ'},
        {wrong: 'ゐ', ja: 'い'},
        {wrong: 'ゑ', ja: 'え'},
    ];

    const regex = dic.map(d => ({...d, re: new RegExp(d.wrong, 'gu')}));

    const moConfig = {
        childList: true,
        attributes: true,
        characterData: true,
        subtree: true,
        attributeOldValue: true,
        characterDataOldValue: true,
    };

    const mo = new MutationObserver(_ => {
        fix(document.documentElement);
    });

    function isTextElement(element){
        if (element.parentNode != null) {
            const nodeName = element.parentNode.nodeName.toLowerCase();
            if ((nodeName == 'style') || (nodeName == 'script')) {
                return false;
            }
        }
        if (element.nodeName.toLowerCase() !== '#text') {
            return false;
        }

        return true;
    }

    function fix(element) {
        if (isTextElement(element)) {
            regex.some(_ => {
                if (element.nodeValue.match(_.re)) {
                    console.warn('[WIRED lint]', _.wrong, 'must be', _.ja, '|', element.nodeValue);
                    element.nodeValue = element.nodeValue.replace(_.re, _.ja);
                    return true;
                }
                return false;
            });
        }
        Array.from(element.childNodes).forEach(childNode => fix(childNode));
    }

    mo.observe(document.documentElement, moConfig);
    fix(document.documentElement);
})();
