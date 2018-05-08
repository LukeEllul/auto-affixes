const R = require('ramda');
const {newNode, updateDeepNode, addChild, childExists, getNodeChildren, getNodeCharacter} = require('./node');
const fs = require('fs');

/**
 * createBranch :: char -> bool -> Number -> String -> Node -> Node
 */
const createBranch = R.curry((a, b, n) =>
    updateDeepNode(A => B => N => children => 
        newNode(A, B, N, children[a] ? children : {...children, [a]: newNode(a, b, n, {})})));

/**
 * store :: Node -> Object
 */
const store = Node => 
    Node(a => b => n => children => ({
        [a]: {
            gold: b,
            count: n,
            ...R.map(node => store(node)[getNodeCharacter(node)])(children)
        }
    }));

/**
 * restore :: Object -> Node
 */
const restore = (o, n = 0) => R.pipe(
    _ => R.mapObjIndexed((v, k) => newNode(k, v.gold, v.count, R.pipe(
        _ => R.omit(['gold', 'count'])(v),
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
            createBranch(c, i === word.length - 2 ? b : false, i === word.length - 2 ? n : 0)(R.take(i + 1, word)))
    )(Node));