// function polling(key,val,bool,callback){
//     var timer = setInterval(function(){
//         if(bool && key == val){
//             clearInterval(timer);
//         }else if(key != val){

//         }
//     },100);
// }



/**
 * 向某节点前插入节点
 * @param  {[元素]} newEle    [要插入的节点]
 * @param  {[元素]} targetEle [目标节点]
 * @return {[无]}           [无]
 */
function insertBefore( newEle , targetEle ){
    targetEle.parentNode.insertBefore( newEle , targetEle );
}


/**
 * 向某节点后插入节点
 * @param  {[元素]} newEle    [要插入的节点]
 * @param  {[元素]} targetEle [目标节点]
 * @return {[无]}           [无]
 */
function insertAfter( newEle , targetEle ){

    var tNextSibling = targetEle.nextSibling;
    var targetEleParent = targetEle.parentNode;

    if( tNextSibling ){
        targetEleParent.insertBefore( newEle , tNextSibling );
    }else{
        targetEleParent.appendChild( newEle );
    }

}



/**
 * 根据时间戳格式化时间
 * @param  {[混合]} timestamp [字符串或数字]
 * @param  {[字符串]} format    [日期格式，只接受三种格式]
 * @return {[字符串]}           [返回格式化后的时间]
 */
function fTime(timestamp,format){
    // console.log(Number(timestamp));
    var timestamp = parseInt(timestamp);
    var format = format || 'Y-M-D h:m:s';
    var now = new Date(timestamp);
    var Y = now.getFullYear(),
        M = now.getMonth() + 1,
        D = now.getDate(),
        h = now.getHours(),
        m = now.getMinutes(),
        s = now.getSeconds();
    var res = null;

    switch(format){

        case 'Y-M-D h:m:s':
            res = Y +'-'+ M +'-'+ D +' '+ h +':'+ m +':'+s;
            break;
        case 'Y-M-D':
            res = Y +'-'+ M +'-'+ D;
            break;
        case 'h:m:s':
            res = h +':'+ m +':'+ s;
            break;

    }

    return res;
}


/**
 * 获取当前网站的cookie
 * @return {[对象]} [键值对的cookie]
 */
function getCookie(cookieName){

    var str = document.cookie;
    var arr = str.split('; ');
    var obj = {};
    arr.forEach(function(item){
        obj[ item.split('=')[0] ] = item.split('=')[1];
    });

    var res = cookieName ? obj[cookieName] : obj;
    return res;
}


/**
 * 设置cookie
 * @param {[字符串]} cookieName [cookie的名字]
 * @param {[字符串]} val        [cookie的值]
 */
function setCookie(cookieName,val){

	document.cookie = cookieName + '=' + val;

}


function delCookie(cookieName){
	console.log(653434);
	document.cookie = name + '=;  expires=Thu, 01 Jan 1970 00:00:01 GMT;'
}


/**
 * 根据参数新建一个ajax实例
 * @param  {[参数对象]} obj      [包含method，data，url，success]
 * @param  {[请求头的类型]} dataType [默认为form]
 * @return {[无]}          [无]
 */
function ajax(obj,requestHeader){

    var xhr = null;

    // 新建一个ajax实例
    if( window.XMLHttpRequest ){
        xhr = new XMLHttpRequest();
    }else{
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }


    // 默认为get方式
    var method = obj.method || 'get',
        async = obj.async || true,
        data = obj.data || '',
        url = obj.url,
        success = obj.success;

    // 如果type有值就使用type
    // ( obj.type ) && ( method = obj.type );

    if(method == 'get' && data){

        // 如果是get方式将data数据用?与url连接起来
        url += '?' + data;

    }

    // 打开ajax通道，传入参数：请求方式，地址，是否异步
    xhr.open(method,url,async);

    if( requestHeader === 'json' ){
        console.log('application/json');
        requestHeader = 'application/json';
    }else{
        requestHeader = 'application/x-www-form-urlencoded';
    }


    // 如果是get方式直接发送，如果是post方式要声明数据类型
    if( method == 'get' ){
        xhr.send();
    }else{
        // 设置请求头数据类型
        xhr.setRequestHeader('content-type',requestHeader);
        // 发送数据
        xhr.send(data);
    }


    xhr.onreadystatechange = function(){

        if( xhr.readyState == 4 ){

            if( xhr.status === 200 ){
                success && success( xhr.responseText );
            }else if( xhr.status === 404 ){
                console.log(url);
                alert( '出错了,Err:'+xhr.status );
            }

        }
    }

}





