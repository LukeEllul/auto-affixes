const R = require('ramda');
const { newNode } = require('../src/node');
const { containsWord, store, restore, insertWords, rootNode } = require('../src/trie');
const fs = require('fs');

//rootNode
const rNode = newNode('r', false, {}, {});

console.log('Wordlist 1:');

//wordlist 1 (these words will be stored in the trie)
const list1 = ['report', 'reporter', 'reporters', 'reported', 'reportable', 'reportage',
    'reportages', 'reporting', 'reporters', 'reportings'];

console.log(list1);
console.log();

console.log('Wordlist 2:');

//wordlist 2 (these words will NOT be stored in the trie)
const list2 = ['repo', 'save', 't', 'ejis', 'rep', 'hey', 'paws', 'gold', 'congress', 'repor'];

console.log(list2);
console.log();

console.log('Putting words in list 1 in trie');
console.log();

//put wordlist 1 in trie
const Trie = insertWords(Object.assign({}, ...list1.map(w => ({ [w]: 1 }))))(rNode);

console.log('Now checking if words in list 1 are in trie:')

//check if words in wordlist1 are in the Trie
const a = list1.map(w => containsWord(w, Trie) ? 'yes' : 'no');

console.log(a);
//a = [ 'yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes' ]
console.log('We have 10 yeses, one "yes" for each word');
console.log();

console.log('Now checking if words in list 2 are in the trie:');

//checkif words in wordlist 2 are in the Trie
const b = list2.map(w => containsWord(w, Trie) ? 'yes' : 'no');

console.log(b);
//b = [ 'no', 'no', 'no', 'no', 'no', 'no', 'no', 'no', 'no', 'no' ]
console.log('We have 10 nos, one "no" for each word');
console.log();

console.log('Putting the wordlist stored in list1.txt in trie');

//read words from list1.txt and store them in tree
const BigTrie = insertWords(Object.assign({},
    ...fs.readFileSync('./wordlists/list1.txt').toString().split('\r\n').map(w => ({ [' ' + w]: 1 }))))(rootNode);

console.log('storing the trie in trie1.json');
fs.writeFileSync('./tries/trie1.json', JSON.stringify(store(BigTrie)));

console.log('trie stored in trie1.json');
console.log();

console.log('restoring trie from trie1.json');
const RestoredBigTrie = restore(JSON.parse(fs.readFileSync('./tries/trie1.json')));
console.log();

console.log('checking if the word "abdomen" is in trie:');
console.log(containsWord(' abdomen', RestoredBigTrie) ? 'yes' : 'no');
console.log();

console.log('checking if the word "ejisgfhv" is in trie:');
console.log(containsWord(' ejisgfhv', RestoredBigTrie) ? 'yes' : 'no');