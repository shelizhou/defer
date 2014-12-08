# defer

##示例

### 新建一个defer
```
	var text = Defer(function(d){
        setTimeout(function(){
            d.resolve(3);  // or reject
        },200)
    });
```

### 注册一个函数
```
	text.done(function(arg){
		alert(arg); // 弹出3
	});
```


##支持模块化
```
	var Defer = require('./defer');
```