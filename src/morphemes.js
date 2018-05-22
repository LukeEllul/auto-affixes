const R = require('ramda');
const { insertWords, store, getSuffixes } = require('./trie');
const { getDeepProperty, getNodeBool, getNodeCharacter, newNode, getNodeChildren, getNodeCount, getNodeProperties } = require('./node');
const fs = require('fs');

/**
 * getDeepCount :: String -> Node -> Number
 */
const getDeepCount = R.curry((s, Node) =>
    getDeepProperty(_ => _ => n => _ => _ => n)(s, Node) || 0);

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
            .map(node => getGoldenChildren(s + getNodeCharacter(node))(Node)))])(s)(Node) || []);

/**
 * getGoldenCount :: String -> Node -> Number
 */
const getGoldenCount = R.curry((s, Node) => R.sum([...getGoldenChildren(s, Node).map(getNodeCount), getDeepCount(s, Node)]));

/**
 * getRealSuffixes :: Node -> [Node]
 */
const getRealSuffixes = Node =>
    R.flatten([...getNodeProperties(Node).suffixScore > 0 ? [Node] : [],
    ...R.pipe(
        _ => getNodeChildren(Node),
        children => Object.keys(children).map(c => getRealSuffixes(children[c]))
    )()]);

module.exports = {
    getDeepCount,
    childrenToList,
    getGoldenChildren,
    getGoldenCount,
    getSuffixes,
    getRealSuffixes
};