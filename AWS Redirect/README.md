AWS Redirect
====

AWS マネジメントコンソールを常に東京リージョン（`ap-northeast-1`）へリダイレクトする UserScript です。

## 動作

- `https://*.console.aws.amazon.com/*` を開いた直後に、ホスト名を `ap-northeast-1.console.aws.amazon.com` に変更します。
- パス・クエリ・フラグメントは引き継ぎます。ただし、クエリに `region` がある場合は `ap-northeast-1` に揃え、元のリージョンへ戻るのを防ぎます。
- すでに東京リージョンの URL であれば、再読み込みしません。
- 履歴を置き換えるため、「戻る」でリダイレクト元に戻り続けることはありません。

## ホワイトリスト

以下のサービスはリダイレクトせず、元の URL のまま開きます（`us-east-1` への強制変更もしません）。

- Route 53: `/route53` および `/route53/` 配下
- CloudFront: `/cloudfront` および `/cloudfront/` 配下

サービス名の完全一致で判定するため、`/route53domains/` などは除外しません。
ホワイトリストを変更する場合は、スクリプト内の `whitelist` を編集してください。

## インストール

Tampermonkey / Violentmonkey などの UserScript マネージャーをインストールしたうえで、
[配布ページ](https://mohemohe.github.io/userscripts/) の **AWS Redirect** からインストールしてください。
