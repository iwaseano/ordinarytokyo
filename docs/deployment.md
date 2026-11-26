# デプロイと外部サービス設定

## Azure Static Web Apps

1. GitHubにprivate repositoryを作成し、このローカルリポジトリに`origin`を設定して`main`をpushする。
2. AzureでStatic Web AppsのStandardプランを作成する。GitHubリポジトリ連携を有効にし、デフォルトブランチを`main`にする。
3. Static Web AppのデプロイトークンをGitHubリポジトリのSettings → Secrets and variables → Actionsに`AZURE_STATIC_WEB_APPS_API_TOKEN`として登録する。
4. `.github/workflows/azure-static-web-apps.yml`がPRビルド／プレビュー、`main`へのpushによる本番デプロイ、PRクローズ時のプレビュー削除を行う。
5. 設定後、PRのChecksとAzureのEnvironment URLでビルド・プレビューを確認する。フォークからのPRではGitHubがSecretsを渡さないため、Azureプレビューは作成されない。
6. 独自ドメイン取得後、Azure Static Web AppsのCustom domainsから`ordinarytokyo.com`を追加し、画面に表示されるDNSレコードをレジストラ側に設定する。HTTPS証明書の有効化後にトップ・canonical・sitemapのURLを確認する。

このリポジトリにはAzureリソースやデプロイトークンを含めない。実際のAzure接続・プレビューURLの発行には、所有者がAzure/GitHub側で上記設定を行う必要がある。

### devブランチの安定プレビュー

`dev`へのpushごとに、PRの有無にかかわらず確認できる安定したプレビュー環境を作る。Azure Static Web Appsのproduction branchは`main`のままにし、`dev`をブランチプレビューとしてデプロイする。

1. Azure Static Web AppsにGitHubリポジトリが接続され、production branchが`main`になっていることを確認する。
2. 有効なデプロイworkflowの`push.branches`に`main`と`dev`を指定する。現在の`.github/workflows/azure-static-web-apps.yml`では次のようにする。

   ```yaml
   on:
     push:
       branches:
         - main
         - dev
   ```

3. `Azure/static-web-apps-deploy@v1`のアップロード設定に`production_branch: main`を追加する。ビルド済みの`dist/`を配置する現在の方式では、設定は次のとおり。

   ```yaml
   with:
     action: upload
     app_location: dist
     api_location: ''
     output_location: ''
     skip_app_build: true
     production_branch: main
   ```

   Azureが生成したworkflowでOryxにビルドさせる方式を使う場合は、`app_location: "/"`、`output_location: "dist"`、`production_branch: "main"`を指定する。二つのworkflowが同じpushを重複デプロイしないよう、使わないAzure生成workflowは無効化または削除する。

4. workflow変更を`dev`へ反映し、`dev`へpushする。成功後、Azure PortalのStatic Web App → **Environments**で`dev`環境のURLを確認する。URL形式は`<DEFAULT_HOST_NAME>-dev.<LOCATION>.azurestaticapps.net`。独自ドメインはプレビュー環境に割り当てられない。
5. `main`へのpushは本番環境へデプロイされる。`main`向けPRの一時プレビューも併用する場合は、PRのChecksに表示されるEnvironment URLで確認し、PRを閉じると一時環境が削除される。安定した`dev`環境はブランチが存在する間利用できる。

`pull_request`イベントのworkflowはPRのベースブランチ側の定義で実行される。PRプレビューも使う場合は、`main`側にも正しいAzure workflowが反映されていることを確認する。ブランチ環境の詳細は[Azure Static Web Appsのブランチプレビュー環境](https://learn.microsoft.com/en-us/azure/static-web-apps/branch-environments)を参照。

## 任意の公開設定

`.env.example`を参照して、必要な値をGitHub ActionsのRepository variablesまたはローカルのビルド環境へ登録する。秘密値は`PUBLIC_`変数に置かない。これらの値は静的ページの生成時にHTMLへ出力される。

- `PUBLIC_GA_MEASUREMENT_ID`: GA4測定ID。フレーズカード保存とアフィリエイトリンククリックを計測する。
- `PUBLIC_GSC_VERIFICATION`: Search Consoleの所有権確認値。
- `PUBLIC_ADSENSE_CLIENT_ID`と3つの`PUBLIC_AD_SLOT_*`: AdSense審査・設定完了後に登録する。未設定時は記事の固定位置にプレースホルダを表示する。
- `PUBLIC_CONTACT_URL`: 選定した外部フォームのURL。

AdSense申請やアフィリエイト各社への申請はこの実装では行わない。`public/ads.txt`の申告行は、AdSense承認後にGoogleが提示する正確な値へ置き換える。

## アフィリエイトリンク

`src/data/affiliate-links.json`にリンクID、表示ラベル、遷移先URLを登録する。記事Front Matterには遷移先URLではなく登録済みIDだけを書く。`npm run build`の前処理が`public/staticwebapp.config.json`のID別302リダイレクトを生成し、記事内の`/go/{id}/`をAzure Static Web Appsで処理する。未登録IDや不正なURLがあればビルドを失敗させる。
