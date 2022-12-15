import _ from 'lodash';

const getFormattedValue = (value) => {
  if (!_.isObject(value)) {
    const formattedValue = _.isString(value) ? `'${value}'` : `${value}`;
    return formattedValue;
  }

  return '[complex value]';
};

export default (data) => {
  const iter = (innerData, path = []) => {
    const formattedData = innerData.map((node) => {
      const pathElements = [...path, node.name];
      const actualPath = pathElements.join('.');
      if (node.type === 'ADDED') {
        return `Property '${actualPath}' was added with value: ${getFormattedValue(node.value)}`;
      }
      if (node.type === 'REMOVED') {
        return `Property '${actualPath}' was removed`;
      }
      if (node.type === 'CHANGED') {
        return `Property '${actualPath}' was updated. From ${getFormattedValue(node.oldValue)} to ${getFormattedValue(node.newValue)}`;
      }
      if (node.type === 'NESTED') {
        return `${iter(node.children, pathElements)}`;
      }
      if (node.type === 'UNCHANGED') {
        return null;
      }
      throw new Error(`"${node.type}" type is not supported by the formatter`);
    })
      .filter((elem) => elem !== null);

    return `${formattedData.join('\n')}`;
  };

  return iter(data);
};
