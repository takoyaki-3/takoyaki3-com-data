// src/index.js
import fs from 'fs';
import path from 'path';

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

const main = () => {
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
};

main();