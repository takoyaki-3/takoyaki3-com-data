// src/index.js
import fs from 'fs';
import path from 'path';
import axios from 'axios'; // axiosを使用してAPIからデータを取得

const qiitaUrl = 'https://qiita.com/api/v2/users/takoyaki3/items';
const zennUrl = 'https://zenn.dev/takoyaki3/feed';

// QiitaのJSONデータを取得して保存
const fetchAndSaveQiitaData = async () => {
  try {
    const response = await axios.get(qiitaUrl);
    const qiitaData = response.data;

    const qiitaDir = './dist/qiita';
    if (!fs.existsSync(qiitaDir)) {
      fs.mkdirSync(qiitaDir);
    }

    fs.writeFileSync(`${qiitaDir}/qiita_data.json`, JSON.stringify(qiitaData, null, 2));
    console.log('Qiita data saved successfully');
  } catch (error) {
    console.error('Error fetching Qiita data:', error);
  }
};

// ZennのXMLフィードを取得して保存
const fetchAndSaveZennData = async () => {
  try {
    const response = await axios.get(zennUrl, { responseType: 'text' });
    const zennData = response.data;

    const zennDir = './dist/zenn';
    if (!fs.existsSync(zennDir)) {
      fs.mkdirSync(zennDir);
    }

    fs.writeFileSync(`${zennDir}/zenn_feed.xml`, zennData);
    console.log('Zenn feed saved successfully');
  } catch (error) {
    console.error('Error fetching Zenn feed:', error);
  }
};

const getFiles = (dir) => {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  const fileList = [];
  for (const file of files) {
    if (file.isDirectory()) {
      fileList.push(...getFiles(path.join(dir, file.name)));
    } else {
      fileList.push(path.join(dir, file.name));
    }
  }
  return fileList;
};

const getJson = (file) => {
  const data = fs.readFileSync(file, 'utf8');
  return JSON.parse(data);
};

const createTagListJson = (files) => {
  const tagList = {};
  for (const file of files) {
    if (path.extname(file) === '.json') {
      const data = getJson(file);
      for (const tag of data.tags) {
        if (!tagList[tag]) {
          tagList[tag] = [];
        }
        tagList[tag].push(data.id);
      }
    }
  }
  return tagList;
};

const createRecentUpdatedJson = (files) => {
  const recentUpdated = [];
  for (const file of files) {
    if (path.extname(file) === '.json') {
      const data = getJson(file);
      recentUpdated.push(data);
    }
  }
  recentUpdated.sort((a, b) => new Date(b.updated) - new Date(a.updated));
  return recentUpdated.slice(0, 10);
};

const createTagArticlesJson = (files) => {
  const tagArticles = {};
  for (const file of files) {
    if (path.extname(file) === '.json') {
      const data = getJson(file);
      for (const tag of data.tags) {
        if (!tagArticles[tag]) {
          tagArticles[tag] = [];
        }
        tagArticles[tag].push(data);
      }
    }
  }
  return tagArticles;
};

const createTagJsonFiles = (tagArticles) => {
  for (const tag in tagArticles) {
    const filePath = `./dist/tags/${tag}.json`;
    fs.writeFileSync(filePath, JSON.stringify(tagArticles[tag], null, 2));
  }
};

const main = async () => {

  const files = getFiles('./src');
  const tagListJson = createTagListJson(files);
  const recentUpdatedJson = createRecentUpdatedJson(files);
  const tagArticlesJson = createTagArticlesJson(files);

  if (!fs.existsSync('./dist')) {
    fs.mkdirSync('./dist');
  }
  if (!fs.existsSync('./dist/tags')) {
    fs.mkdirSync('./dist/tags');
  }
  fs.writeFileSync('./dist/tag_list.json', JSON.stringify(tagListJson, null, 2));
  fs.writeFileSync('./dist/recent_updated.json', JSON.stringify(recentUpdatedJson, null, 2));
  createTagJsonFiles(tagArticlesJson);

  // ./src を ./dist/contents にすべてのファイルを再帰的にコピー。フォルダがない場合は作成。
  if (!fs.existsSync('./dist/contents')) {
    fs.mkdirSync('./dist/contents');
  }
  for (let file of files) {
    file = file.replace(/\\/g, '/'); // Windows でのパス対応
    const dest = file.replace('src', 'dist/contents');
    if (!fs.existsSync(path.dirname(dest))) {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
    }
    console.log(`copy: ${file} -> ${dest}`);
    fs.copyFileSync(file, dest);
  }

  // QiitaデータとZennデータを取得して保存
  await fetchAndSaveQiitaData(); // Qiitaデータを取得して保存
  await fetchAndSaveZennData();  // Zennデータを取得して保存
};

main();
