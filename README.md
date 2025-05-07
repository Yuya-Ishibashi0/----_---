# 調整さんクローン

静的ホスティング + React (Vite) で動く、シンプルな日程調整アプリ「調整さん」のクローン版です。  
イベント作成から参加者の調整回答まで、クライアントサイドルーティングで完結します。

---

## デモ

ライブデモ: https://your-vercel-deployment-url.vercel.app  
※ 実際のデプロイ URL に置き換えてください

---

## 特徴

- イベントの新規作成
- 作成したイベントごとに日程ページを生成
- 参加者が「参加可否」を選択して回答
- SPA (Single‑Page Application) として動作
- Vercel や Netlify などの静的ホスティングに対応

---

## 技術スタック

| 分野         | 採用技術                                                          |
| ------------ | ------------------------------------------------------------------ |
| フレームワーク | React 18                                                           |
| ビルドツール   | Vite                                                               |
| ルーティング   | React Router v6                                                    |
| スタイリング   | プレーン CSS (`App.css`, `index.css`)                              |
| コード品質    | ESLint + `@eslint/js`、`eslint-plugin-react-hooks`、`eslint-plugin-react-refresh` |
| ユーティリティ  | `uuid`                                                             |

---

## クイックスタート

1. リポジトリをクローン  
   ```bash
   git clone https://github.com/USERNAME/REPO_NAME.git
   cd REPO_NAME
   ```

2. 依存パッケージをインストール  
   ```bash
   npm install
   # または
   # yarn install
   # pnpm install
   ```

3. 開発サーバー起動  
   ```bash
   npm run dev
   ```
ブラウザで `http://localhost:5173`（デフォルト）にアクセスして、リアルタイムリロード付きでアプリを確認できます。

---

## npm スクリプト

```bash
npm run dev     # 開発モードでサーバーを起動
npm run build   # 本番用にビルド (dist/ 配下に成果物を出力)
npm run preview # build した成果物をローカルでプレビュー
npm run lint    # ESLint によるコード品質チェック
```

---

## ディレクトリ構成

```
/
├ package.json
├ vite.config.js
├ index.html
├ vercel.json         # Vercel 用リライト設定
├ public/             # 静的ファイル置き場
└ src/
   ├ main.jsx         # エントリポイント (BrowserRouter で App をラップ)
   ├ App.jsx          # ルーティング定義とレイアウト
   ├ index.css        # グローバルスタイル (body, #root)
   ├ App.css          # コンポーネント用スタイル
   └ components/
      ├ Home.jsx            # ホームページ
      ├ CreateEvent.jsx     # イベント作成フォーム
      ├ EventPage.jsx       # イベント詳細・回答状況ページ
      └ ParticipantForm.jsx  # 参加者回答フォーム
```

---

## ルーティング

| パス                          | コンポーネント              |
| ----------------------------- | -------------------------- |
| `/`                            | `Home`                     |
| `/create`                      | `CreateEvent`              |
| `/event/:eventId`              | `EventPage`                |
| `/event/:eventId/participate`  | `ParticipantForm`          |
| `*`（上記以外）                | `<Navigate to="/" replace/>` |

> **補足**  
> 不明なパスはルートにリダイレクト／NotFound ページ表示の設定にできます。

---

## デプロイ

Vercel へのデプロイはダッシュボード設定不要です。  
プロジェクトルートに `vercel.json` を配置するだけで、すべてのリクエストを `index.html` にリライトします。

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

1. GitHub にプッシュ  
2. Vercel で新規プロジェクトを作成 → リポジトリを連携  
3. 自動的にビルド & デプロイ  

---

## 貢献

1. Fork する  
2. ブランチを作成 (`git checkout -b feature/xxx`)  
3. 変更をコミット (`git commit -am 'Add xxx'`)  
4. プッシュ (`git push origin feature/xxx`)  
5. Pull Request を送信  

---

## ライセンス

MIT License
