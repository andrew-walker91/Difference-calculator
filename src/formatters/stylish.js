import _ from 'lodash';

const indent = (depth) => '    '.repeat(depth);
const plus = '  + ';
const minus = '  - ';
const neutral = '    ';

// Вспомогательная функция для обработки значений
const valueFormatter = (value, depth) => {
  if (!_.isObject(value)) {
    return value;
  }

  const keys = Object.keys(value);
  const formattedValue = keys.map((key) => `${indent(depth + 2)}${key}: ${valueFormatter(value[key], depth + 1)}`);
  return `{\n${formattedValue.join('\n')}\n${indent(depth + 1)}}`;
};

// Функция формирует stylish-вывод в консоль на основе результата из genDiff
const formatter = (data) => {
  const innerFormatter = (innerData, depth = 0) => {
    const formattedData = innerData.flatMap((node) => {
      if (node.type === 'ADDED') {
        return `${indent(depth)}${plus}${node.name}: ${valueFormatter(node.value, depth)}`;
      }
      if (node.type === 'REMOVED') {
        return `${indent(depth)}${minus}${node.name}: ${valueFormatter(node.value, depth)}`;
      }
      if (node.type === 'UNCHANGED') {
        return `${indent(depth)}${neutral}${node.name}: ${valueFormatter(node.value, depth)}`;
      }
      if (node.type === 'CHANGED') {
        return [
          `${indent(depth)}${minus}${node.name}: ${valueFormatter(node.oldValue, depth)}`,
          `${indent(depth)}${plus}${node.name}: ${valueFormatter(node.newValue, depth)}`,
        ];
      }
      if (node.type === 'PARENT') {
        return `${indent(depth)}${neutral}${node.name}: ${innerFormatter(node.children, depth + 1)}`;
      }
      throw new Error(`"${node.type}" type is not supported by the formatter`);
    });

    return `{\n${formattedData.join('\n')}\n${indent(depth)}}`;
  };

  return innerFormatter(data);
};

export default formatter;
