// ==UserScript==
// @name         AWS Redirect
// @namespace    dev.mohemohe.redirect.AWS
// @version      2
// @description  AWS マネジメントコンソールを東京リージョンに固定する
// @author       mohemohe
// @match        https://*.console.aws.amazon.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(() => {
    const region = 'ap-northeast-1';
    const whitelist = ['/route53', '/cloudfront', '/route53domains', '/costmanagement'];
    const url = new URL(window.location.href);

    if (whitelist.some(path => url.pathname === path || url.pathname.startsWith(`${path}/`))) {
        return;
    }

    url.hostname = `${region}.console.aws.amazon.com`;
    if (url.searchParams.has('region') && url.searchParams.getAll('region').some(value => value !== region)) {
        url.searchParams.set('region', region);
    }

    if (url.href !== window.location.href) {
        window.location.replace(url.href);
    }
})();