/**
 * 创建一个新的节点
 * @param  {[字符串]} str [节点名称]
 * @return {[对象]}     [节点对象]
 */
function createNode(str){
    return document.createElement(str);
}


/**
 * 创建一个文本节点
 * @param  {[字符串]} str [字符串]
 * @return {[对象]}     [字符串节点对象]
 */
function createTextNode(str){
    return document.createTextNode(str);
}



/**
 * 取出函数体的函数名
 * @param  {[字符串]} str [字符串形式的函数体]
 * @return {[混合]}     [返回false或返回函数名或提示语]
 */
function getFnName(str){

	if(!str){
		return false;
	}

	var str = str.toString();

	var res = str.split('function');
	res.shift()
	res = res.join('');
	res = res.split('(');
	res = res[0].trim();

	if(res){
		return res;
	}else{
		return '函数体为匿名函数或格式错误';
	}

}






function tmove(){


}
tmove.prototype = {

	scale:function(){



	}

}







/**
 * 阻止浏览器默认行为
 * @param  {[对象]} e [event对象，由事件函数内部传入]
 * @return {[无]}   [无]
 */
function preventDefalut(e){

	if( e.preventDefault ){
		e.preventDefault();
	}else{
		e.returnValue = false;
	}

}





function $(v,parent){

	if(typeof v === 'function'){
		window.onload = v;
	}else if( typeof v === 'string' ){

		if( parent instanceof Object ){
			parent = parent;
		}else{
			parent = document;
		}
		var returnValue = parent.querySelector(v);
		returnValue.all = parent.querySelectorAll(v);
		return returnValue;

	}

}




/**
 * 获得一个x~y之间的随机数
 * @param  {[数值]} x [最小值]
 * @param  {[数值]} y [最大值]
 * @return {[数值]}   [返回随机数]
 */
function rand(x,y){
	return Math.round(Math.random()*(y-x)+x)
}







/**
 * 键盘控制定位元素上下左右运动(并不完善，快速操作的时候会卡顿)
 * @param  {[元素]} ele  [定位元素]
 * @param  {[数值]} step [步长]
 * @return {[无]}
 */
function moveByDirKey(ele,step){

	document.onkeydown = function(e){

		var e = e || event;
		var _this = this;

		if( !this.timer ){
			fn();
		}

		function fn(){
			switch(e.keyCode){
				case 37:
					ele.style.left = ele.offsetLeft - step + 'px';
					break;
				case 38:
					ele.style.top = ele.offsetTop - step + 'px';
					break;
				case 39:
					ele.style.left = ele.offsetLeft + step + 'px';
					break;
				case 40:
					ele.style.top = ele.offsetTop + step + 'px';
					break;
			}

			_this.timer = setTimeout(fn,30);

		}

		this.onkeyup = function(){

			clearTimeout(_this.timer);
			_this.timer = null;

		};

	}

}







/**
 * 判断第二个参数是不是第一个参数的祖先元素
 * @param  {[元素]}  ele      [元素]
 * @param  {[元素]}  ele      [元素]
 * @return {Boolean}          [是返回true否则返回false]
 */
function isParent(ele,otherEle){

	var parent = null;
	while( parent = ele.parentNode ){
		if( parent == otherEle ) return true;
		ele = parent;
	}
	return false;

}








// 窗口尺寸与大小
/*
可视区尺寸
clientWidth/clientHeight(client客户):这两个属性可以任何获取元素的可视宽高

// 文档本身没有宽高，只有文档下的文档元素才有宽高，这个没有兼容问题
document.documentElement.clientWidth
document.documentElement.clientHeight





滚动距离:Element.scrollTop 属性可以获取或设置一个元素的内容垂直滚动的像素数。
document.body.scrollTop/scrollLeft
document.documentElement.scrollTop/scrollLeft

内容高度
document.body.scrollHeight

文档高度
document.documentElement.offsetHeight
document.body.offsetHeight


// obj.onscroll事件:滚动条拉动时触发
// obj.onresize事件:窗口宽高发生变化的时候触发


 */




