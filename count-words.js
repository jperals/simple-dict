const yaml = require('js-yaml');
const fs   = require('fs');
const dict = yaml.safeLoad(fs.readFileSync('./src/data/laia-ca.yaml'));
const ks = Object.keys(dict);
console.log(ks.length);