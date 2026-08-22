const fs = require('node:fs');
const path = require('node:path');
const Sets = require('../element-sets.js');

const target = path.join(__dirname, '..', 'elementSets.seed.json');
fs.writeFileSync(target, JSON.stringify(Sets.buildElementSetsSeed(), null, 2) + '\n');
console.log(`Wrote ${target}`);
