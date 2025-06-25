var compose = function(functions) {
    return function(x) {
        // 从最后一个函数开始执行
        for (var i = functions.length - 1; i >= 0; i--) {
            // 检查是否为有效函数
            if (typeof functions[i] === 'function') {
                x = functions[i](x);
            }
        }
        return x;
    };
};

const fn = compose([x => x + 1, x => 2 * x])
console.log(fn(4)) // 9