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

        // 返回对象
        if (!(this instanceof defer)) {
            return new defer(callback);
        }

        
        var
            // 注册的success和fail函数集合
            arrSu = [],
            arrFa = [],

            // resolve和reject的参数, 只有第一次传的时候会生效
            argSu,
            argFa,

            // 步骤
            arrStepFn = [],

            // 状态值
            stateKey = {
                // 正准备
                "notyet": "notyet", 

                // 接受
                "resolved": "resolved",

                // 拒接
                "rejected": "rejected"
            },
            state = stateKey["notyet"],

            // 改变状态--接受
            resolve = function() {
                if (state === stateKey["rejected"]) return;
                state = stateKey["resolved"];

                var i = 0,
                    arg = argSu ? argSu : (argSu = arguments);
                for (; i < arrSu.length;) {
                    arrSu.shift().apply(null, arg);
                }

            },

            // 改变状态--拒绝
            reject = function() {
                if (state === stateKey["resolved"]) return;
                state = stateKey["rejected"];

                var i = 0,
                    arg = argFa ? argFa : (argFa = arguments);

                for (; i < arrFa.length;) {
                    arrFa.shift().apply(null, arg);
                }

            },

            // 步骤
            progress = function(){
                if (state !== stateKey["notyet"]) return;
                var i = 0,
                    arg = arguments;

                for (; i < arrStepFn.length;i++) {
                    arrStepFn[i].apply(null, arg);
                }
            },

            // 抛出的
            result = {

                // 注册接受的函数
                done: function(fn) {
                    arrSu.push(fn);
                    if (state === stateKey["resolved"]) {
                        resolve();
                    }
                    return result;
                },

                // 注册拒绝的函数
                fail: function(fn) {
                    arrFa.push(fn);
                    if (state === stateKey["rejected"]) {
                        reject();
                    }

                    return result;
                },
                step: function(fn) {
                    if (state === stateKey["notyet"]) {
                        arrStepFn.push(fn);
                    }
                    return result;
                },
                progress: progress,
                resolve: resolve,
                reject: reject,
                state: function(){
                    return state;
                },

                // 不允许在外部改变状态
                
                promise: function() {
                    return {
                        done: result.done,
                        fail: result.fail,
                        state: function(){
                            return state;
                        }
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