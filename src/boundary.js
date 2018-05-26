const R = require('ramda');
const { newNode, getNodeCharacter, getNodeChildren } = require('./node');
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
 * PrefixTest2 :: String ->  Node -> bool
 */
const PrefixTest2 = R.curry((s, Node) =>
    1 - (getGoldenCount(' ' + s, Node) / getGoldenCount(' ' + R.tail(s), Node)) < 0.005);

/**
 * PrefixTest3 :: String -> Node -> bool
 */
const PrefixTest3 = R.curry((s, Node) =>
    getGoldenCount(' ' + s, Node) / getGoldenCount(' ' + R.tail(s), Node) < 1);

/**
 * updateSuffixBoundaries :: String -> Node -> Node -> Node
 */
const updateSuffixBoundaries = R.curry((s, Node, node) =>
    node(c => b => n => props => children =>
        newNode(c, b, n, {
            ...props,
            //suffixScore: (props.suffixScore || 0) + (Test1(s, Node) && Test2(s, Node) && Test3(s + c, Node) ? 19 : -1)
            suffixScore: R.pipe(
                R.map(getNodeCharacter),
                R.values,
                R.map(B => (props.suffixScore || 0) + (Test1(s + c, Node) && Test2(s + c, Node) && Test3(s + c + B, Node) ? 19 : -1)),
                R.sum
            )(children)
        }, R.map(updateSuffixBoundaries(s + c, Node))(children))));

/**
 * boundarySuffixCheckLog :: String -> Node -> Node -> Node
 */
const boundarySuffixCheckLog = R.curry((w, s, Node, node) =>
    R.equals(getNodeChildren(node), {}) ? node :
        node(c => b => n => props => children => {
            const word = w.slice((s + c).length);
            console.log(`Boundary check for: ${s + c}-${word}`);
            const test1 = Test1(s + c, Node);
            const test2 = Test2(s + c, Node);
            const test3 = Test3(s + c + R.head(word), Node);
            console.log(`Test 1 for ${s + c} is ${test1 ? 'True' : 'False'}`);
            console.log('Test 2: Freq of alphaA / Freq of alpha = is it approx equal to 1?');
            console.log(`alphaA: ${getGoldenCount(s + c, Node)} / alpha: ${getGoldenCount(s, Node)} = ${test2 ? 'True' : 'False'}`);
            console.log('Test 3: Freq of alphaAB / Freq of alphaA = is it much less than 1?');
            console.log(`alphaAB : ${getGoldenCount(s + c + R.head(word), Node)} / alphaA: ${getGoldenCount(s + c, Node)} = ${test3 ? 'True' : 'False'}`);
            console.log();
            console.log();
            return newNode(c, b, n, {
                ...props,
                suffixScore: (props.suffixScore || 0) + (test1 && test2 && test3 ? 19 : -1)
            }, { ...children, [R.head(word)]: boundarySuffixCheckLog(w, s + c, Node, children[R.head(word)]) });
        }));

/**
 * updatePrefixBoundaries :: Node -> Node -> Node
 */
const updatePrefixBoundaries = R.curry((Node, node) =>
    node(c => b => n => props => children =>
        newNode(c, b, n, {
            ...props,
            prefixScore: (props.prefixScore || 0) + R.pipe(
                R.map(child => R.pipe(
                    R.map(suffix =>
                        Test1(' ' + getNodeCharacter(child) + suffix, Node) &&
                        PrefixTest2(getNodeCharacter(child) + suffix, Node) &&
                        PrefixTest3(c + getNodeCharacter(child) + suffix, Node)),
                    R.map(v => v ? 19 : -1),
                    R.sum
                )(getSuffixes('', child))),
                R.values,
                R.sum
            )(children)
        }, R.map(updatePrefixBoundaries(Node))(children))));

/**
 * boundaryPrefixCheckLog -> Node -> Node -> Node
 */
const boundaryPrefixCheckLog = R.curry((w, s, Node, node) =>
    R.equals(getNodeChildren(node), {}) ? node :
        node(c => b => n => props => children => {
            const word = w.slice((s + c).length);
            console.log(`Boundary check: ${s + c}-${word}`);
            const test1 = Test1(' ' + word, Node);
            const test2 = PrefixTest2(word, Node);
            const test3 = PrefixTest3(c + word, Node);
            console.log(`Test 1 for ${word} is ${test1 ? 'True' : 'False'}`);
            console.log('Test 2: Freq of Bbeta / Freq of beta = is it approx equal to 1?');
            console.log(`Bbeta: ${getGoldenCount(' ' + word, Node)} / beta: ${getGoldenCount(' ' + R.tail(word), Node)} = ${test2 ? 'True' : 'False'}`);
            console.log('Test 3: Freq of ABbeta / Freq of Bbeta = is it much less than 1?');
            console.log(`ABbeta : ${getGoldenCount(' ' + c + word, Node)} / Bbeta: ${getGoldenCount(' ' + word, Node)} = ${test3 ? 'True' : 'False'}`);
            console.log();
            console.log();
            return newNode(c, b, n, {
                ...props,
                prefixScore: (props.prefixScore || 0) + (test1 && test2 && test3 ? 19 : -1)
            }, { ...children, [R.head(word)]: boundaryPrefixCheckLog(w, s + c, Node, children[R.head(word)]) })
        }));

module.exports = {
    updatePrefixBoundaries,
    updateSuffixBoundaries,
    boundarySuffixCheckLog,
    boundaryPrefixCheckLog
};