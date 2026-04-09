# GOKKO 広告料金シミュレーター — 進捗まとめ

## 概要

縦型ショートドラマの広告利用料金を、プランと各係数からリアルタイムでシミュレーションできるWebページ。
Google Spreadsheetの料金表データをもとに、インタラクティブなダッシュボードとして構築。

---

## 完成しているもの

### ファイル一覧（選択フォルダ内）

| ファイル名 | 内容 |
|---|---|
| `gokko-ad-pricing.html` | 本番用（Google認証付き） |
| `gokko-ad-pricing-preview.html` | プレビュー用（認証なし・すぐ見れる） |
| `index.html` | Netlifyデプロイ用（gokko-ad-pricing.htmlと同一） |

### 機能

- **4つのプラン選択**: ライト（フック重視）/ ベーシック（実稼働費回収）/ スタンダード（バランス）/ プレミアム（アップセル）
- **6つの係数カード**:
  - 01 使用期間
  - 02 競合排除
  - 03 業界
  - 04 メディア展開（チェックボックス式・加算・Cap上限あり）
  - 05 出演者ランク
  - 06 GOKKOマージン（×1.0 ライト / ×1.2 スタンダード / ×1.5 フル）
- **リアルタイム計算**: 総額 = 基本出演料 × 使用期間 × 競合排除 × 業界 × メディア × 出演者ランク × マージン
- **画面下部に固定表示**: 選択中のプラン・各係数・見積総額
- **出演者ランク別の基本出演料目安テーブル**
- **レスポンシブ対応**（スマホ・タブレット・PC）
- **デザイン**: GOKKOブランドカラー（黒×白）のスタイリッシュなUI
- **Google認証**: @gokkoclub.jp ドメインのみログイン可能（本番用）

### 計算式の詳細

各プランごとに係数値が異なる（メディア展開のCap値もプラン別）。出演者ランクとGOKKOマージンは全プラン共通。

---

## Google Cloud Console 設定（完了済み）

- プロジェクト名: `Gokko-Cast-Fee`
- OAuth同意画面: 設定済み
- OAuthクライアントID: `777058430626-nla9pd956ss4t7jrchf58ebc0u614rcq.apps.googleusercontent.com`
- 対象ドメイン: `@gokkoclub.jp` のみ

---

## 残りの作業

### 1. Netlifyにデプロイ

1. https://app.netlify.com/drop を開く
2. `index.html` をドラッグ＆ドロップ
3. 発行されたURL（例: `https://xxx-yyy-zzz.netlify.app`）をコピー

### 2. Google Cloud ConsoleにデプロイURLを登録

1. https://console.cloud.google.com → プロジェクト「Gokko-Cast-Fee」を選択
2. 左メニュー「APIとサービス」→「認証情報」
3. OAuth 2.0 クライアントIDをクリック
4. 「承認済みの JavaScript オリジン」に Netlify の URL を追加（末尾の `/` は付けない）
5. 保存

### 3. 動作確認

- NetlifyのURLにアクセス
- Googleログインが表示される → @gokkoclub.jp でログイン
- 4プラン切替・6係数カード（GOKKOマージン含む）・リアルタイム計算が動作することを確認

---

## 注意事項

- `file://` プロトコル（ローカルファイル直接開き）ではGoogle認証が動作しない。必ず `https://` でアクセスすること
- プレビュー版（`gokko-ad-pricing-preview.html`）は認証なしで全機能を確認可能
- Netlifyは無料プランで利用可能。カスタムドメインの設定も後から可能
