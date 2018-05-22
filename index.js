const R = require('ramda');
const { newNode, getNodeCharacter } = require('./src/node');
const { insertWords, getSuffixes, store } = require('./src/trie');
const { getRealSuffixes} = require('./src/morphemes');
const { updateSuffixBoundaries, updatePrefixBoundaries } = require('./src/boundary');
const fs = require('fs');

const list = {
    report: 123,
    reportable: 24,
    reportages: 34,
    reported: 26,
    reporter: 45,
    reporters: 35,
    reporting: 38,
    reportage: 67
};

const root = newNode('r', false, 0, {}, {});

const newRoot = insertWords(list)(root);

const updatedSuffixes = updateSuffixBoundaries('', newRoot, newRoot);

console.log(getRealSuffixes(updatedSuffixes).map(node => getSuffixes('')(node).map(v => getNodeCharacter(node) + v)))

//fs.writeFileSync('./tries/trie6.json', JSON.stringify(store(updatedSuffixes)))