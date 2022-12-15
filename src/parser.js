import yaml from 'js-yaml';

const parsers = { json: JSON.parse, yaml: yaml.load, yml: yaml.load };

export default (data, dataFormat) => parsers[dataFormat](data);
