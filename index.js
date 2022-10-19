#!/usr/bin/env node

const { argv } = require("process");
const fs = require("fs");
const { readdirSync, lstatSync } = require('fs');
const parseString = require("./parseString");

/**
 * @param {string} dirName
 * @returns {string}
 */
const getFileList = (dirName) => {
    let files = [];
    const items = readdirSync(dirName, { withFileTypes: true });

    for (const item of items) {
        if (item.isDirectory()) {
            files = [...files, ...getFileList(`${dirName}/${item.name}`)];
        } else {
            files.push(`${dirName}/${item.name}`);
        }
    }

    return files;
};

const main = () => {
  const dir = argv[argv.length - 1];
  const dirStats = lstatSync(dir);
  let paths = [];
  if (dirStats.isDirectory()) {
    paths.push(...getFileList(dir));
  } else if (dirStats.isFile()) {
    paths.push(dir);
  } else {
    throw 'last argument is not a file or a directory path'
  }
  paths = paths.filter(p => /\.md$/.test(p));
  if (!paths.length) {
    console.warn('path did not contain any markdown files');
    return;
  }
  const sections = []; 
  for (let path of paths) {
    const contentStr = fs.readFileSync(path).toString();
    sections.push(...parseString(contentStr, path));
  }
  sections.forEach((s, i) => s.id = i);
  const html_page = fs.readFileSync(__dirname + '/page.html').toString();
  const html_page_with_sections = html_page.replace('{{sections}}', encodeURI(JSON.stringify(sections)));
  fs.writeFileSync(`./hashdown.html`, html_page_with_sections);
  return;
}

main();