window.onload = function(){

	var wrap = document.getElementById('wrap');
	var left = document.getElementById('left');
	var right = document.getElementById('right');
	var de = document.getElementById('de');
	var bar = document.getElementById('bar');


	drag(bar,wrap,true,true,1,function(){
		var res = isBoom(bar,de);
		if( res ){
			bar.style.background = 'yellow';
		}else{
			bar.style.background = '';
		}
	});
	drag(de,wrap,true,true,1,function(){
		return isBoom(bar,de);
	});



}



/**
 * 获得元素滚动宽高，兼容所有浏览器
 * @param  {[元素]} ele [传入普通元素和window，window表示要获取文档的滚动高度]
 * @return {[对象]}     [返回一个对象，有两个属性，top和left]
 */
function scroll(ele){
	if(ele === window){
		return {
			top : document.documentElement.scrollTop || document.body.scrollTop,
			left : document.documentElement.scrollLeft || document.body.scrollLeft

		}
	}else{
		return {
			top : ele.scrollTop,
			left : ele.scrollLeft

		}
	}
}





/**
 * 可视区宽高，不包括任务栏滚动条，兼容所有浏览器
 * @param  {[元素]} ele [可传入普通元素和window，window表示要获取文档的可视区宽高]
 * @return {[对象]}     [返回一个对象，有两个属性,w和h]
 */
function client(ele){
	if(ele === window){
        // document.documentElement对于chrome、firefox、IE8都适用
		ele = document.documentElement;
	}
	return {
		w : ele.clientWidth,
		h : ele.clientHeight

	}
}





/**
 * 获得元素被内容撑开的宽高，如果没有被撑开则可视区的高(不包括滚动条和任务栏),兼容所有浏览器
 * @param  {[元素]} ele [可传入普通元素和window，window表示要获取文档被内容撑开的高度]
 * @return {[对象]}     [返回一个对象，有两个属性,w和h]
 */
function innerScroll(ele){

	if(ele === window){
		ele = document.body;
	}
	return {

		w : ele.scrollWidth,
		h : ele.scrollHeight

	}
}








/**
 *焦点：使浏览器能够区分用户输入的对象，当一个元素有焦点的时候，那么它就可以接收用户的输入
 *我们可以通过一些方式给元素设置焦点,不是所有元素都能接收焦点，能够响应用户操作的元素才有焦点
 *	1.点击
 *	2.tab键
 * 	3.通过js设置
 *
 *	onfocus:当元素获取焦点的时候触发
 *	onblur:当元素失去焦点的时候触发
 *
 * 	obj.focus()给指定的元素设置焦点
 * 	obj.blur()取消指定元素的焦点
 * 	obj.select()全选可输入的元素里面的文本内容
 *
 */





/**
 * 给input的text标签和textarea标签绑定onfocus事件和onblur事件
 * @param  {[标签元素]} ele      [input标签或textarea标签]
 * @param  {[字符串]} tdefault [用于提示]
 * @return {[无]}          [无返回值]
 */
function toggleFocus(ele,tdefault){

	// 判断第二个参数是否有值，没有就赋默认值
	var tdefault = tdefault || '请输入内容';

	// 只允许input的text标签和textarea标签使用
	if( ele.nodeName == 'INPUT' ){
		if( ele.getAttribute('type') != 'text' ){
			return false;
		}
	}else{
		if( ele.nodeName != 'TEXTAREA' ){
			return false;
		}
	}




	ele.style.color = '#999';

	var str = tdefault;
	ele.nodeName == 'INPUT' ? (ele.value=str) : (ele.value=str);

	var oriVal = str;
	var newVal = '';

	ele.onfocus = function(){

		ele.style.color = '';
		if( ele.value == oriVal ){
			this.value = '';
		}

	}

	ele.onblur = function(){

		if( ele.value == oriVal || ele.value == '' ){
			this.value = oriVal;
			ele.style.color = '#999';
		}

	}

}







