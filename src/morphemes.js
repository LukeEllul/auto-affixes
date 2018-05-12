const R = require('ramda');
const { insertWords, store } = require('./trie');
const { getDeepProperty, getNodeBool, getNodeCharacter, newNode, getNodeChildren, getNodeCount } = require('./node');
const fs = require('fs');

/**
 * getDeepCount :: String -> Node -> Number
 */
const getDeepCount = getDeepProperty(_ => _ => n => _ => _ => n);

/**
 * childrenToList :: {n: Node} -> [Node]
 */
const childrenToList = children => Object.keys(children).map(k => children[k]);

/**
 * getGoldenChildren :: String -> Node -> [Node]
 */
const getGoldenChildren = R.curry((s, Node) =>
    getDeepProperty(_ => _ => _ => _ => children =>
        [...childrenToList(children).filter(getNodeBool), 
            ...R.flatten(childrenToList(children)
                .map(node => getGoldenChildren(s + getNodeCharacter(node))(Node)))])(s)(Node));

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

const golds = getGoldenChildren('reporting')(newRoot);

console.log(golds.map(getNodeCount))

// fs.writeFileSync('./tries/trie1.json', JSON.stringify(store(newRoot)));