userscripts
====

userscriptをおいておくための場所  
詳細はそれぞれのディレクトリ内のREADME.mdに記載してる

## 配布ページ

GitHub Pages: <https://mohemohe.github.io/userscripts/>

サブディレクトリ内の `*.user.js` をビルド時に再帰スキャンし、ディレクトリごとに
サイドバーへ表示します。同じディレクトリの `README.md` は Markdown として表示され、
各スクリプトをインストールできます。README がないディレクトリや、複数のスクリプトにも対応します。
UserScript マネージャー（Tampermonkey / Violentmonkey など）を事前にインストールしてください。

### スクリプトの追加

```text
script-name/
├── README.md
└── script-name.user.js
```

この構成で追加して `master` に push すると、一覧と配布ファイルが自動更新されます。
ネストしたディレクトリにも対応します。`site/` は配布サイト専用です。
隠しディレクトリ、`node_modules/`、`dist/`、`build/`、`coverage/`、シンボリックリンク、
リポジトリ直下のスクリプトはスキャン対象外です。
README 内の相対リンク・画像は GitHub 上の元のファイルを参照します。生の HTML は描画しません。

### GitHub Pages の初期設定

1. リポジトリの **Settings → Pages → Build and deployment → Source** を **GitHub Actions** に設定します。
2. `master` に push（または **Publish UserScripts** workflow を手動実行）します。

`.github/workflows/pages.yml` がテスト・lint・型チェック・静的ビルドを実行し、
`actions/deploy-pages@v5` で公開します。Pull Request では検証のみ行い、公開しません。

### ローカル開発

Node.js 22.12 以上を使用します。

```sh
cd site
npm ci
npm run dev
```

スクリプトや README を変更した場合は開発サーバーを再起動してカタログを再生成してください。

```sh
npm test
npm run lint
npm run build
npm run preview
```

React / Vite / Tailwind CSS / shadcn/ui を使用しています。ビルド成果物は `site/dist/` です。
スクリプトはバンドル・加工せず、元の内容のまま `.user.js` として配布します。
shadcn/ui コンポーネントのライセンスは `site/THIRD_PARTY_LICENSES.md` を参照してください。