/**
 * Event事件对象：当一个事件发生的时候，
 * 和当前这个对象发生的事件有关的一些详细的信息都会被临时保存到一个指定的地方——event对象，
 * 供我们需要的时候调用。飞机黑匣子
 *
 * 兼容
 * IE/chrome:event是一个内置的全局对象，初始化赋值是null或undefined
 * ff:事件对象是通过事件函数的第一个参数传入的
 * var ev = ev || event;
 *
 * 事件对象必须在一个事件调用的函数里面使用才有内容
 * 事件函数：事件调用的函数
 * 如果一个函数是被事件调用的，那么这个函数定义的第一个参数就是事件对象
 *
 *
 *
 * clientX/Y:当一个事件发生的时候鼠标相对于页面可视区顶部的距离
 *
 */



/**
 * 事件流
 * 事件冒泡:当一个元素接收到事件后，会把它接收到的所有事件传播给它的父级,一直到顶层window，就像力的传递
 * 阻止冒泡:
 * 	event.cancelBubble = true; 阻止当前对象的当前事件的冒泡
 *
 *
 *
 * 事件捕获：
 * 非标准IE:obj.attachEvent( 事件名称 , 事件函数 );
 * 		1.attachEvent方法无法实现捕获
 * 		2.事件名称有on
 * 		3.事件函数执行的顺序： 标准ie -> 正序		非标准ie -> 倒序
 * 		4.this指向window
 * 标准:obj.addEventListener( 没有on的事件名称 , 事件函数 , 是否捕获默认false[false冒泡,true捕获] );
 *
 *
 * 	事件取消绑定：
 * 	IE：obj.detachEvent(事件名称，事件函数)
 *  标准：obj.removeEventListener(事件名称，事件函数，是否捕获)
 *
 *
 * 键盘事件
 *
 * onkeydown:当键盘按键按下的时候触发，当按下不抬起，会连续触发
 * onkeyup:当键盘按键抬起的时候触发
 *
 * event.keyCode:数字类型 键盘按键的值 键值——不同键对应的是个ASCII码
 * 常用键值：
 * 		a:65  z:90
 * 		Tab:9
 * 		CapsLock:20
 * 		Shift:16
 * 		Ctrl:17
 * 		Alt:18
 * 		Enter:13
 * 		0:48   9:57
 * 		左:37  上:38   右:39    下:40
 * ctrlKey,shiftKey,altKey 这是event对象内置的属性，返回值是布尔值。
 * 当一个事件(事件，任何事件)发生的时候，如果ctrl || shift || alt 是按下的状态，返回true，否则返回false
 *
 *
 *
 *
 * 事件默认行为：当一个事件发生的时候浏览器自己会默认做的事情
 * 阻止，在事件处理函数里使用return false;
 * IE:e.returnValue = false;
 * 标准:e.preventDefault();
 *
 * 环境菜单：oncontextmenu：当环境菜单显示出来的时候触发
 *
 *
 */




/**
 * 给元素绑定事件，为冒泡形式
 * @param  {[元素]}   ele       [给那个元素绑定事件]
 * @param  {[事件名]}   eventName [不带on的事件名]
 * @param  {事件函数} fn        [要绑定的事件函数]
 * @param  {是否阻止冒泡} bubble        [false表示不阻止，true表示阻止]
 * @return {[bool]}             [如果事件名不合法返回false]
 */
function on(ele,eventName,fn,bubble){

	// 判断传进来的事件名称合不合法
	var availEvent = 'click,mousedown,mouseup,mousemove,mouseover,scroll,resize,keydown,keyup';
	var re = new RegExp(eventName);

	if( availEvent.search(re) == -1 ){
		return false;
	}


	// 获得传入函数的函数名,做个备份
	var fnName = getFnName(fn);

	if(!ele.callback){
		ele.callback = {};
	}
	if( ele.addEventListener ){

		ele.callback[fnName] = function(e){
			var e = e || event;
			fn.call(ele);
			if( bubble ){
				e.stopPropagation();
			}
		};

		ele.addEventListener(eventName,ele.callback[fnName],false);

	}else{

		ele.callback[fnName] = function(e){
			var e = e || event;
			fn.call(ele);
			if( bubble ){
				e.cancelBubble = true;
			}
		};

		ele.attachEvent('on'+eventName , ele.callback[fnName] );

	}

}






