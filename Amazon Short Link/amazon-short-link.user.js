// ==UserScript==
// @name        Amazon短縮リンク表示
// @namespace   dev.mohemohe.amazon.shorten
// @match       https://www.amazon.co.jp/dp/*
// @match       https://www.amazon.co.jp/*/dp/*
// @match       https://www.amazon.co.jp/*/gp/product/*
// @grant       none
// @version     1.0
// @author      -
// @description 2022/5/4 20:37:06
// ==/UserScript==

const regex = /dp\/([a-zA-Z0-9]{10})/;

window.addEventListener("load", () => {
  const id = location.pathname.match(regex)[1].split("/")[0];
  const link = `${location.origin}/dp/${id}/`;

  const div = document.createElement("div");
  div.innerText = "短縮リンク";

  const input = document.createElement("input");
  input.readOnly = true;
  input.value = link;
  input.style.width = "100%";

  const button = document.createElement("button");
  button.innerText = "クリップボードにコピー";
  button.onclick = () => navigator.clipboard.writeText(link);

  const wrapper = document.createElement("div");
  wrapper.appendChild(div);
  wrapper.appendChild(input);
  wrapper.appendChild(button);

  document.getElementById("rightCol").insertAdjacentElement("beforeend", wrapper);
});
