import { writeFile } from 'fs/promises';
import { join } from 'path';

// コマンドライン引数からpage_idを取得
const pageId = process.argv[2];

if (!pageId) {
  console.error('Error: page_id is required.');
  process.exit(1);
}

// ファイルパスを設定
const jsonFilePath = join('src', `${pageId}.json`);
const mdFilePath = join('src', `${pageId}.md`);

// JSONファイルの内容を作成
const jsonContent = {
  title: '新しい記事のタイトル',
  type: 'md',
  id: pageId,
  created: new Date().toISOString(),
  updated: new Date().toISOString(),
  tags: ['標準タグ1', '標準タグ2'],
  file: ''
};

// ファイルを保存する非同期関数
async function createFiles() {
  try {
    // JSONファイルを保存
    await writeFile(jsonFilePath, JSON.stringify(jsonContent, null, 2));
    console.log(`JSON file created at: ${jsonFilePath}`);

    // Markdownファイルの内容を作成
    const mdContent = `# ${pageId}\n`;

    // Markdownファイルを保存
    await writeFile(mdFilePath, mdContent);
    console.log(`Markdown file created at: ${mdFilePath}`);
  } catch (err) {
    console.error(`Error creating files: ${err.message}`);
    process.exit(1);
  }
}

// ファイル作成を実行
createFiles();