/**
 * 取消元素某个事件绑定的函数,由于IE7不支持trim，所以这个方法在IE7失效
 * @param  {[元素]}   ele       [之前用on绑定过函数的元素]
 * @param  {[事件名]}   eventName [之前用on绑定过的事件名]
 * @param  {Function} fn        [事件函数，必须引用相同]
 * @return {[bool]}             [当事件名不合法的时候返回false]
 */
function off(ele,eventName,fn){

	// 判断传进来的事件名称合不合法
	var availEvent = 'click,mousedown,mouseup,mousemove,mouseover,scroll,resize';
	var re = new RegExp(eventName);

	if( availEvent.search(re) == -1 ){
		return false;
	}

	var fnName = getFnName(fn);

	fn = ele.callback[fnName];
	if( ele.removeEventListener ){

		ele.removeEventListener(eventName,fn,false);

	}else{

		ele.detachEvent('on'+eventName,fn);

	}

	delete ele.callback[fnName];

}









/**
 * 获得计算后的css属性值,透明度不兼容IE7，但考虑到设定CSS的时候会两种写法都会写所以透明度问题就靠写css解决
 * @param  {[元素]} obj   [元素]
 * @param  {[字符串]} attr  [驼峰式属性名]
 * @param  {[布尔值]} units [是否带单位，true为带单位，false为不带单位，当计算值不是数字类型此参数无效]
 * @return {[混合]}       [返回对应的css值]
 */
function getStyle( obj,attr ){


	var outCome = obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj)[attr];

	if( parseFloat(outCome) || parseFloat(outCome) == 0 ){
		outCome = parseFloat(outCome);
	}

	// return {
	// 	key:attr,
	// 	val:outCome
	// };

    return outCome;
}







/**
 * 获取元素距离窗口顶部的距离，无视嵌套;计算元素的宽高，包括外边框，兼容所有浏览器
 * @param  {[元素]} ele [元素]
 * @param  {[元素]} tParent [父级元素,如果有就只计算到这个父级元素为止]
 * @return {[对象]}     [对象包含两个属性，top和left]
 */
function offset(ele,tParent){

	if(ele === window){
		/*IE7不支持document.documentElement.offsetHeight，所以取而代之去获取body的高，
		但body的margin获取不到(offsetHeight只获取到外边框为止),但开发过程中body的margin一般都会去掉*/
		// offsetHeight 和 scrollHeight的区别，前者是包括边框，后者不包括边框计算被撑开的值
		ele = document.body
	}

	var parent = ele,
		top = ele.offsetTop,
		left = ele.offsetLeft,
		w = ele.offsetWidth,
		h = ele.offsetHeight;

	while( (parent = parent.offsetParent) && parent.nodeName != 'BODY' && parent != tParent ){

		top += (parent.offsetTop + getStyle(parent,'borderTopWidth').val);
		left += (parent.offsetLeft + getStyle(parent,'borderLeftWidth').val);

	}


	return {
		w:w,
		h:h,
		top:top,
		left:left
	}

}












/**
 * 碰撞检测——九宫格排除法
 * @param  {[元素]}  obj1 [元素]
 * @param  {[元素]}  obj2 [元素]
 * @return {Boolean}      [碰上了返回true，没碰上返回false]
 */
function isBoom( obj1 , obj2 ){

	// 获取obj1的左边到窗口左边的距离，右边到窗口右边的距离，上边到窗口上边的距离，下边到窗口下边的距离
	var L11 = offset(obj1).left,
		R11 = L11 + obj1.offsetWidth,
		T11 = offset(obj1).top,
		B11 = T11 + obj1.offsetHeight;


	// 获取obj2的左边到窗口左边的距离，右边到窗口右边的距离，上边到窗口上边的距离，下边到窗口下边的距离
	var L22 = offset(obj2).left,
		R22 = L22 + obj2.offsetWidth,
		T22 = offset(obj2).top,
		B22 = T22 + obj2.offsetHeight;


	if( ( L11 < R22 && R11 > L22 ) && ( T11 < B22 && B11 > T22 ) ){
		return true;
	}else{
		return false;
	}

}












