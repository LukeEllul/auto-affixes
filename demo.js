const R = require('ramda');
const fs = require('fs');
const { getNodeChildren } = require('./src/node');
const { store, restore, rootNode, insertWords, getSuffixes } = require('./src/trie');
const { updateSuffixBoundaries, updatePrefixBoundaries } = require('./src/boundary');
const { getRealSuffixes } = require('./src/morphemes');

//create BigTrie from wordlist in wordlist.json
console.log('creating trie from "wordlist.json"');
const BigTrie = R.pipe(
    R.mapObjIndexed((v, k) => ({[' ' + k]: parseInt(v)})),
    R.values,
    a => Object.assign({}, ...a),
    obj => insertWords(obj, rootNode)
)(JSON.parse(fs.readFileSync('./wordlists/wordlist.json')));

console.log();

console.log('updating suffix scores...');
const updatedSuffixes = updateSuffixBoundaries('', BigTrie, BigTrie);

console.log('updating prefix scores...');
const updatedPrefixes = updatePrefixBoundaries(updatedSuffixes, updatedSuffixes);

console.log();

console.log('storing trie in BigTrie.json');
//store BigTrie in BigTrie.json
fs.writeFileSync('./tries/BigTrie.json', JSON.stringify(store(updatedPrefixes)));

console.log();

console.log('restoring BigTrie.json');
//restore BigTrie.json
const RestoredBigTrie = restore(JSON.parse(fs.readFileSync('./tries/BigTrie.json')));

console.log();

console.log('suffixes found in Restored BigTrie:');
//log suffixes found in RestoredBigTrie
console.log(R.uniq(R.flatten(getRealSuffixes(RestoredBigTrie).map(node => getSuffixes('')(node)))));