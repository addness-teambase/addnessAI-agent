# 🚀 Vercelデプロイチェックリスト

## ⚠️ 重要：必ず全て確認してください

このドキュメントは、今回の変更をVercelにデプロイする際に **絶対に** 確認すべき項目をまとめたものです。

---

## 📋 今回追加された機能・変更点

### 1. **契約書レビューモードのDify統合**
- **場所**: `app/page.tsx`, `app/api/dify-chat/route.ts`
- **内容**:
  - 契約書レビューモードがGeminiからDifyに変更
  - Difyのファイルアップロード機能を使用
  - ファイルをDifyにアップロード → file_id取得 → Difyに送信
- **影響**:
  - `DIFY_CONTRACT_REVIEW_API_KEY`が **必須** になりました
  - ファイルアップロードフローが変更されました

### 2. **Dify APIのファイル対応強化**
- **場所**: `app/api/dify-chat/route.ts`
- **内容**:
  - `inputs.docs`にファイルIDを設定（Difyワークフロー要件）
  - バリデーション追加（メッセージまたはファイル必須）
  - エラーハンドリングの大幅強化
- **影響**:
  - "docs is required"エラーが完全に解消
  - 詳細なエラーログが出力されるようになりました

### 3. **pdf-parseのビルドエラー修正**
- **場所**: `app/api/analyze-file/route.ts`
- **内容**:
  - pdf-parseを動的インポートに変更（ESMビルド問題を解決）
  - `const pdfParse: any = await import('pdf-parse');`
- **影響**:
  - Vercelビルドが成功するようになりました
  - PDF分析機能が正常に動作します

### 4. **詳細なエラーログとハンドリング**
- **場所**: `app/page.tsx`, `app/api/dify-chat/route.ts`
- **内容**:
  - 全てのAPIリクエスト/レスポンスをログ出力
  - エラーメッセージの詳細なパース
  - ユーザーフレンドリーなエラー表示
- **影響**:
  - デバッグが格段に簡単になりました
  - エラーの原因を即座に特定できます

---

## 🔑 必須環境変数（Vercelに設定必須）

### 1. **GEMINI_API_KEY** ✅ 必須
```
値: AIzaSyC9cFWJrcrT-oiTxxr0ln1CtaxjNYhAF1s
説明: Gemini APIキー（PDF/Excel分析で使用）
取得: https://aistudio.google.com/app/apikey
```

### 2. **GOOGLE_GENERATIVE_AI_API_KEY** ✅ 必須
```
値: AIzaSyC9cFWJrcrT-oiTxxr0ln1CtaxjNYhAF1s
説明: Gemini APIキー（GEMINIと同じ値でOK）
```

### 3. **DIFY_API_BASE_URL** ✅ 必須
```
値: https://api.dify.ai/v1
説明: Dify APIのベースURL
```

### 4. **DIFY_FAQ_API_KEY** ⚠️ FAQ機能を使う場合は必須
```
値: app-uyTWjRVJlh6NhZp1WYbJproQ
説明: FAQ自動応答用のDify APIキー
```

### 5. **DIFY_CONTRACT_REVIEW_API_KEY** 🆕 ✅ **今回追加・必須**
```
値: app-R22yMIFVhvcR3owjf2UvIVaq
説明: 契約書レビュー用のDify APIキー
重要: 設定しないと契約書レビューモードが動作しません！
```

---

## 🚨 Vercelデプロイ時の注意点（必読）

### 1. **環境変数の設定**
- Vercel Dashboard → Settings → Environment Variables に移動
- 上記の **全ての必須環境変数** を設定
- **特に `DIFY_CONTRACT_REVIEW_API_KEY` を忘れないこと！**
- 環境変数の値を **コピペミス** しないように注意

### 2. **ビルド設定の確認**
- Build Command: `npm run build` (デフォルト)
- Output Directory: `.next` (デフォルト)
- Install Command: `npm install` (デフォルト)
- Node.js Version: **18.x 以上** を推奨

### 3. **Runtime設定の確認**
以下のAPIは **Node.js runtime** を使用しています：
- `/api/analyze-file` - PDF/Excel解析のため Node.js が必須

以下のAPIは **Edge runtime** を使用しています：
- `/api/dify-chat` - ストリーミングレスポンス
- `/api/dify-upload` - ファイルアップロード

⚠️ **重要**: これらのRuntime設定は自動的に適用されます。変更しないでください。

### 4. **依存関係の確認**
以下のパッケージが必須です（package.jsonに既に含まれています）：
```json
{
  "pdf-parse": "^2.4.5",
  "xlsx": "^0.18.5",
  "@ai-sdk/google": "^1.2.19",
  "ai": "^4.1.19"
}
```

### 5. **ファイルサイズ制限**
- Vercel Hobby Plan: **4.5MB** per serverless function
- Vercel Pro Plan: **50MB** per serverless function
- PDFパース用の `pdf-parse` が大きいので、Pro Planを推奨

---

## 🔍 デプロイ前の最終チェック

### ✅ チェックリスト

- [ ] 1. **ローカルでビルドが成功するか確認**
  ```bash
  npm run build
  ```
  → エラーなくビルドが完了すること

- [ ] 2. **環境変数を全て確認**
  - `GEMINI_API_KEY`
  - `GOOGLE_GENERATIVE_AI_API_KEY`
  - `DIFY_API_BASE_URL`
  - `DIFY_FAQ_API_KEY`（FAQを使う場合）
  - `DIFY_CONTRACT_REVIEW_API_KEY` ← **新規追加、必須！**