/**
 * 拖动元素
 * @param  {[元素]} ele      [要拖动的元素]
 * @param  {[元素的父级]} parent   [必须传入，拖动的位置依据这个父级计算]
 * @param  {[布尔值]} slopOver [是否禁止出界，true表示禁止，false或不传参表示不禁止]
 * @param  {[布尔值]} magnet   [是否模拟磁吸效果，true表示是，false表示不模拟]
 * @param  {[数值]} zIndex   [层级，默认是1]
 * @param  {[函数]} callback   [元素移动时候的回调函数]
 * @return {[布尔值]}          [当没有传第二个参数的时候返回false]
 */
function drag(ele,parent,slopOver,magnet,zIndex,callback){

	// 判断是否有祖先元素，且是否合法
	if(!parent) return false;
	if(!isParent(ele,parent)) throw '第二个参数不是第一个参数的祖先元素';


	// 给对应元素加定位属性
	if( getStyle(ele.parentNode,'position').val == 'static' ){
		parent.style.position = 'relative';
	}
	if( getStyle(ele.parentNode,'position').val == 'static' ){
		ele.parentNode.style.position = 'relative';
	}
	// 给拖动的元素默认绝对定位
	ele.style.position = 'absolute';

	// 层级默认为1
	var zIndex = zIndex || 1;
	ele.style.zIndex = zIndex;



	ele.onmousedown = function(e){
		var e = e || event;
		var disL = e.clientX-offset(ele).left
		var disT = e.clientY-offset(ele).top;
		var scrT = scroll(window).top;
		var scrL = scroll(window).left;

		document.onmousemove = function(e){


			var e = e || event;

			// 如果ele的父级元素不是parent则需要进行位置校准(因为被拖动元素相对于它的父级定位)
			var adjustLeft = 0,
				adjustTop = 0;
			if( ele.parentNode != parent ){

				adjustLeft = offset(ele.parentNode,parent).left + getStyle(ele.parentNode,'borderLeftWidth').val;
				adjustTop = offset(ele.parentNode,parent).top + getStyle(ele.parentNode,'borderTopWidth').val;

			}


			var L = e.clientX - offset(parent).left - disL - adjustLeft;
			var T = e.clientY - offset(parent).top - disT - adjustTop;



			// 是否限制在父级内
			if( slopOver ){

				var i = 0;
				// 是否模拟磁吸效果
				if( magnet ){
					var i = 30;
				}

				// 越界判断
				if( L<0+i-adjustLeft ){
					L=0-adjustLeft;
				}
				if( T<0+i-adjustTop ){
					T=0-adjustTop;
				}

				if( L>client(parent).w-offset(ele).w-i-adjustLeft ){
					L=client(parent).w-offset(ele).w-adjustLeft;
				}
				if( T>client(parent).h-offset(ele).h-i-adjustTop ){
					T=client(parent).h-offset(ele).h-adjustTop;
				}

			}

			ele.style.left = L + 'px';
			ele.style.top = T + 'px';


			// 回调函数执行
			callback && callback();
		}

		document.onmouseup = function(){
			document.onmousemove = document.onmouseup = null;
		};


		// 阻止默认行为
		preventDefalut(e);

	}

}


















/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *	留空作运动方法
 *
 *
 * 	一、弹性公式：
 *
 *	弹性:
 *	速度 += (目标点 - 当前值)/系数;  //6 , 7 , 8
 *	速度 *= 摩擦系数;   // 0.7 0.75
 *
 *	缓冲:
 *	var 速度 = (目标点 - 当前值)/系数;
 *	速度取整
 *
 * 	系数小于1
 *
 *
 * 	二、弹性过界问题
 *  主要体现在IE低版本上，IE8的宽高不允许负值，所以在写弹性功能的时候要判断一下，宽高为小于0则等于0
 *
 *
 *
 *
 *
 */


