import yaml from 'js-yaml';

// Выбираем и запускаем парсер
const parsers = { json: JSON.parse, yaml: yaml.safeLoad, yml: yaml.safeLoad };

export default (data, dataFormat) => parsers[dataFormat](data);