- [ ] 3. **変更したファイルをコミット**
  ```bash
  git add app/api/dify-chat/route.ts app/page.tsx
  git commit -m "feat: Integrate Dify file upload for contract review mode"
  git push origin main
  ```

- [ ] 4. **Vercelに環境変数を設定**
  - Vercel Dashboard → Settings → Environment Variables
  - 全ての環境変数を追加
  - **Production**, **Preview**, **Development** の全てにチェック

- [ ] 5. **Vercelでデプロイ**
  - Vercel Dashboard → Deployments → Redeploy
  - または自動デプロイを待つ

- [ ] 6. **デプロイ後の動作確認**
  - ✅ 契約書レビューモードが表示されるか
  - ✅ ファイルアップロードができるか
  - ✅ Difyにファイルがアップロードされるか
  - ✅ AIからレスポンスが返ってくるか
  - ✅ コンソールにエラーが出ていないか

---

## 🐛 デプロイ後にエラーが出た場合

### 1. **ビルドエラーが出た場合**

**エラー例**: `Module not found: Can't resolve 'pdf-parse'`

**解決策**:
```bash
# package.jsonを確認
cat package.json | grep pdf-parse

# なければインストール
npm install pdf-parse xlsx

# 再度ビルド
npm run build

# コミット&プッシュ
git add package.json package-lock.json
git commit -m "fix: Add missing dependencies"
git push
```

### 2. **"docs is required" エラーが出た場合**

**原因**:
- Difyワークフローの設定が間違っている
- または `inputs.docs` が正しく送信されていない

**解決策**:
1. Vercel のログを確認（Function Logs）
2. `[Dify Chat] Request body:` のログを探す
3. `inputs.docs` が含まれているか確認
4. 含まれていない場合は、`app/api/dify-chat/route.ts` を確認

### 3. **"API key is not configured" エラーが出た場合**

**原因**: 環境変数が設定されていない

**解決策**:
1. Vercel Dashboard → Settings → Environment Variables
2. `DIFY_CONTRACT_REVIEW_API_KEY` が設定されているか確認
3. 値が正しいか確認（コピペミスがないか）
4. 設定後、Redeploy が必要

### 4. **ファイルアップロードエラーが出た場合**

**原因**:
- ファイルサイズが大きすぎる
- ファイル形式が対応していない
- Dify APIのクォータ超過

**解決策**:
1. ファイルサイズを確認（15MB以下推奨）
2. ファイル形式を確認（PDF, Word, Excel推奨）
3. Dify APIのクォータを確認
4. Vercel Logsでエラーの詳細を確認

---

## 📊 デプロイ後の監視

### Vercel Function Logs の確認方法
1. Vercel Dashboard → Deployments → Latest Deployment
2. "Functions" タブをクリック
3. 各API（`/api/dify-chat`, `/api/dify-upload`, `/api/analyze-file`）のログを確認

### 重要なログ
- `[Dify] Uploading file to Dify:` - ファイルアップロード開始
- `[Dify] File uploaded successfully:` - アップロード成功
- `[Dify Chat] Request body:` - Difyへのリクエスト内容
- `[Dify Chat] API Error:` - Difyからのエラー

---

## 🎉 デプロイ成功の確認方法

以下の全てが確認できればデプロイ成功です：

1. ✅ Vercel Dashboardでビルドが成功（緑色のチェックマーク）
2. ✅ デプロイされたURLにアクセスできる
3. ✅ 「契約書レビュー」モードが表示される
4. ✅ PDFファイルをアップロードできる
5. ✅ AIからレスポンスが返ってくる
6. ✅ ブラウザコンソールにエラーが出ていない
7. ✅ Vercel Function Logsにエラーが出ていない

---

## 💡 追加情報

### 今回の変更で追加されたAPIエンドポイント
- なし（既存のエンドポイントの機能拡張のみ）

### 今回の変更で修正されたバグ
1. ✅ pdf-parseのビルドエラー → 動的インポートで解決
2. ✅ "docs is required"エラー → inputs.docsで解決
3. ✅ エラーメッセージが不明瞭 → 詳細なエラーログで解決

### 今回の変更で改善された点
1. ✅ 契約書レビューがDifyベースになり、より高度な分析が可能に
2. ✅ ファイルアップロードフローが明確になった
3. ✅ エラーハンドリングが大幅に強化された
4. ✅ デバッグが容易になった

---

## 📞 問題が解決しない場合

1. **Vercel Function Logs を確認**
   - 詳細なエラーメッセージが記録されています

2. **ブラウザのコンソールを確認**
   - ネットワークタブでAPIリクエストを確認

3. **環境変数を再確認**
   - 値のコピペミスがないか
   - 全ての環境に設定されているか

4. **Redeployを試す**
   - Vercel Dashboard → Redeploy

5. **それでも解決しない場合**
   - Vercel Logsのスクリーンショットを共有してください
   - ブラウザコンソールのエラーを共有してください

---

## ✅ 最終確認

デプロイ前に、もう一度確認してください：

- [ ] 環境変数は全て設定しましたか？
- [ ] `DIFY_CONTRACT_REVIEW_API_KEY` を設定しましたか？
- [ ] ローカルでビルドが成功しましたか？
- [ ] 変更をコミット＆プッシュしましたか？
- [ ] Vercelでデプロイを実行しましたか？
- [ ] デプロイ後の動作確認をしましたか？

**全てにチェックが入ったら、デプロイ成功です！🎉**
