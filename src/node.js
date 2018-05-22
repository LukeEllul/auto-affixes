const R = require('ramda');
const { Either } = require('../x/X');

/**
 * Node :: char -> bool -> Number -> {n: Node} -> b
 */

/**
 * newNode :: char -> bool -> Number -> Object -> {n: Node} -> Node -> b
 */
const newNode = R.curry((a, b, n, props, children, Node) => Node(a)(b)(n)(props)(children));

/**
 * getNodeCharacter :: Node -> char
 */
const getNodeCharacter = Node => Node(a => _ => _ => _ => _ => a);

/**
 * getNodeBool :: Node -> bool
 */
const getNodeBool = Node => Node(_ => b => _ => _ => _ => b);

/**
 * getNodeCount :: Node -> Number
 */
const getNodeCount = Node => Node(_ => _ => n => _ => _ => n);

/**
 * getNodeChildren :: Node -> {n: Node}
 */
const getNodeChildren = Node => Node(_ => _ => _ => _ => children => children);

/**
 * getNodeProperties :: Node -> Object
 */
const getNodeProperties = Node => Node(_ => _ => _ => props => _ => props);

/**
 * childExists :: char -> Node -> bool
 */
const childExists = R.curry((c, Node) => getNodeChildren(Node)[c] ? true : false);

/**
 * getNodeChild :: char -> Node -> Node
 */
const getNodeChild = R.curry((c, Node) => getNodeChildren(Node)[c])

/**
 * addChild :: Node -> Node -> Node
 */
const addChild = R.curry((parent, child) =>
    parent(a => b => n => props => children => newNode(a, b, n, props, { ...children, [getNodeCharacter(child)]: child })));

/**
 * removeChild :: char -> Node -> Node
 */
const removeChild = R.curry((parent, char) =>
    parent(a => b => n => props => children => newNode(a, b, n, props, R.omit([char], children))));

/**
 * updateDeepNode :: (char -> bool -> Number -> Object -> {n: Node} -> Node) -> String -> Node -> Node
 */
const updateDeepNode = R.curry((f, s, Node) =>
    s.length === 1 ? Node(f) : childExists(R.head(R.tail(s)), Node) ?
        s.length === 2 ? addChild(removeChild(Node, R.tail(s)), getNodeChild(R.tail(s), Node)(f)) :
            addChild(Node, updateDeepNode(f, R.tail(s), getNodeChild(R.head(R.tail(s)), Node))) :
        Node);

/**
 * getDeepProperty :: (char -> bool -> Number -> Object -> {n : Node} -> a) -> String -> Node -> a
 */
const getDeepProperty = R.curry((f, s, Node) =>
    s.length === 1 ? Node(f) : childExists(R.head(R.tail(s)), Node) ? 
        s.length === 2 ? getNodeChild(R.tail(s), Node)(f) :
        getDeepProperty(f, R.tail(s), getNodeChild(R.head(R.tail(s)), Node)) : undefined);

// const updateDeepNode = R.curry((f, s, Node) =>
//     s.length === 1 ? Node(f) :
//         childExists(R.head(R.tail(s)), Node) ?
//             addChild(removeChild(Node, R.head(R.tail(s))), ))

// const root = newNode('r', false, 20, {}, {});
// const c1 = newNode('e', false, 12, {}, {});
// const c2 = newNode('d', false, 13, {}, {});

// const c3 = addChild(c2, newNode('q', false, 25, {}, {}));

// const updatedRoot = R.pipe(
//     updateDeepNode(_ => _ => _ => _ => newNode('f', false, 23, {}), 're'),
//     updateDeepNode(a => b => n => children => addChild(newNode(a, b, n, children), newNode('e', false, 25, {})), 'rf'),
//     updateDeepNode(a => b => n => children => addChild(newNode(a, b, n, children), newNode('t', false, 45, {})), 'rfe')
// )(newRoot);

// console.log(getNodeChildren(getNodeChildren(getNodeChildren(updatedRoot)['f'])['e']));

module.exports = {
    newNode,
    updateDeepNode,
    addChild,
    removeChild,
    childExists,
    getNodeChildren,
    getNodeCharacter,
    getDeepProperty,
    getNodeBool,
    getNodeCount,
    getNodeProperties
};