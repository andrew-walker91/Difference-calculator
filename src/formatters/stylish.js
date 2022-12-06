import _ from 'lodash';

const depthIndent = (depth) => '    '.repeat(depth);
const plusGap = '  + ';
const minusGap = '  - ';
const neutralGap = '    ';

// Вспомогательная функция для обработки значений
const valueFormatter = (value, depth) => {
  if (!_.isObject(value)) {
    return value;
  }

  const keys = Object.keys(value);
  const formattedValue = keys.map((key) => `${depthIndent(depth + 2)}${key}: ${valueFormatter(value[key], depth + 1)}`);
  return `{\n${formattedValue.join('\n')}\n${depthIndent(depth + 1)}}`;
};

// Функция формирует stylish-вывод в консоль на основе результата из genDiff
const formatter = (data) => {
  const innerFormatter = (innerData, depth = 0) => {
    const formattedData = innerData.map((node) => {
      if (node.type === 'ADDED') {
        return `${depthIndent(depth)}${plusGap}${node.name}: ${valueFormatter(node.value, depth)}`;
      }
      if (node.type === 'REMOVED') {
        return `${depthIndent(depth)}${minusGap}${node.name}: ${valueFormatter(node.value, depth)}`;
      }
      if (node.type === 'UNCHANGED') {
        return `${depthIndent(depth)}${neutralGap}${node.name}: ${valueFormatter(node.value, depth)}`;
      }
      if (node.type === 'CHANGED') {
        return `${depthIndent(depth)}${minusGap}${node.name}: ${valueFormatter(node.oldValue, depth)}\n${depthIndent(depth)}${plusGap}${node.name}: ${valueFormatter(node.newValue, depth)}`;
      }
      if (node.type === 'PARENT') {
        return `${depthIndent(depth)}${neutralGap}${node.name}: ${innerFormatter(node.children, depth + 1)}`;
      }
      throw new Error(`"${node.type}" type is not supported by the formatter`);
    });

    return `{\n${formattedData.join('\n')}\n${depthIndent(depth)}}`;
  };

  return innerFormatter(data);
};

export default formatter;
