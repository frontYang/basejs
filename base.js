/**
 * 基础库:常用事件封装
 * @authors frontYang
 * @date    2016-10-08
 *
 * 可以链式调用
 * 获取元素与jq类似
 * 
 * //扩展
	$$().extendBase('', function () {

	});
 */

/*Base S*/
//前台调用
var $$ = function (args) {
	return new Base(args);
}

//基础库
function Base(args){
	//创建一个数组，来保存获取的节点和节点数组
	this.elements = [];
	
	if (typeof args == 'string') {
		//css模拟
		if (args.indexOf(' ') != -1) {
			var elements = args.split(' ');			//把节点拆开分别保存到数组里
			var childElements = [];					//存放临时节点对象的数组，解决被覆盖的问题
			var node = [];								//用来存放父节点用的
			for (var i = 0, len = elements.length; i < len; i ++) {
				if (node.length == 0) node.push(document);		//如果默认没有父节点，就把document放入
				switch (elements[i].charAt(0)) {
					case '#' :
						childElements = [];				//清理掉临时节点，以便父节点失效，子节点有效
						childElements.push(this.getId(elements[i].substring(1)));
						node = childElements;		//保存父节点，因为childElements要清理，所以需要创建node数组
						break;
					case '.' : 
						childElements = [];
						for (var j = 0, len = node.length; j < len; j ++) {
							var temps = this.querySelect(elements[i]);
							for (var k = 0; k < temps.length; k ++) {
								childElements.push(temps[k]);
							}
						}
						node = childElements;
						break;
					default : 
						childElements = [];
						for (var j = 0, len = node.length; j < len; j ++) {
							var temps = this.getTagName(elements[i], node[j]);
							for (var k = 0; k < temps.length; k ++) {
								childElements.push(temps[k]);
							}
						}
						node = childElements;
				}
			}
			this.elements = childElements;
		} else {
			//find模拟
			switch (args.charAt(0)) {
				case '#' :
					this.elements.push(this.getId(args.substring(1)));
					break;
				case '.' : 
					this.elements = this.querySelect(args);
					break;
				default : 
					this.elements = this.getTagName(args);
			}
		}
	} else if (typeof args == 'object') {
		if (args != undefined) {    //_this是一个对象，undefined也是一个对象，区别与typeof返回的带单引号的'undefined'
			this.elements[0] = args;
		}
	} else if (typeof args == 'function') {
		// this.readyDom(args);
		document.addEventListener("load",args);
	}
}

Base.prototype = {

	//获取id节点
	getId: function(id){
		return (typeof id == "object") ? id : document.getElementById(id);
	},

	//获取class节点
	getClass: function (cls, parent) {
		var node = null;
		var temps = [];
		if (parent != undefined) {
			node = parent;
		} else {
			node = document;
		}
		var all = node.getElementsByTagName('*');
		for (var i = 0; i < all.length; i ++) {
			if ((new RegExp('(\\s|^)' +className +'(\\s|$)')).test(all[i].className)) {
				temps.push(all[i]);
			}
		}
		return temps;
	},

	//获取元素节点
	getTagName: function (tag, parent) {
		var node = null;
		var temps = [];
		if (parent != undefined) {
			node = parent;
		} else {
			node = document;
		}
		var tags = node.getElementsByTagName(tag);
		for (var i = 0; i < tags.length; i ++) {
			temps.push(tags[i]);
		}
		return temps;
	},

	//javascript高级选择器
	querySelect: function(el){
		return document.querySelectorAll(el);
	},

	//获取首个节点
	firstNode: function(){
		return this.elements[0];
	},

	//获取最后一个节点
	lastNode: function(){
		return this.elements[this.elements.length - 1];
	},

	//获取指定索引的节点
	geNode: function(num){
		return this.elements[num];
	},

	//获取元素长度
	len: function(){
		return this.elements.length;
	},

	//元素属性操作
	getAttr: function(attr, value){
		for (var i = 0, len = this.elements.length; i < len; i ++) {
			if (arguments.length == 1) {
				return this.elements[i].getAttribute(attr);
			} else if (arguments.length == 2) {
				this.elements[i].setAttribute(attr, value);
			}
		}
		return this;
	},

	//获取节点所在的索引
	getIndex: function(){
		var children = this.elements[0].parentNode.children;
		for (var i = 0, len = children.length; i < len; i ++) {
			if (this.elements[0] == children[i]) return i;
		}
	},

	//获取事件目标
	getTarget: function(e){
		var e = e || window.event;
    	return e.target || e.srcElement;
	},

	//判断是否存在对应class
	hasCls: function(el, cls){	
		return el.classList && el.classList.contains(cls) || !!el.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
	},

	//添加class
	addCls: function(cls){			
		for(var i = 0, len = this.elements.length; i < len; i++){			
			this.elements[i].classList ? this.elements[i].classList.add(cls) : !hasCls(this.elements[i], cls) && (this.elements[i].className += (!this.elements[i].className ? '' : ' ') + cls);
		}
		return this;
	},

	//移除class
	rmCls: function(cls){			
		for(var i = 0, len = this.elements.length; i < len; i++){
			this.elements[i].classList ? this.elements[i].classList.remove(cls) : hasCls(this.elements[i], cls) && (this.elements[i].className = this.elements[i].className.replace(new RegExp('(\\s|^)' + cls + '(\\s|$)'), ''));
		}
		return this;
	},

	//隐藏
	hideObj: function(){		
		for(var i = 0, len = this.elements.length; i < len; i++){
			this.elements[i].style.display = "none";
		}
		return this;
	},

	//显示
	showObj: function(){
		for(var i = 0, len = this.elements.length; i < len; i++){
			this.elements[i].style.display = "block";
		}
		return this;
	},

	//事件添加
	addEvent: function(type, fn){
		for(var i = 0, len = this.elements.length; i < len; i++){
			this.elements[i].addEventListener(type,fn);
		}
		return this;
	},

	//阻止页面滑动
	preventDef: function(el){		
		el && el.addEventListener('touchmove', function(e) {		
            e.preventDefault();
        });
        return this;
	},

	//去掉空格
	trimStr: function(str){
		return str.replace(/(^\s*)|(\s*$)/g,"");
	}
};

//插件入口
Base.prototype.extendBase = function (name, fn) {
	Base.prototype[name] = fn;
};
/*Base E*/
