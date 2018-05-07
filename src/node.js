const R = require('ramda');
const { Either } = require('../x/X');

/**
 * Node :: char -> bool -> Number -> {n: Node} -> b
 */

/**
 * newNode :: char -> bool -> Number -> {n: Node} -> Node -> b
 */
const newNode = R.curry((a, b, n, children, Node) => Node(a)(b)(n)(children));

/**
 * getNodeCharacter :: Node -> char
 */
const getNodeCharacter = Node => Node(a => _ => _ => _ => a);

/**
 * getNodeBool :: Node -> bool
 */
const getNodeBool = Node => Node(_ => b => _ => _ => b);

/**
 * getNodeCount :: Node -> Number
 */
const getNodeCount = Node => Node(_ => _ => n => _ => n);

/**
 * getNodeChildren :: Node -> {n: Node}
 */
const getNodeChildren = Node => Node(_ => _ => _ => children => children);

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
    parent(a => b => n => children => newNode(a, b, n, { ...children, [getNodeCharacter(child)]: child })));

/**
 * removeChild :: char -> Node -> Node
 */
const removeChild = R.curry((parent, char) =>
    parent(a => b => n => children => newNode(a, b, n, R.omit([char], children))));

/**
 * updateDeepNode :: (char -> bool -> Number -> {n: Node} -> Node) -> String -> Node -> Node
 */
const updateDeepNode = R.curry((f, s, Node) =>
    childExists(R.head(R.tail(s)), Node) ?
        s.length === 2 ? addChild(removeChild(Node, R.tail(s)), getNodeChild(R.tail(s), Node)(f)) :
            addChild(Node, updateDeepNode(f, R.tail(s), getNodeChild(R.head(R.tail(s)), Node))) :
        Node);

// const root = newNode('r', false, 20, {});
// const c1 = newNode('e', false, 12, {});
// const c2 = newNode('d', false, 13, {});

// const newRoot = addChild(addChild(root, c1), c2);

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
    getNodeChildren
}