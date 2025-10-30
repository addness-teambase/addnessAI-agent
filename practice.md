# Markdown練習ファイル

これは練習用のMarkdownファイルです。様々なMarkdown記法を試すことができます。

## 目次
- [見出し](#見出し)
- [テキスト装飾](#テキスト装飾)
- [リスト](#リスト)
- [コードブロック](#コードブロック)
- [テーブル](#テーブル)
- [リンクと画像](#リンクと画像)

---

## 見出し

# 見出し1（H1）
## 見出し2（H2）
### 見出し3（H3）
#### 見出し4（H4）
##### 見出し5（H5）
###### 見出し6（H6）

---

## テキスト装飾

**太字のテキスト**または__太字のテキスト__

*斜体のテキスト*または_斜体のテキスト_

***太字かつ斜体***

~~取り消し線~~

> これは引用ブロックです。
> 複数行にわたって引用することができます。
>
> 段落も分けられます。

---

## リスト

### 順序なしリスト
- アイテム1
- アイテム2
  - ネストされたアイテム2-1
  - ネストされたアイテム2-2
    - さらにネスト2-2-1
- アイテム3

### 順序付きリスト
1. 最初の項目
2. 2番目の項目
3. 3番目の項目
   1. サブ項目3-1
   2. サブ項目3-2
4. 4番目の項目

### チェックリスト
- [x] 完了したタスク
- [x] これも完了
- [ ] 未完了のタスク
- [ ] まだやっていないタスク

---

## コードブロック

### インラインコード
`console.log('Hello, World!')`というコードをインラインで書けます。

### JavaScript
```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
  return `Welcome, ${name}`;
}

greet('World');
```

### Python
```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))
```

### TypeScript
```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = {
  id: 1,
  name: 'Taro Yamada',
  email: 'taro@example.com'
};
```

### Bash
```bash
#!/bin/bash
echo "Hello, Shell Script!"
npm install
npm run dev
```

---

## テーブル

| 名前 | 年齢 | 職業 |
|------|------|------|
| 山田太郎 | 25 | エンジニア |
| 佐藤花子 | 30 | デザイナー |
| 鈴木一郎 | 28 | プロダクトマネージャー |

### 中央揃え・右揃え
| 左揃え | 中央揃え | 右揃え |
|:-------|:--------:|-------:|
| 左 | 中央 | 右 |
| テキスト | センター | 右側 |

---

## リンクと画像

### リンク
[Google](https://www.google.com)

[相対パスでのリンク](./README.md)

### 画像
![代替テキスト](https://via.placeholder.com/150)

### 画像にリンクを付ける
[![画像リンク](https://via.placeholder.com/100)](https://www.google.com)

---

## その他の記法

### 水平線
上記のセクション間で使用している `---` が水平線です。

### 脚注
これは脚注の例です[^1]。

[^1]: これが脚注の内容です。

### 絵文字
:smile: :heart: :rocket: :star: :fire:

### ハイライト
==ハイライトされたテキスト==（一部のMarkdownエディタでサポート）

### 数式（LaTeX）
インライン数式: $E = mc^2$

ブロック数式:
$$
\int_{a}^{b} x^2 dx = \frac{b^3 - a^3}{3}
$$

---

## まとめ

このファイルには、Markdownの基本的な記法が含まれています。
自由に編集して練習してください！

- **作成日**: 2025年10月30日
- **目的**: Markdown記法の練習
- **使い方**: このファイルを編集して、様々な記法を試してみましょう

Happy Markdown Writing! ✨