function startMove(obj){

	this.obj = obj;

}
startMove.prototype = {


	do:function(){

		// js数组的slice方法可以用来用于数组和类数组的对象，arguments是个类数组的对象
		var args = Array.prototype.slice.call(arguments);
		var initDelay = 400;
		args.forEach(function(item,i){

			var methodName = item.mode;
			var json = {};
			var delay = item.delay || initDelay*i;
			var fn = item.succeed || null;
			var _this = this;

			for(var attr in item){
				if( attr == 'mode' || attr == 'succeed' ){
					continue;
				}
				json[attr] = item[attr];
			}


			setTimeout(function(){
				_this[methodName](json,fn);
			},delay);


		},this);

	},


	normal:function(json,fn,delay){

		clearInterval(this.obj.iTimer);

		var iSpeed = 0;
		var iCur = 0;
		var _this = this;
		var delay = delay || 0;

		this.obj.iTimer = setInterval(function() {

			var tBtn = true;	// 用来判断所有属性是否都运动完成

			// 用for in循环来实现同时运动多项属性的功能，定时器每走一下就要把所有要运动的属性都推进一次
			for( var attr in json ){

				var iTarget = json[attr];

				/*
					这里处理一下运动属性的值，
						若是透明度最后处理成百分制来运算避免出现精度问题，
						若是宽高，left、top值这些就要去掉单位，因为currentStyle和getComputedStyle都是返回带单位的值
					**仅仅是对这两项进行判断就足以满足大部分2D运动了
				*/
				if( attr == 'opacity' ){

					if( !getStyle( _this.obj , 'opacity' ).val ){
						_this.obj.style[attr] = 1;
						// _this.obj.style.filter = 'alpha(opacity = 100)';
					}

					iCur = Math.round( getStyle( _this.obj , 'opacity' ).val * 100 );
				}else{
					iCur = parseInt( getStyle(_this.obj,attr).val );
				}


				// 动态计算速度值:取一部分当前元素距离终点的距离值作为速度，实现缓冲的效果
				iSpeed = ( iTarget - iCur ) / 8;
				iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);


				/*
					iCur表示当前的距离值，cur:current当前的意思
					如果当前属性还未到达终点则继续执行“累加”的动作，并且tBtn设为false
					如果当前属性到达终点则，则无动作tBtn为true
				*/
				if (iCur != iTarget) {
					tBtn = false;

					if( attr == 'opacity' ){
						_this.obj.style.opacity = (iCur + iSpeed) / 100;
						_this.obj.style.filter = 'alpha(opacity='+ (iCur+iSpeed) +')';
					}else{
						_this.obj.style[attr] = iCur + iSpeed + 'px';
					}

				}

			}


			/*
				若所有属性都到达终点，则上面的if判断不会通过，表示可以结束定时器了，同时判断是否有回调函数
				通过回调函数实现“链式运动”的效果
			*/
			if( tBtn ){
				clearInterval( _this.obj.iTimer );

				if( fn ){
					setTimeout(function(){
						fn.call(_this.obj);
					},delay);
				}

			}


		}, 30);

	},


	elastic:function(json,fn,delay){

		var iSpeed = 0;
		var _this = this;
		var delay = delay || 0;

		this.obj.timer = setInterval(function(){
			for( var attr in json ){

				var iTarget = json[attr];

				var argu = attr;
				var objArguVal = null;

				if( attr == 'left' ){
					objArguVal = _this.obj.offsetLeft;
				}else if( attr = 'top' ){
					objArguVal = _this.obj.offsetTop;
				}


				iSpeed += ( iTarget - objArguVal ) / 6;
				iSpeed *= 0.75;


				if( Math.abs(iTarget - objArguVal) <= 1 && Math.abs(iSpeed) <= 1 ){

					clearInterval(_this.obj.timer);
					_this.obj.style[attr] = iTarget + 'px';
					iSpeed = 0;
					if(fn){

						setTimeout(function(){
							fn();
						},delay);

					}


				}else{
					_this.obj.style[attr] = objArguVal + iSpeed + 'px';
				}

			}


		},30);




	}


}




/**
 *
 *	时间版运动留白
 *
 *	定时器在浏览器中的问题，浏览器为了优化性能，在用户不看某个页面的时候那个页面的定时器会被延迟的非常缓慢
 * 	解决：
 * 		当页面被缩小或被切换的时候可以停掉定时器，切换回来的时候再开启定时器
 * 		用到的方法:
 * 			速度版运动解决方法：
 * 			window.onfocus 和  window.onblur
 *    		时间版运动解决方法：
 *    		什么都不用做，因为时间版运动的位置计算是速度乘以时间计算的，而时间是本地时间，本地时间不会受浏览器影响
 *
 *
 *
 *
 *
 *
 *
 */
