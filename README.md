## たこやきさんのつぶやきコンテンツストレージ

このリポジトリは、たこやきさんが日々の活動で得た知見や技術情報をまとめたものです。ブログ記事、技術メモ、開発したアプリやサービスの情報、そして過去に参加したコンテストやイベントの記録など、多岐にわたる内容を公開しています。

### 目次

- [プロジェクトの概要](#プロジェクトの概要)
- [特徴](#特徴)
- [リポジトリ構成](#リポジトリ構成)
- [使い方](#使い方)
  - [1. 前提条件](#1-前提条件)
  - [2. 環境変数の設定](#2-環境変数の設定)
  - [3. jsonファイルの生成](#3-jsonファイルの生成)
  - [4. 生成されるJSONデータの解説](#4-生成されるjsonデータの解説)
  - [5. ファイルの配布](#5-ファイルの配布)
- [APIエンドポイント](#apiエンドポイント)
- [ライセンス](#ライセンス)

### プロジェクトの概要

このリポジトリは、たこやきさんの技術ブログを支えるためのデータとコードを管理しています。
ブログ記事のメタデータ（タイトル、タグ、更新日時など）をJSON形式で生成し、ブログサイトで利用できるようにします。
また、ブログ記事の本文はMarkdown形式で記述されており、画像やスライドなどのメディアファイルも合わせて管理されています。


### 特徴

- **技術ブログ記事を管理:**  ブログ記事の原稿、コードサンプル、画像などをまとめて管理できます。
- **タグによる分類:** 記事をタグで分類することで、興味のある分野の記事を簡単に探し出すことができます。
- **最新情報提供:**  最新のブログ記事や更新情報を取得できます。
- **オープンソース:**  誰でも自由に利用、改変、再配布できます。

### リポジトリ構成

```
├── dist # 生成されたJSONデータとコンテンツ
│   ├── contents # ブログ記事の本文(Markdown)、画像、スライド
│   │   ├── media
│   │   │   └── 202408
│   │   │       ├── beaker-pudding-0.jpg
│   │   │       ├── beaker-pudding-1.jpg
│   │   │       ├── ...
│   │   ├── Golang-ProtocolBuffer.md
│   │   ├── Golang-ProtocolBuffer.json
│   │   ├── ...
│   ├── recent_updated.json # 最新記事一覧
│   ├── tag_list.json # タグ一覧
│   └── tags # タグ毎の記事一覧
│       ├── API.json
│       ├── IT.json
│       ├── ...
├── index.mjs # jsonファイル生成スクリプト
├── package.json # npm パッケージ管理ファイル
└── src # 記事データ
    ├── Golang-ProtocolBuffer.json
    ├── Golang-ProtocolBuffer.md
    ├── ...
```

- **src ディレクトリ:** ブログ記事データ、画像ファイル、スライドファイルなどを格納しています。
- **src 内の json ファイル:** 各記事のタイトル、タグ、更新日時などのメタデータを格納しています。
- **src 内の md ファイル:** 各記事の本文を Markdown 形式で記述しています。
- **index.mjs:** json ファイルを生成し、ブログサイトで利用するデータを作成するスクリプトです。
- **package.json:** npm パッケージ管理ファイルです。
- **dist ディレクトリ:** `index.mjs` によって生成されたJSONデータとコンテンツが格納されます。
- **dist/contents ディレクトリ:** `src` ディレクトリの内容がコピーされます。
- **dist/recent_updated.json:** 最新記事10件のメタデータが格納されます。
- **dist/tag_list.json:** 使用されているタグと、そのタグが紐付けられている記事IDのリストが格納されます。
- **dist/tags ディレクトリ:** タグごとに、そのタグが紐付けられている記事のメタデータが格納されます。

### 使い方

#### 1. 前提条件

- Node.js がインストールされていること
- npm がインストールされていること

#### 2. 環境変数の設定

環境変数は設定不要です。

#### 3. jsonファイルの生成

```bash
npm install
npm run build
```

上記の commands を実行することで、`dist` ディレクトリに json ファイルが生成されます。

#### 4. 生成されるJSONデータの解説

##### dist/recent_updated.json
```json
[
  {
    "title": "ビーカーで作るプリン🍮",
    "type": "md",
    "id": "beaker-pudding",
    "created": "2024-09-02T23:17:00.000000000+09:00",
    "updated": "2024-09-02T23:17:00.000000000+09:00",
    "tags": [
      "料理",
      "実験道具"
    ],
    "file": ""
  },
  {
    "title": "在来線と船だけで帰るソウルから東京旅",
    "type": "md",
    "id": "soul-to-tokyo-train-ferry",
    "created": "2024-09-01T01:40:00.000000000+09:00",
    "updated": "2024-09-01T01:40:00.000000000+09:00",
    "tags": [
      "旅行記",
      "鉄道",
      "船",
      "18きっぷ",
      "海外旅行"
    ],
    "file": ""
  },
  // ... (最新の10件の記事データ)
]
```

- `title`: 記事のタイトル
- `type`: 記事のタイプ（"md"または"html"）
- `id`: 記事を一意に識別するためのID
- `created`: 記事の作成日時
- `updated`: 記事の更新日時
- `tags`: 記事に紐付けられたタグの配列
- `file`: 記事のファイル名（空欄の場合、`id`と同じファイル名が使われます）


##### dist/tag_list.json
```json
{
  "IT": [
    "Golang-ProtocolBuffer",
    "WorkerStep",
    "cell-sheet",
    // ... (ITタグが紐付けられている記事IDのリスト) 
  ],
  "メモ": [
    "Golang-ProtocolBuffer",
    "dataframe-apply",
    "get-file-list-code",
    // ... (メモタグが紐付けられている記事IDのリスト)
  ],
  // ... (他のタグと記事IDのリスト)
}
```

- 各タグをキーとして、そのタグが紐付けられている記事IDの配列が値として格納されています。

##### dist/tags/{タグ名}.json

```json
// dist/tags/IT.json の例
[
  {
    "title": "Golangでprotocol buffer",
    "type": "md",
    "id": "Golang-ProtocolBuffer",
    "created": "2023-06-19T11:51:08.7951863+09:00",
    "updated": "2024-08-31T00:00:00.000000000+09:00",
    "tags": [
      "IT",
      "メモ",
      "ProtocolBuffer"
    ],
    "file": ""
  },
  {
    "title": "WorkerStep",
    "type": "md",
    "id": "WorkerStep",
    "created": "2023-06-19T12:01:09.646759953+09:00",
    "updated": "2024-08-31T00:00:00.000000000+09:00",
    "tags": [
      "作品一覧",
      "IT",
      "コンテスト受賞",
      "個人開発",
      "アプリ開発"
    ],
    "file": ""
  },
  // ... (ITタグが紐付けられている記事データのリスト)
]
```

- 各タグごとに、そのタグが紐付けられている記事のメタデータが配列として格納されています。


#### 5. ファイルの配布

生成された json ファイルを、ブログサイトのデータとして利用します。
例えば、`dist/recent_updated.json` を利用してブログサイトのトップページに最新記事一覧を表示したり、`dist/tags/{タグ名}.json` を利用してタグページにそのタグの記事一覧を表示したりすることができます。

### APIエンドポイント
このリポジトリで生成されたJSONデータは、下記のURLからアクセスできます。

- 最新記事一覧: `https://takoyaki-3.github.io/takoyaki3-com-data/recent_updated.json`
- タグ一覧: `https://takoyaki-3.github.io/takoyaki3-com-data/tag_list.json`
- タグ毎の記事一覧: `https://takoyaki-3.github.io/takoyaki3-com-data/tags/{タグ名}.json`
- 記事コンテンツ: `https://takoyaki-3.github.io/takoyaki3-com-data/contents/{記事ID}.{拡張子}` (例: `https://takoyaki-3.github.io/takoyaki3-com-data/contents/Golang-ProtocolBuffer.md`)
- メディアファイル: `https://takoyaki-3.github.io/takoyaki3-com-data/contents/media/...` (例: `https://takoyaki-3.github.io/takoyaki3-com-data/contents/media/202408/beaker-pudding-0.jpg`)

### ライセンス

このレポジトリに含まれる記事や写真は、筆者の所有物です。
個人サイトとしてのコードはご利用いただいて構いませんが、記事内容は無断転載を禁止します。