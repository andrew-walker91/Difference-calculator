import { test, expect } from '@jest/globals';
import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import genDiff from '../src/index.js';

// Получаем URL этого модуля и преобразуем его в путь
const modulePath = fileURLToPath(import.meta.url);

// Получаем путь до директории в которой лежит этот модуль
const dirPath = dirname(modulePath);

// Получаем путь до фикстуры
const getFixturePath = (filename) => join(dirPath, '..', '__fixtures__', filename);

// Читаем фикстуры
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');
const expectedStylish = readFile('expected-stylish.txt');
const expectedPlain = readFile('expected-plain.txt');
const expectedJson = readFile('expected-json.txt');

test.each([
  // JSON
  ['__fixtures__/file1.json', '__fixtures__/file2.json', 'stylish', expectedStylish],
  ['__fixtures__/file1.json', '__fixtures__/file2.json', 'plain', expectedPlain],
  ['__fixtures__/file1.json', '__fixtures__/file2.json', 'json', expectedJson],

  // YAML and YML
  ['__fixtures__/file1.yaml', '__fixtures__/file2.yaml', 'stylish', expectedStylish],
  ['__fixtures__/file1.yaml', '__fixtures__/file2.yaml', 'plain', expectedPlain],
  ['__fixtures__/file1.yaml', '__fixtures__/file2.yaml', 'json', expectedJson],

  // CROSSED
  ['__fixtures__/file1.json', '__fixtures__/file2.yaml', 'stylish', expectedStylish],
  ['__fixtures__/file1.yaml', '__fixtures__/file2.json', 'plain', expectedPlain],
  ['__fixtures__/file1.json', '__fixtures__/file2.yaml', 'json', expectedJson],

])('Diff test (%#)', (filepath1, filepath2, formatName, expectedFile) => {
  const recieved = genDiff(filepath1, filepath2, formatName);
  const expected = expectedFile;

  expect(recieved).toEqual(expected);
});
