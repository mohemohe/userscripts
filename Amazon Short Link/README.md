Amazon Short Link
====

Amazon.co.jp の商品ページに短縮リンクとコピーボタンを表示する UserScript です。

## 動作

- ページの読み込み完了時に、商品ページの右カラム（`rightCol`）へ短縮リンクを追加します。
- URL の `/dp/` に続く10桁の英数字の商品 ID から、`https://www.amazon.co.jp/dp/商品ID/` を生成します。
- 「クリップボードにコピー」ボタンで短縮リンクをコピーできます。

## 注意事項

提供されたスクリプトをそのまま収録しています。`@match` に含まれる `/gp/product/` 形式でも、
パスに `/dp/商品ID` がない場合や、ページに `rightCol` がない場合は動作しません。

## インストール

Tampermonkey / Violentmonkey などの UserScript マネージャーをインストールしたうえで、
[配布ページ](https://mohemohe.github.io/userscripts/) の **Amazon Short Link** からインストールしてください。
