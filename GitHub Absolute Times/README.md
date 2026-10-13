GitHub Absolute Times
====

GitHub の相対時刻（「3 hours ago」など）を絶対時刻に置き換える UserScript です。

## 動作

- `https://github.com/*` の `relative-time` 要素を日時のテキストに置き換えます。
- 日時の表示形式とタイムゾーンはブラウザーのロケール・設定に従います。
- ページ内に動的に追加された時刻も変換します。
- Lodash 4.17.21 を cdnjs から読み込みます。

## インストール

Tampermonkey / Violentmonkey などの UserScript マネージャーをインストールしたうえで、
[配布ページ](https://mohemohe.github.io/userscripts/) の **GitHub Absolute Times** からインストールしてください。
