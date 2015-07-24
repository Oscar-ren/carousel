var carouselComponent = function() {


	var len = document.getElementsByTagName('img').length,
			lis = convertArray(document.getElementsByTagName('li')),
			carContain = getId('carousel-inner'),
			num = 0;



	/**
	 * 私有函数
	 */
	function getId(name) {
		return document.getElementById(name);
	}

	/**
	 * 兼容转换类数组
	 */
	function convertArray(nodes) {
		var array = null;
		try {
			array = Array.prototype.slice.call(nodes, 0);
		} catch (ex) {
			array = [];
			for(var i = 0; i < nodes.length; i++) {
				array.push(nodes[i]);
			}
		}
		return array;
	}

	/**
	 * 兼容ie9以下，重写forEach方法
	 */
	if(typeof Array.prototype.forEach !== 'function') {
		Array.prototype.forEach = function(fn, context) {
			for(var k = 0, len = this.length; k < len; k++) {
				if(typeof fn === 'function' && Object.prototype.hasOwnProperty.call(this, k)) {
					fn.call(context, this[k], k, this);
				}
			}
		};
	}

	/**
	 * 设置css样式
	 */
	function setLiCss(num) {
		convertArray(document.getElementsByTagName('li')).forEach(function(item, index, array) {
			item.className = '';
		});
		document.getElementsByTagName('li')[num].className = 'active';
	}

	function setCarouselCss(elem, pos, direct) {
		elem.style[direct] = pos + 'px';
	}


	return {

		//参数 obj { vertical : true or false, delay : number}
		//vartical 代表滚动方向，true为垂直滚动，delay设置滚动时间
		init : function(obj) {

			var self = this,
					obj = obj || {},
					delay = obj.delay || 2000;

			 /**
			 * 判断水平垂直划动，默认水平移动
			 */
			if(obj.vertical) {
				this.picSize = document.getElementsByTagName('img')[0].offsetHeight;
				this.cssDirect = 'top';
				carContain.className = '';
			}else {
				this.picSize = document.getElementsByTagName('img')[0].offsetWidth;
				this.cssDirect = 'left';
				carContain.className = 'w2000';
			}

			var picSize = this.picSize,
					cssDirect = this.cssDirect;


			/**
			 * 如果连续执行初始化操作，图片归位重新滚动
			 */
			if(this.intval) {
				clearInterval(this.intval);
				getId('carousel-inner').style.top = '0px';
				getId('carousel-inner').style.left = '0px';
				setLiCss(0);
			}
 
			/**
			 * 轮播开始
			 */
			this.intval = setInterval(function() {
				if(carContain.offsetTop === 0 && carContain.offsetLeft === 0 ){
					num = 0;
					self.move(picSize, cssDirect);
				}else {
					self.move(picSize, cssDirect);
				}
				// setTimeout(arguments.callee, delay);
			}, delay);

			/**
			 * 给li按钮添加点击事件
			 */
			lis.forEach(function(item, index, array) {
				item.onclick = function() {
					self.move(picSize, cssDirect, index);
					num = index;
				}
			});


			/**
			 * 鼠标事件
			 */
			getId("carousel").onmouseover = function() {
				clearTimeout(self.intval);
			};

			getId("carousel").onmouseout = function() {
				self.intval = setInterval(function() {
					if(carContain.offsetTop === 0 && carContain.offsetLeft === 0 ){
						num = 0;
						self.move(picSize, cssDirect);
					}else {
						self.move(picSize, cssDirect);
					}
					// setTimeout(arguments.callee, delay);
				}, delay);
			};

			/**
			 * 向前向后按钮
			 * move 函数显示的图片为下一张
			 * 所以上一张的索引是 num - 2
			 */
			getId("prev").onclick = function() {
				num = num -2;
				if(num < 0) {
					num = len + num;
				}
				self.move(picSize, cssDirect);
			};

			getId("next").onclick = function() {
				self.move(picSize, cssDirect);		
			};

			

		},

		/**
		 * 动画
		 */
		move : function(picSize, cssDirect, targetIndex) {

			if(num > len - 1) {
				num = 0;
			}else if(num < 0) {
				num = len - 1;
			}

			/**
			 * 得到目标图片索引
			 */
			if(typeof targetIndex !== 'number') {
				if(num === len - 1) {
					targetIndex = 0;
				}else {
					targetIndex = num + 1;
				}
			}else {
				if(num === targetIndex) {
					return;
				}
			}

			var timing = 40,
					distance = (num - targetIndex) * picSize,
					speed = distance / timing,
					currSize = num * -picSize;

			/**
			 * 根据不同的除css样式（top || left）改变图片位置
			 */
			for(var i = 0; i <= 40; i++) {
				(function() {
					var targetSize = currSize + i * speed;
					setTimeout(function() {

						//设置图片容器的 top、left
						setCarouselCss(carContain, targetSize, cssDirect);
					}, i * 5);
				})(i);
			}

			//设置 li 样式
			setLiCss(targetIndex);

			//准备下一张
			num++;

		},

		setPage : function(pageNum) {
			//var bar = this.init();
			this.move(this.picSize, this.cssDirect, pageNum - 1);
			num = pageNum - 1;
		}

	}//return


}();
