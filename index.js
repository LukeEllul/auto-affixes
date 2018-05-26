const R = require('ramda');
const { newNode, getNodeCharacter, getNodeChildren } = require('./src/node');
const { insertWords, getSuffixes, store, rootNode } = require('./src/trie');
const { getRealSuffixes} = require('./src/morphemes');
const { updateSuffixBoundaries, updatePrefixBoundaries, boundarySuffixCheckLog, boundaryPrefixCheckLog } = require('./src/boundary');
const fs = require('fs');

//list of words and their counts
const list = {
    report: 3900,
    reporter: 241,
    reporters: 82,
    reported: 609,
    reportable: 5,
    reportage: 63,
    able: 5900
};

//root node
const newRoot = R.pipe(
    R.mapObjIndexed((v, k) => ({[' ' + k]: v})),
    R.values,
    a => Object.assign({}, ...a),
    obj => insertWords(obj, rootNode)
)(list);

//iterative suffix boundary check for "reporters"
boundarySuffixCheckLog(' reporters', '', newRoot, newRoot);

//iterative prefix boundary check for "reportable"
boundaryPrefixCheckLog(' reportable', '', newRoot, newRoot);

//create trie with updated suffix scores
const updatedSuffixes = updateSuffixBoundaries('', newRoot, newRoot);

//create trie with updated prefix scores
const updatedPrefixes = updatePrefixBoundaries(updatedSuffixes, updatedSuffixes);

//log suffixes in words starting with "r"
console.log(getRealSuffixes(getNodeChildren(updatedSuffixes)['r']).map(node => getSuffixes('')(node)))

//store trie with updated prefixes and suffixes as JSON file
fs.writeFileSync('./tries/trie.json', JSON.stringify(store(updatedPrefixes)));