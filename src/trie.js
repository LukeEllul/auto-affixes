const R = require('ramda');
const {newNode, updateDeepNode, addChild, childExists, getNodeChildren, getNodeCharacter} = require('./node');
const fs = require('fs');

/**
 * createBranch :: char -> bool -> Number -> Object -> String -> Node -> Node
 */
const createBranch = R.curry((a, b, n, props) =>
    updateDeepNode(A => B => N => Props => children =>
        newNode(A, B, N, Props, children[a] ? children : {...children, [a]: newNode(a, b, n, props, {})})));

/**
 * store :: Node -> Object
 */
const store = Node => 
    Node(a => b => n => props => children => ({
        [a]: {
            gold: b,
            count: n,
            props: props,
            ...R.map(node => store(node)[getNodeCharacter(node)])(children)
        }
    }));

/**
 * restore :: Object -> Node
 */
const restore = (o, n = 0) => R.pipe(
    _ => R.mapObjIndexed((v, k) => newNode(k, v.gold, v.count, v.props, R.pipe(
        _ => R.omit(['gold', 'count', 'props'])(v),
        o => restore(o, 1)
    )()))(o),
    o => n === 0 ? o[Object.keys(o)[0]] : o
)();

/**
 * insertWord :: String -> bool -> count -> Node -> Node
 */
const insertWord = R.curry((word, b, n, Node) =>
    R.pipe(
        ...Array.from(R.tail(word)).map((c, i) => 
            createBranch(c, i === word.length - 2 ? b : false, i === word.length - 2 ? n : 0, {})(R.take(i + 1, word)))
    )(Node));

/**
 * containsWord :: String -> Node -> bool
 */
const containsWord = R.curry((s, Node) =>
    Node(a => b => _ => props => children => 
        a === s && b === true ? true : R.pipe(node => node ? containsWord(R.tail(s), node) : false)(children[R.head(R.tail(s))])));

/**
 * rootNode :: Node
 */
const rootNode = newNode(' ', false, 0, {},
    Object.assign({}, ...R.range(97, 123).map(s => String.fromCharCode(s)).map(c => ({[c]: newNode(c, false, 0, {}, {})}))));

/**
 * insertWords :: {String: Number} -> Node -> Node
 */
const insertWords = R.curry((map, node) =>
    Object.keys(map).reduce((node, k) => insertWord(k, true, map[k], node), node));