# タイピングれんしゅう

こどもむけのタイピングれんしゅうゲームです。

## きのう

- **キーをタイプ** - ひらがなやえいじをみて、ただしいキーをおす
  - ひらがなから: ひらがなをみて、ローマじのさいしょのキーをおす
  - えいじから: えいじをみて、おなじキーをおす
- **たんごをタイプ** - たんごをみて、ローマじでタイプする
  - にほんごから: にほんごのたんごをローマじでタイプ
  - えいごから: えいごのたんごをタイプ
- BGM・こうかおんつき
- せいかいするとエフェクトがでる

## かいはつ

### ひつようなもの

- Node.js 18 いじょう
- npm

### セットアップ

```bash
npm install
```

### かいはつサーバー

```bash
npm run dev
```

ブラウザで `http://localhost:5173` をひらいてください。

### ビルド

```bash
npm run build
```

`dist/` フォルダにビルドされたファイルがしゅつりょくされます。

### プレビュー（ビルドけっかのかくにん）

```bash
npm run preview
```

## Google Cloud Storage へのデプロイ

### 1. じゅんび

Google Cloud SDK（`gcloud`）をインストールしてください。

```bash
# gcloud CLI のインストール（まだのばあい）
# https://cloud.google.com/sdk/docs/install

# ログイン
gcloud auth login

# プロジェクトのせってい
gcloud config set project YOUR_PROJECT_ID
```

### 2. Cloud Storage バケットのさくせい

```bash
# バケットをさくせい
gcloud storage buckets create gs://YOUR_BUCKET_NAME --location=asia-northeast1

# ウェブサイトとしてこうかいするせってい
gcloud storage buckets update gs://YOUR_BUCKET_NAME --web-main-page-suffix=index.html --web-not-found-page=index.html
```

### 3. こうかいアクセスのきょか

```bash
gcloud storage buckets add-iam-policy-binding gs://YOUR_BUCKET_NAME \
  --member=allUsers \
  --role=roles/storage.objectViewer
```

### 4. ビルドとデプロイ

```bash
# ビルド
npm run build

# dist フォルダのなかみをアップロード
gcloud storage cp -r dist/* gs://YOUR_BUCKET_NAME/
```

### 5. アクセス

ブラウザで以下のURLをひらいてください:

```
https://storage.googleapis.com/YOUR_BUCKET_NAME/index.html
```

### こうしんするとき

```bash
npm run build
gcloud storage cp -r dist/* gs://YOUR_BUCKET_NAME/
```

## ぎじゅつスタック

- Vite（ビルドツール）
- Vanilla JavaScript（フレームワークなし）
- Web Audio API（BGM・こうかおん）
