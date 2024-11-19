const fs = require('fs');
const path = require('path');

const read = fileName => {
  const dataFilePath = path.join(__dirname, `../model/${fileName}.json`);
  if (fs.existsSync(dataFilePath)) {
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(data);
  }
  return [];
};

// 封装保存data.json数据函数
const save = (data, fileName) => {
  const dataFilePath = path.join(__dirname, `../model/${fileName}.json`);
  if (fs.existsSync(dataFilePath)) {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(dataFilePath, jsonData, 'utf-8');
  } else {
    console.log('file not found');
    throw new Error('file not found');
  }
};
exports.read = read;
exports.save = save;
