
//工具库
;(function(window, document){
	var Util = {
		//getElementById
		getId: function(id){
			return (typeof id == "object") ? id : document.getElementById(id);
		},

		//querySelector
		getElem: function(cls){
			return document.querySelector(cls);
		},

		//querySelectorAll
		getElems: function(cls){
			return document.querySelectorAll(cls);
		},

		//getElementsByTagName
		getTagName: function(tag){
			return document.getElementsByTagName(tag);
		},

		//getElementByclass
		getClass: function(cls, parent){
			var temps = [];
			var node = (parent != undefined) ? parent : document;
			var all = node.getElementsByTagName('*');

			for(var i = 0, len = all.length; i < len; i ++){
				if((new RegExp('(\\s|^)' + cls +'(\\s|$)')).test(all[i].className)) {
					temps.push(all[i]);
				}
			}
			return temps;
		},

		//判断class是否存在
		hasCls: function(ele, cls){
			return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
		},

		//添加class
		addCls: function(ele, cls){
			ele.classList ? ele.classList.add(cls) : !this.hasCls(ele, cls) && (ele.className += (!ele.className ? '' : ' ') + cls);
		},

		//删除class
		rmCls: function(ele, cls){
			ele.classList ? ele.classList.remove(cls) : this.hasCls(ele, cls) && (ele.className = ele.className.replace(new RegExp('(\\s|^)' + cls + '(\\s|$)'), ''));
		},

		//跨浏览器获取style
		getStyle: function(ele, attr){
			if(!ele) { return; }

			var val;
			if(typeof window.getComputedStyle != 'undefined') { //W3C
				val = window.getComputedStyle(ele, null)[attr];
			} else if(typeof ele.currentStyle != 'undefined') { //IE
				val = ele.currentStyle[attr];
			}

			return val;
		},

		//跨浏览器获取视口大小
		getInner: function() {
			if(typeof window.innerWidth != 'undefined'){
				return {
					width: window.innerWidth,
					height: window.innerHeight
				}
			}else {
				return {
					width: document.documentElement.innerWidth,
					height: document.documentElement.innerHeight	
				}
			}
		},

		//跨浏览器获取滚动条位置
		getScroll: function(){
			return {
				top: document.documentElement.scrollTop || document.body.scrollTop,
				left: document.documentElement.scrollLeft || document.body.scrollLeft,
			}
		},

		//获取某一个元素到最外层顶点的位置
		getOffsetTop: function(ele){
			var top = ele.offsetTop;
			var parent = ele.offsetParent;

			while (parent != null) {
				top += parent.offsetTop;
				parent = parent.offsetParent;
			}

			return top;
		},

		//跨浏览器获取innerText
		getInnerText: function(ele) {
			return (typeof ele.textContent == 'string') ? ele.textContent : ele.innerText;
		},

		//跨浏览器设置innerText
		setInnerText: function(ele, text) {
			if(typeof element.textContent == 'string') {
				ele.textContent = text;
			}else {
				ele.innerText = text;
			}
		},

		//删除前后空格
		trim: function(str){
			return str.replace(/(^\s*)|(\s*$)/g, '');
		},

		//某一个值是否存在某一个数组中
		isInArray: function(array, value){
			for(var i in array) {
				if(array[i] === value) { return true; }
			}

			return false;
		},

		//判断是否为数组
		isArray: function(arr){
			return arr && typeof arr ==='object' && Array == arr.constructor;
		},

		//获取一组数的随机数
		random: function(arr){
			return this.isArray(arr) && arr[Math.floor(Math.random() * arr.length)];
		},

		//阻止默认行为
		predef: function(e){
			e.preventDefault && e.preventDefault();
		},

		//阻止默认行为
		stopPro: function(e){
			e.stopPropagation && e.stopPropagation();
		},

		//获取事件目标
		getTarget: function(e){
			var e = e || window.event;
			return e.target || e.srcElement;
		},

		//添加事件
		addEvent : function(ele, type, handler){
			if(!ele) { return; }

			if(ele.addEventListener) {
				return ele.addEventListener(type, handler, false);
			}else if(ele.attachEvent){
				return ele.attachEvent('on' + type, handler);
			}else {
				ele['on' + type] = hander;
			}
		},

		//删除事件
		removeEvent: function(ele, type, handler){
			if(!ele) { return; }

			if(ele.removeEventListener) {
				return ele.removeEventListener(type, handler, false);
			}else if(ele.detachEvent) {
				return ele.detachEvent('on' + type, handler);
			}else {
				ele['on' + type] = null;
			}
		},

		/**
		 * 创建cookie
		 * @param {object} opts {name: 名, value: 值, expires: 有效期, path: path, domain: domain, secure: secure}
		 */
		setCookie: function(opts) {
			var name = opts.name, value = opts.value, expires = opts.expires, path = opts.path, domain = opts.domain, secure = opts.secure;
			var cookieText = encodeURIComponent(name) + '=' + encodeURIComponent(value);

			(expires instanceof Date) && (cookieText != '; expires=' + expires);
			path && (cookieText += '; path=' + path);
			domain && (cookieText += '; domain=' + domain);
			secure && (cookieText += '; secure=' + secure);

			document.cookie = cookieText;
		},

		//读取cookie
		getCookie: function(name){
			var cookieName = encodeURIComponent(name) + '=';
			var cookieStart = document.cookie.indexOf(cookieName);
			var cookieValue = null;
			if(cookieStart > -1) {
				var cookieEnd = document.cookie.indexOf(';' ,cookieStart);
				if(cookieStart == -1){
					cookieEnd = document.cookie.length;
				}

				cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
			}
			return cookieValue;
		},

		//删除cookie
		delCookie: function(name){
			document.cookie = name + '= ; expires=' + new Date(0);
		},

		/**
		 * 获取url参数
		 * @param  {string} url  url地址
		 * @param  {string} name 参数名称
		 * @param  {string} type 分隔符号，默认 ?
		 * @return {string}      获取到的参数
		 */
		getParam(url, name, type){
			if(!url || !name) { return; }

			var type = (type == null) ? '?' : type;
			var name = name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]');
			var regex = new RegExp('[\\'+ type +'&]' + name + '=([^&#]*)');
			var results = regex.exec(url);

        	return (null == results ? null : results[1]);
		},

		//图片替换
		replaceSrc: function(obj, src) {
			if (!obj || 'object' != typeof obj) return;

			var imgArr = obj.getElementsByTagName('img');
			if(!imgArr){return;}
			for (var i = 0; i < imgArr.length; i++) {
				var oimg = imgArr[i];
				var lazySrc = oimg.getAttribute(src);
				if (!lazySrc) break;
				oimg.src = lazySrc;
				oimg.removeAttribute(src);
			}
		},

		//函数节流（throttle）
		throttle: function(fn, threshhold, scope) {
			threshhold || (threshhold = 250);
			var last, timer;
			return function() {
				var context = scope || this;
				var now = +new Date(),
					args = arguments;

				if (last && now - last + threshhold < 0) {
					clearTimeout(deferTimer);
					timer = setTimeout(function() {
						last = now;
						fn.apply(context, args);
					}, threshhold);
				} else {
					last = now;
					fn.apply(context, args);
				}
			}
		},

		//函数去抖
		debounce: function(fn, delay){
			var timer = null;
			return function(){
				var context = this, args = arguments;
				clearTimeout(timer);
				timer = setTimeout(function(){
					fn.apply(context, args);
				}, delay)
			}
		},

		placeholderSuport: function() {
		   return "placeholder" in document.createElement("input")
		}

		//功能扩展
		extend: function(destination, source, override, replacer) {
			if (override === undefined) override = true;
			for (var property in source) {
				if (override || !(property in destination)) {
					if (replacer) replacer(property);
					else destination[property] = source[property];
				}
			}
			return destination;
		}
	}

	window.Util = Util;
}(window, document));

//待续...