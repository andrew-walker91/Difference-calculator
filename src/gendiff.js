import _ from 'lodash';

const genDiff = (obj1, obj2) => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  const sortedKeys = _.sortBy(_.union(keys1, keys2));

  const result = sortedKeys.map((key) => {
    if (!_.has(obj1, key)) {
      return {
        name: key, type: 'ADDED', value: obj2[key],
      };
    }
    if (!_.has(obj2, key)) {
      return {
        name: key, type: 'REMOVED', value: obj1[key],
      };
    }
    if (_.isPlainObject(obj1[key]) && _.isPlainObject(obj2[key])) {
      return {
        name: key, type: 'NESTED', children: genDiff(obj1[key], obj2[key]),
      };
    }
    if (obj1[key] !== obj2[key]) {
      return {
        name: key, type: 'CHANGED', oldValue: obj1[key], newValue: obj2[key],
      };
    }
    return {
      name: key, type: 'UNCHANGED', value: obj1[key],
    };
  });

  return result;
};

export default genDiff;
