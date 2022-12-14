import { readFileSync } from 'node:fs';
import path from 'path';
import genDiff from './gendiff.js';
import parser from './parser.js';
import format from './formatters/index.js';

export default (filepath1, filepath2, formatName = 'stylish') => {
  const getData = (filepath) => readFileSync(path.resolve(process.cwd(), filepath));
  const getExtension = (filepath) => path.extname(filepath).slice(1);

  // Парсим файлы в JS-объекты
  const obj1 = parser(getData(filepath1), getExtension(filepath1));
  const obj2 = parser(getData(filepath2), getExtension(filepath2));

  // Формируем diff-файл
  const diff = genDiff(obj1, obj2);

  // Выбираем и запускаем форматер
  return format(diff, formatName);
};
