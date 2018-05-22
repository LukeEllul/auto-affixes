const R = require('ramda');
const {newNode, getNodeCharacter } = require('./node');
const { containsWord, getSuffixes } = require('./trie');
const { getDeepCount, getGoldenChildren, getGoldenCount } = require('./morphemes');

/**
 * Test1 :: String -> Node -> bool
 */
const Test1 = containsWord;

/**
 * Test2 :: String ->  Node -> bool
 */
const Test2 = R.curry((s, Node) => 
    1 - (getGoldenCount(s, Node) / getGoldenCount(R.init(s), Node)) < 0.005);

/**
 * Test3 :: String -> Node -> bool
 */
const Test3 = R.curry((s, Node) =>
    getGoldenCount(s, Node) / getGoldenCount(R.init(s), Node) < 1);

/**
 * updateSuffixBoundaries :: String -> Node -> Node -> Node
 */
const updateSuffixBoundaries = R.curry((s, Node, node) =>
    node(c => b => n => props => children => 
        newNode(c, b, n, {
            ...props,
            suffixScore: Test1(s, Node) && Test2(s, Node) && Test3(s + c, Node) ? 19 : -1
        }, R.map(updateSuffixBoundaries(s + c, Node))(children))));

/**
 * updatePrefixBoundaries :: Node -> Node -> Node
 */
const updatePrefixBoundaries = R.curry((Node, node) =>
    node(c => b => n => props => children =>
        newNode(c, b, n, {
            ...props,
            prefixScore: R.pipe(
                _ => Object.keys(children),
                R.map(ch => 
                    getSuffixes('', children[ch])
                    .map(w => Test1(' ' + ch + w, Node) && Test2(' ' + ch + w, Node) && Test3(' ' + c + ch + w, Node))),
                R.flatten,
                R.map(v => v ? 19 : -1),
                R.sum
            )()
        }, R.map(updatePrefixBoundaries(Node))(children))));

module.exports = {
    updatePrefixBoundaries,
    updateSuffixBoundaries
};