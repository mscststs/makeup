import yamlParser from 'js-yaml';


export function toJSON(yaml) {
  return yamlParser.load(yaml);
}

export function toYAML(json) {
  return yamlParser.dump(json);
}