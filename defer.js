/**
 * name : defer
 * Description : 模仿jquery的defer做出来
 * createtime: 2014-12-08
 * version: 0.1
 * author: she
 */

;(function(undefined) {
    
    "use strict";

    var defer = function(callback) {

        var
            // 注册的success和fail函数集合
            arrSu = [],
            arrFa = [],

            // resolve和reject的参数, 只有第一次传的时候会生效
            argSu,
            argFa,

            // 状态值
            stateKey = {
                // 正准备
                "notyet": "notyet", 

                // 接受
                "resolved": "resolved",

                // 拒接
                "rejected": "rejected"
            },
            state = "notyet",

            // 改变状态--接受
            resolve = function() {
                if (state === "rejected") return;

                var i = 0,
                    arg = argSu ? argSu : (argSu = arguments);
                for (; i < arrSu.length;) {
                    arrSu.pop().apply(null, arg);
                }

                state = "resolved";
                result.state = stateKey[state];
            },

            // 改变状态--拒绝
            reject = function() {
                if (state === "resolved") return;

                var i = 0,
                    arg = argFa ? argFa : (argFa = arguments);

                for (; i < arrFa.length;) {
                    arrFa.pop().apply(null, arg);
                }

                state = "rejected";
                result.state = stateKey[state];
            },

            // 抛出的
            result = {

                // 注册接受的函数
                done: function(fn) {
                    arrSu.push(fn);
                    if (state === "resolved") {
                        resolve();
                    }
                    return result;
                }

                // 注册拒绝的函数
                ,
                fail: function(fn) {
                    arrFa.push(fn);
                    if (state === "rejected") {
                        reject();
                    }

                    return result;
                },
                resolve: resolve,
                reject: reject,
                state: stateKey["notyet"]

                // 不允许在外部改变状态
                ,
                promise: function() {
                    return {
                        done: result.done,
                        fail: result.fail
                    }
                }
            };

        // 第一次注册时，参数会提供有两个方法
        callback && callback({
            resolve: resolve,
            reject: reject
        });

        return result;
    };



    // 检测上下文环境是否为 AMD 或者 CMD   
    if (typeof define === 'function' && (define.amd || define.cmd)) {
        define(function() {
            return defer;
        });

    // 检查上下文是否为 node
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = defer;
        
    } else {
        window.Defer = defer;
    }

})();