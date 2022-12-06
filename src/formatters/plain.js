import _ from 'lodash';

// Вспомогательная функция для обработки значений
const valueFormatter = (value) => {
  if (!_.isObject(value)) {
    const formattedValue = _.isString(value) ? `'${value}'` : `${value}`;
    return formattedValue;
  }

  return '[complex value]';
};

// Функция формирует plain-вывод в консоль на основе результата из genDiff
const formatter = (data) => {
  const innerFormatter = (innerData, path = []) => {
    const formattedData = innerData.map((node) => {
      const pathElements = [...path, node.name];
      const actualPath = pathElements.join('.');
      if (node.type === 'ADDED') {
        return `Property '${actualPath}' was added with value: ${valueFormatter(node.value)}`;
      }
      if (node.type === 'REMOVED') {
        return `Property '${actualPath}' was removed`;
      }
      if (node.type === 'CHANGED') {
        return `Property '${actualPath}' was updated. From ${valueFormatter(node.oldValue)} to ${valueFormatter(node.newValue)}`;
      }
      if (node.type === 'PARENT') {
        return `${innerFormatter(node.children, pathElements)}`;
      }
      if (node.type === 'UNCHANGED') {
        return null;
      }
      throw new Error(`"${node.type}" type is not supported by the formatter`);
    })
      .filter((elem) => elem !== null);

    return `${formattedData.join('\n')}`;
  };

  return innerFormatter(data);
};

export default formatter;
