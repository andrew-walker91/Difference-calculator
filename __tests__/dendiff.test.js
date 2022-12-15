import { test, expect } from '@jest/globals';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

test.each([
  ['file1.json', 'file2.json', 'stylish', 'expected-stylish.txt'],
  ['file1.json', 'file2.json', 'plain', 'expected-plain.txt'],
  ['file1.json', 'file2.json', 'json', 'expected-json.txt'],
  ['file1.yaml', 'file2.yaml', 'stylish', 'expected-stylish.txt'],
  ['file1.yaml', 'file2.yaml', 'plain', 'expected-plain.txt'],
  ['file1.yaml', 'file2.yaml', 'json', 'expected-json.txt'],
  ['file1.json', 'file2.yaml', 'stylish', 'expected-stylish.txt'],
  ['file1.yaml', 'file2.json', 'plain', 'expected-plain.txt'],
  ['file1.json', 'file2.yaml', 'json', 'expected-json.txt'],

])('Diff test (%#)', (file1, file2, outputFormat, expectedFile) => {
  const recieved = genDiff(getFixturePath(file1), getFixturePath(file2), outputFormat);
  const expected = readFile(expectedFile);

  expect(recieved).toEqual(expected);
});
