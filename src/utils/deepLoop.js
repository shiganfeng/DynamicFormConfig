export const deepLoop = (function () {
    // 当前节点优先:  a n b f j o s w c d e g h i k l m p q r t u v x y z
    // 子节点优先：   c d e g h i k l m p q r t u v x y z b f j o s w a n
    function getNodesByBreadth(nodeList, options = {}) {
        options = Object.assign({
            priority: 'son', // 子节点优先：son，当前节点优先：self
            childKey: 'children'
        }, options);
        const childKey = options.childKey;
        const method = options.priority === 'son' ? 'unshift' : 'push';
        const sonList = nodeList.map(node => {
            return {
                node,
                parentNode: null
            }
        });
        let nextTierList = sonList;
        while (nextTierList.length) {
            const arr = [];
            for (let i = 0; i < nextTierList.length; i++) {
                const children = nextTierList[i].node[childKey] || [];
                arr.push(...children.map(node => {
                    return {
                        node,
                        parentNode: nextTierList[i].node
                    }
                }));
            }
            nextTierList = arr;
            sonList[method](...arr);
        }
        return sonList;
    }

    // 当前节点优先:  a b c d e f g h i j k l m n o p q r s t u v w x y z
    // 子节点优先：   c d e b g h i f k l m j a p q r o t u v s x y z w n

    function getNodesByDeep(nodeList, options = {}) {
        options = Object.assign({
            priority: 'son', // 子节点优先：son，当前节点优先：self
            childKey: 'children'
        }, options);
        const method = options.priority === 'son' ?
            ['pop', 'unshift', 'push']
            : ['shift', 'push', 'unshift'];

        const sonList = [];
        let nextTierList = nodeList.map(node => {
            return {
                node,
                parentNode: null
            }
        });
        while (nextTierList.length) {
            const cur = nextTierList[method[0]]();// shift
            sonList[method[1]](cur);// push
            nextTierList[method[2]](...(cur.node[options.childKey] || []).map(node => {// unshift
                return {
                    node,
                    parentNode: cur.node
                }
            }));
        }
        return sonList;
    }
    // const arr = [
    //     {
    //         name: 'a',
    //         childList: [
    //             {
    //                 name: 'b',
    //                 childList: [
    //                     {
    //                         name: 'c'
    //                     },
    //                     {
    //                         name: 'd'
    //                     },
    //                     {
    //                         name: 'e'
    //                     }
    //                 ]
    //             },
    //             {
    //                 name: 'f',
    //                 childList: [
    //                     {
    //                         name: 'g'
    //                     },
    //                     {
    //                         name: 'h'
    //                     },
    //                     {
    //                         name: 'i'
    //                     }
    //                 ]
    //             },
    //             {
    //                 name: 'j',
    //                 childList: [
    //                     {
    //                         name: 'k'
    //                     },
    //                     {
    //                         name: 'l'
    //                     },
    //                     {
    //                         name: 'm'
    //                     }
    //                 ]
    //             },
    //         ]
    //     },
    //     {
    //         name: 'n',
    //         childList: [
    //             {
    //                 name: 'o',
    //                 childList: [
    //                     {
    //                         name: 'p'
    //                     },
    //                     {
    //                         name: 'q'
    //                     },
    //                     {
    //                         name: 'r'
    //                     }
    //                 ]
    //             },
    //             {
    //                 name: 's',
    //                 childList: [
    //                     {
    //                         name: 't'
    //                     },
    //                     {
    //                         name: 'u'
    //                     },
    //                     {
    //                         name: 'v'
    //                     }
    //                 ]
    //             },
    //             {
    //                 name: 'w',
    //                 childList: [
    //                     {
    //                         name: 'x'
    //                     },
    //                     {
    //                         name: 'y'
    //                     },
    //                     {
    //                         name: 'z'
    //                     }
    //                 ]
    //             },
    //         ]
    //     },
    // ];

    // console.log('getNodesByBreadth 子节点优先', getNodesByBreadth(arr, {
    //     priority: 'son',
    //     childKey: 'childList',
    // }).map(i => i.node.name));
    // console.log('getNodesByBreadth 当前节点优先', getNodesByBreadth(arr, {
    //     priority: 'self',
    //     childKey: 'childList',
    // }).map(i => i.node.name));
    // console.log('getNodesByDeep 子节点优先', getNodesByDeep(arr, {
    //     priority: 'son',
    //     childKey: 'childList',
    // }).map(i => i.node.name));
    // console.log('getNodesByDeep 当前节点优先', getNodesByDeep(arr, {
    //     priority: 'self',
    //     childKey: 'childList',
    // }).map(i => i.node.name));

    return {
        getNodesByBreadth,
        getNodesByDeep
    };
}());