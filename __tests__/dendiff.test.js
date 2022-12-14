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

test.each([
  // JSON
  ['__fixtures__/file1.json', '__fixtures__/file2.json', 'stylish', 'expected-stylish.txt'],
  ['__fixtures__/file1.json', '__fixtures__/file2.json', 'plain', 'expected-plain.txt'],
  ['__fixtures__/file1.json', '__fixtures__/file2.json', 'json', 'expected-json.txt'],

  // YAML and YML
  ['__fixtures__/file1.yaml', '__fixtures__/file2.yaml', 'stylish', 'expected-stylish.txt'],
  ['__fixtures__/file1.yaml', '__fixtures__/file2.yaml', 'plain', 'expected-plain.txt'],
  ['__fixtures__/file1.yaml', '__fixtures__/file2.yaml', 'json', 'expected-json.txt'],

  // CROSSED
  ['__fixtures__/file1.json', '__fixtures__/file2.yaml', 'stylish', 'expected-stylish.txt'],
  ['__fixtures__/file1.yaml', '__fixtures__/file2.json', 'plain', 'expected-plain.txt'],
  ['__fixtures__/file1.json', '__fixtures__/file2.yaml', 'json', 'expected-json.txt'],

])('Diff test (%#)', (filepath1, filepath2, formatName, expectedFile) => {
  const recieved = genDiff(filepath1, filepath2, formatName);
  const expected = readFile(expectedFile);

  expect(recieved).toEqual(expected);
});
