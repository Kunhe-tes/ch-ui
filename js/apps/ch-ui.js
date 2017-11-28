/****************************************
 Copyright (c) 2017 HD and HK
 http://blog.csdn.net/darinzanya
 https://git.oschina.net/darinhk

 ch-ui.js 1.0 buint in 2017.4.6
 support IE9+ and other browers
 *****************************************/

/* 下拉菜单
 * @class
 * @param {json} options   容器和下拉菜单内容
 * @author by HK
 * */
+function($){
    function SplitBtn(rootElement,options){
        this.configs = options;
        this.elements = {};
        this.elements.rootElement = rootElement;
        this.elements.container = $("<div class='ch-ui-dropdown'></div>");
        this._isShown = false;
        if(!this.init) {
            SplitBtn.prototype.init = function(){
                var that = this;
                that.elements.btn = that.createBtn();
                that.elements.btnText = that.elements.btn.find('.ch-ui-dropdown-btntxt');
                that.elements.menu = that.createMenu();
                for(var i=0,len=that.configs.text.length;i<len;i++) {
                    var $li = that.createLi();
                    $li.html(that.configs.text[i]);
                    that.elements.menu.append($li);
                }
                that.elements.container.append(that.elements.btn);
                that.elements.container.append(that.elements.menu);
                that.elements.rootElement.append(that.elements.container);
                //
                that.elements.menu.on("mousedown","li",function(){
                    var btnTxt = that.elements.btnText;
                    var target = event.target;
                    btnTxt.html(target.innerHTML);
                    that.elements.rootElement.trigger("itemChanged",target.innerHTML);//修改了时间名称
                });
                //
                that.elements.btn.on("click",function(){
                    if(that._isShown){
                        that.hide();
                    }else{
                        that.show();
                    }
                });
                that.elements.btn.on("blur",function () {
                    that.hide();
                });
            };
            SplitBtn.prototype.createBtn = function(){
                var btn = $("<button class='ch-ui-dropdown-btn btn-blue' tabIndex='-1'></button>");
                btn.html('<p class="ch-ui-dropdown-btntxt">'+this.configs.text[0]+'</p><p class="ch-ui-dropdown-btnsel"></p>');
                return btn;
            };
            SplitBtn.prototype.createMenu = function(){
                var menu = $("<ul></ul>");
                menu.addClass('ch-ui-dropdown-menu');
                menu.hide();
                return menu;
            };
            SplitBtn.prototype.createLi = function() {
                var $li = $("<li class='ch-ui-dropdown-li'></li>");
                return $li;
            };
            //点击隐藏/显示下拉菜单
            SplitBtn.prototype.show = function () {
                this.elements.menu.slideDown(150);
                this._isShown = true;
            };
            SplitBtn.prototype.hide = function () {
                this.elements.menu.slideUp(150);
                this._isShown = false;
            };
        }
        this.init();
    }

    function plugin(options) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data("ch-ui-dropdown");
            if(data) return;
            $this.data("ch-ui-dropdown",(data = new SplitBtn($this,options)));
        });
    }
    //jQuery扩展
    var old = $.fn.dropdown;
    $.fn.dropdown = plugin;
    $.fn.dropdown.noConflict = function () {
        $.fn.dropdown = old;
        return this;
    }
}(jQuery);

/* 提示框
 * @class
 * @param {json} direction    提示框方向和内容等
 * @author by HK
 * */
+function($){
    function ToolTip(rootElement,options){
        this.name = rootElement;
        this.direct = options.direct;
        this.cont = options.content;
        this.template = "<div class='ch-ui-tooltip'><div class='ch-ui-tooltip-arrow'>" +
            "</div><div class='ch-ui-tooltip-inner'>"+this.cont+"</div></div>";
        if(!this.init){
            /* 初始化属性 */
            ToolTip.prototype.init = function(){
                this.aimProp = this.getAimProperty();
                /*this.aimPosition = this.getAimPosition();*/
                this.tip = $(this.template);
                this.isShown = true;
            };
            /* 获取目标元素宽高 */
            ToolTip.prototype.getAimProperty = function(){
                var aimWidth = parseInt(this.name.width()),
                    aimHeight = parseInt(this.name.height());
                return {"width":aimWidth,"height":aimHeight};
            };
            /* 获取目标元素位置 */
            ToolTip.prototype.getAimPosition = function(){
                this.aimTop = this.name.offset().top;
                this.aimLeft = this.name.offset().left;
                var aimTop = this.name.offset().top,
                    aimLeft = this.name.offset().left;
                return {"left":aimLeft,"top":aimTop};
            };
        }
        this.init();
    }
    /* 获取提示框属性 */
    ToolTip.prototype.getTipProperty = function(){
        $("body").append(this.tip);
        var tipHeight = parseInt(this.tip.height());
        var tipWidth = parseInt(this.tip.width());
        var tipMargin = 6;
        return {"width":tipWidth,"height":tipHeight,"margin":tipMargin};
    };
    /* 计算提示框位置 */
    ToolTip.prototype.getTipPosition = function(direct){
        var marginLeft = 0;
        this.getAimPosition();
        var aTop = this.aimTop;
        var aLeft = this.aimLeft;
        var aWidth = this.aimProp.width;
        var aHeight = this.aimProp.height;
        var tHeight = this.tipProp.height;
        var tWidth = this.tipProp.width;
        var tMargin = this.tipProp.margin;
        //console.log(tWidth);
        if(aWidth > tWidth){
            marginLeft = aLeft + (aWidth - tWidth)/2;
        }else{
            marginLeft = aLeft - (tWidth - aWidth)/2;
        }
        return direct == 'left'?{'left':aLeft - tWidth - tMargin - 8 + 'px','top':aTop + (aHeight - tHeight)/2 + 'px','name':'ch-ui-tipleft'}:
            direct == 'top'?{'left':marginLeft + 'px','top':aTop - tHeight - tMargin*2 + 'px','name':'ch-ui-tiptop'}:
                direct == 'right'?{'left':aLeft + aWidth + tMargin + 'px','top':aTop + (aHeight - tHeight)/2 + 'px','name':'ch-ui-tipright'}:
                    /*direct == 'bottom'?*/{'left': marginLeft + 'px','top':aTop + tHeight + tMargin*2 + 'px','name':'ch-ui-tipbottom'};
    };
    /* 显示提示框 */
    ToolTip.prototype.show = function(){
        this.name.trigger('beforeShow');
        this.tipProp = this.getTipProperty();
        var tPosition = this.getTipPosition(this.direct);
        this.tip
            .css({'left': tPosition.left, 'top': tPosition.top})
            .addClass(tPosition.name);
        this.isShown = false;
    };
    /* 隐藏提示框 */
    ToolTip.prototype.hide = function(){
        this.tip.remove();
        this.name.trigger('afterShow');
        this.isShown = true;
    };
    /* 触发事件 */
    ToolTip.prototype.triggerMethod = function(eve){
        var that = this;
        if(eve.length > 1){
            this.name.on(eve[0],function(){
                that.show();
            });
            this.name.on(eve[1],function(){
                that.hide();
            });
        }else{
            switch (eve[0]){
                case 'hover':
                    this.name.on('mouseover',function(){
                        that.show();
                    });
                    this.name.on('mouseout',function(){
                        that.hide();
                    });
                    break;
                case 'focus':
                    this.name.on('focus',function(){
                        that.show();
                    });
                    this.name.on('blur',function(){
                        that.hide();
                    });
                    break;
                case 'click':
                    this.name.on(eve[0],function(){
                        if(that.isShown){
                            that.show();
                        }else{
                            that.hide();
                        }
                    });
                case 'manual':
                    break;
                default:
                    break;
            }
        }
    };

    function showTips(opt){
        var $this = $(this);
        // 默认配置
        var defaultOptions = {
            direct: 'top',
            trigger: ['hover']
        };
        $this.each(function () {
            var $me = $(this);
            var data = $me.data("save");
            if((typeof(opt) == 'object') && !data){
                var options = $.extend(defaultOptions,opt);
                var obj = new ToolTip($me,options);
                obj.triggerMethod(options.trigger);
                $me.data('save',obj);
            }else if(typeof(opt) == 'string' && data){
                switch (opt){
                    case 'show':
                        data.show();
                        break;
                    case 'hide':
                        data.hide();
                        break;
                    default:
                        break;
                }
            }else{
                return ;
            }
        });
    }
    $.fn.tooltip = showTips;
}(jQuery);

/*
 * 滑块功能
 * @class
 * @param {string} rootElement   根元素
 * @param {json} options         滑块位置等参数
 * @author by HK
 * */
+function($){
    function Slider(rootElement,options){
        this.rootElement = rootElement;
        this.precent = options.value;
        this.sort = options.sort;
        this.min = options.min;
        this.max = options.max;
        this.range = this.max-this.min;
        this.slideEvent = options.slideEvent;
        if(!this.init){
            Slider.prototype.init = function(){
                var that = this;
                var precent = parseFloat(this.precent)*0.01;
                var $template = this.createSlider();
                this.slideBar = $template;
                this.slideBox = $template.find('.ch-ui-slider-box');
                this.slideBg = $template.find('.ch-ui-slider-bg');
                this.len = this.range / this.slideBar.width() ;    //每一格代表多少px
                this.slideBox.css('left',this.setValue(precent).left);
                this.slideBg.css('width',this.setValue(precent).width);
                this.slideBox.on('output',function(evt,text){
                    that.slideEvent(text);
                });
            };
            Slider.prototype.createSlider = function(){
                var $template = $('<div class="ch-ui-slider-bar" onselectstart="return false"><a class="ch-ui-slider-box" onselectstart="return false"></a><div class="ch-ui-slider-bg"></div></div>');
                this.rootElement.append($template);
                return $template;
            };
            /* 设置滑块初始位置 */
            Slider.prototype.setValue = function(precent){
                var setLeft = Math.ceil(precent * this.slideBar.width() - this.slideBox.width() / 2) + 'px',
                    setWidth = Math.ceil(precent * this.slideBar.width()) + 'px';
                return {'left': setLeft,'width': setWidth};
            };
            /* 获取滑动条属性 */
            Slider.prototype.getBarProperty = function(){
                var left = this.slideBar.offset().left,
                    barWidth = this.slideBar.width();
                return {'left':left,'width':barWidth};
            };
            /* 获取滑块属性 */
            Slider.prototype.getBoxProperty = function(){
                var boxWidth = this.slideBox.width(),
                    boxLeft = parseFloat(this.slideBox.css('left'));
                return {'width':boxWidth,'left':boxLeft};
            };
            /* 鼠标拖拽滑块 */
            Slider.prototype.move = function(bar,box,lastX){
                var that = this;
                $(document).on('mousemove',function(ev){
                    var _x = ev.pageX - lastX + box.left;
                    //临界点
                    if(_x > bar.width - box.width/2){
                        _x = bar.width - box.width/2;
                    }else if(_x < -box.width/2){
                        _x = -box.width/2;
                    }
                    that.showNum(_x);
                    that.slideBg.css('width',_x + box.width/2 + 'px');
                    that.slideBox.css('left',_x + 'px');
                });
            };
            /* 显示滑块当前位置 */
            Slider.prototype.showNum = function (x) {
                var result = '';
                if(this.sort == 'max'){
                    result = Math.ceil((x+8)*this.len);
                }else{
                    result = Math.ceil(this.max - (x+8)*this.len);
                }
                this.slideBox.trigger('output',[result]);
            };
            /* 鼠标点击滑块 */
            Slider.prototype.mouseDown = function(e){
                var bar = this.getBarProperty();
                var box = this.getBoxProperty();
                this.move(bar,box,e.pageX);
            };
            /* 鼠标点击滑动条 */
            Slider.prototype.barClick = function(e){
                var that = this;
                var bar = this.getBarProperty();
                var box = this.getBoxProperty();
                var x = e.pageX - bar.left;
                if(x > bar.width - box.width/2){
                    x = bar.width;
                }else if(x < -box.width/2){
                    x = -box.width/2;
                }
                this.slideBox.animate({left: x - box.width/2 + 'px'},200,function(){
                    that.showNum(x - box.width/2);
                });
                this.slideBg.animate({width: x + 'px'},200);
            };
            /* 滑块触发事件 */
            Slider.prototype.boxMethod = function(){
                var that =this;
                this.slideBox.on('mousedown',function(e) {
                    that.mouseDown(e);
                });
                $(document).on('mouseup',function(){
                    $(this).off('mousemove');
                });
            };
            /* 滑动条触发事件 */
            Slider.prototype.barMethod = function(){
                var that = this;
                this.slideBar.on('click',function(e){
                    if(e.target.className != "ch-ui-slider-box"){
                        that.barClick(e);
                    }
                });
            };
        }
        this.init();
    }

    function sliderBar(opt){
        var $this = $(this);
        if((typeof(opt) == 'object') &&!data){
            var data = new Slider($this,opt);
            $this.data("save_data",data);
        }
        data.boxMethod();
        data.barMethod();
    }
    $.fn.slider = sliderBar;
}(jQuery);

/* 树形菜单
 * @class
 * @param {array} datas   树形菜单输入内容
 * @author by HK
 * */
+function($){
    function Tree(rootElement,datas){
        var data = datas;
        this.rootElement = rootElement;
        if(!this.createTree){
            Tree.prototype.createTree = function(data,opt){
                for(var i=0,len=data.length;i<len;i++){
                    var $ul = this.createUl();
                    var $li = this.createLi();
                    $ul.addClass('ch-ui-tree-ul');
                    $li.find('a').html(data[i].name);
                    $ul.append($li);
                    opt.append($ul);
                    if(!(data[i].children)){
                        $li.find('span').addClass('ch-ui-btn-hide');
                    }else{
                        this.createTree(data[i].children,$li);
                    }
                }
            };
            Tree.prototype.createUl = function(){
                var ul = $('<ul></ul>');
                return ul;
            };
            Tree.prototype.createLi = function(){
                var li = $('<li><span class="ch-ui-tree-btn-right"></span><a></a></li>');
                return li;
            };
            Tree.prototype.clickTree = function(){
                var that = this;
                $('li').find('a').on('click',function(){
                    that.triggerMethod($(this));
                });
            };
            Tree.prototype.triggerMethod = function(obj){
                obj.prev('span').toggleClass('ch-ui-tree-btn-bottom ch-ui-tree-btn-right'); //后期优化：传入参数，规定初始打开状态后，修改这里的方向
                obj.nextAll('ul').toggle();
            };
        }
        this.createTree(data,this.rootElement);
    }

    function treeMenu(datas){
        var $this = $(this);
        var tree = new Tree($this,datas);
        tree.clickTree();
    }
    $.fn.tree = treeMenu;
}(jQuery);
//end

/**
 * @carousel(面向对象模块化carousel修改)
 * 传送带插件 Carousel 参数说明（滚动内容为浮动布局）
 * 默认点击next按钮，从右到左滚动，若颠倒next和prev的位置可反向
 * 清楚插件只需.carousel(false);
 * 调用插件只需传入参数对象如下
 {
    //默认项，可配置
     duration: 传送一个单位的时间（默认为1500）
     delay: 传送一个单位后停止多少时间再传送下一个（默认为500）
     easing: 滚动曲线（默认为“swing”，可设置为“linear”平缓型）
     auto: 是否自动滚动（默认true）
     turnAround: 布尔值，是否滚动反向，也就是从左到右（默认为false，从右到左）

    //必配置项
     distance: 一个单位的长度,特指单个li及右侧margin的和(可为固定宽度，也可为百分比)
     prev: 左侧按钮的selector(如：".class","div ul"),
     next: 右侧按钮的selector(如：".class","div ul"),
     itemsContainer: (切换内容的盒子的selector(如：".class","div ul"),
     items: 切换内容的selector(如：".class","div ul",

     //导航块，可配置
     indicators: {
        selector: 指示点的selector
        activeClass: 激活状态的class，添加到当前激活的导航块
        trigger: mouseenter/click //触发导航块的事件类型
     }
 };
 默认从右到左滚动，若需从左到右，交换prev和next的值。
 */
+function($){
    function HDCarousel(rootElement,configs) {
        //标志属性(内部属性)
        this._animateDown = true;
        this._interval = null;
        this._indicatorsTimeOut = null;
        //记录当前显示项目的_cid
        this._curentItemCid = null;

        //重新定义命名空间
        this.configs = configs;
        this.elements = {};
        this.elements.$rootElement = rootElement;
        this.elements.$prev = this.elements.$rootElement.find(this.configs.prev);
        this.elements.$next = this.elements.$rootElement.find(this.configs.next);
        this.elements.$itemsContainer = this.elements.$rootElement.find(this.configs.itemsContainer);
        this.elements.$items = this.elements.$rootElement.find(this.configs.items);

        //导航块，可配置
        this.configs.indicators && (this.elements.$indicators = this.elements.$rootElement.find(this.configs.indicators.selector));

        if(!this.autoRoll){
            HDCarousel.prototype.autoRoll = function () {
                var me = this;
                if(me.configs.turnAround){
                    me.interval = setInterval(function () {
                        me.prev(me.configs.duration,me.configs.easing);
                    },me.configs.delay+me.configs.duration);
                }else{
                    me.interval = setInterval(function () {
                        me.next(me.configs.duration,me.configs.easing);
                    },me.configs.delay+me.configs.duration);
                }
                return this;
            };
            HDCarousel.prototype.pause = function () {
                this.interval && clearInterval(this.interval);
                this._indicatorsTimeOut = null;//保证indicators恢复
                return this;
            };
            HDCarousel.prototype.prev = function (duration,easing,noIndicators) {
                var me = this;
                var curentCid;
                me._animateDown = false;

                me.elements.$rootElement.find(me.configs.items).last().prependTo(me.elements.$itemsContainer);

                curentCid = parseFloat(me.getCurentCid());
                if(!noIndicators) {
                    if (me.configs.indicators) {
                        me.changeIndicators(curentCid);
                    }
                }

                me.elements.$itemsContainer
                    .css("marginLeft","-"+me.configs.distance)
                    .animate(
                        {
                            marginLeft: "0px"
                        },
                        duration,
                        easing,
                        function () {
                            me._animateDown = true;
                        }
                    );
                return this;
            };
            HDCarousel.prototype.next = function (duration,easing,noIndicators) {
                var me = this;
                var curentCid = parseFloat(me.getCurentCid());
                me._animateDown = false;
                if(!noIndicators) {
                    if (me.configs.indicators) {
                        if (curentCid < (me.elements.$indicators.length - 1)) {
                            me.changeIndicators(curentCid + 1);
                        } else {
                            me.changeIndicators(0);
                        }
                    }
                }

                me.elements.$itemsContainer.animate(
                    {
                        marginLeft: "-"+me.configs.distance
                    },
                    duration,
                    easing,
                    function () {
                        me.elements.$itemsContainer.css("marginLeft",0).append(me.elements.$rootElement.find(me.configs.items).first());
                        me._animateDown = true;
                    }
                );
                return this;
            };
            HDCarousel.prototype.init = function () {
                var me = this;
                me.elements.$next.click(function () {
                    me._animateDown && me.next(me.configs.duration,me.configs.easing);
                });
                me.elements.$prev.click(function () {
                    me._animateDown && me.prev(me.configs.duration,me.configs.easing);
                });
                return this;
            };

            HDCarousel.prototype.getCurentCid = function () {
                var me = this;
                return me.elements.$rootElement.find(me.configs.items).first().attr("_cid");
            };

            HDCarousel.prototype.changeIndicators = function (num) {
                var me = this;
                me.elements.$indicators.removeClass(me.configs.indicators.activeClass);
                me.elements.$indicators.eq(num).addClass(me.configs.indicators.activeClass);
            };

            //初始化导航块功能
            HDCarousel.prototype.indicatorsRoll = function () {
                var me = this;
                var triggerEvent;
                me.elements.$items.each(function (index) {
                    $(this).attr("_cid",index);
                });
                me.elements.$indicators.each(function (index) {
                    $(this).attr("_cid",index);
                });
                switch (me.configs.indicators.trigger){
                    case "mouseenter":
                        triggerEvent = "mouseenter";
                        break;
                    case "click":
                        triggerEvent = "click";
                        break;
                    default:
                        break;
                }
                me.elements.$indicators.on(triggerEvent,function (evt) {
                    if(!me._indicatorsTimeOut) {
                        me._indicatorsTimeOut = setTimeout($.proxy(me.indicatorsAction,me,evt), 200);
                    }else {
                        //me._indicatorsTimeOut && clearTimeout(me._indicatorsTimeOut);
                        return;
                    }
                });
            };
            HDCarousel.prototype.indicatorsAction = function (evt) {
                var me = this;
                var $target = $(evt.target);
                var activeCid = me.getCurentCid();
                var targetCid = $target.attr("_cid");
                if(targetCid == activeCid) return;
                if (targetCid < activeCid) {
                    me.changeIndicators(targetCid);
                    for (var i = 1; i <= activeCid - targetCid; i++) {
                        (function (j) {
                            setTimeout(function () {
                                me.prev(100, "linear", true);
                            }, j * 100);
                        })(i);
                    }
                    setTimeout(function () {
                        me._indicatorsTimeOut = null;
                    }, (i+1)* 100);
                }
                if (targetCid > activeCid) {
                    me.changeIndicators(targetCid);
                    for (var x = 1; x <= targetCid - activeCid; x++) {
                        (function (n) {
                            setTimeout(function () {
                                me.next(100, "linear", true);
                            }, n * 100);
                        })(x);
                    }
                    setTimeout(function () {
                        me._indicatorsTimeOut = null;
                    },(x+1)*100);
                }
            }
        }
        this.init();
    }
    function plugin(customConfigs) {
        var defaultConfigs = {
            duration: 1200,
            delay: 1200,
            easing: "swing",
            autoRoll: true,
            turnAround: false,
            indicators: null
        };
        var configs;
        if(customConfigs) configs=$.extend({},defaultConfigs,customConfigs);
        return this.each(function () {
            var $this = $(this);
            var data = $this.data("ch-ui-carousel");
            //解除
            if(!customConfigs && data){
                data.pause();
                data.elements.$next.off("click");
                data.elements.$prev.off("click");
                $this.off("mouseenter",data["pause"]).off("mouseleave",data["autoRoll"]);
                $this.data("ch-ui-carousel",null);
                data = null;
                return;
            }
            //注册
            if(!data && customConfigs){
                $this.data("ch-ui-carousel",(data = new HDCarousel($this,configs)));
                //cycle
                if(configs.autoRoll){
                    data["autoRoll"]();
                    $this.on("mouseenter",$.proxy(data["pause"],data)).on("mouseleave",$.proxy(data["autoRoll"],data));
                }
                if(configs.indicators){
                    data["indicatorsRoll"]();
                }
            }
        });
    }

    var old = $.fn.carousel;
    $.fn.carousel = plugin;
    //$.fn.carousel.Constructor = HDCarousel;
    //解除占用
    $.fn.carousel.noConflict = function () {
        $.fn.carousel = old;
        return this;
    };
}(jQuery);
//调用及解除示例
/*$(".test).carousel({
 distance: "392px",
 duration: 100,
 delay: 1000,
 prev: ".order-thumbnail-carousel-lt",
 next: ".order-thumbnail-carousel-gt",
 easing: "linear",
 innerContainer: "ul",
 innerItems: "li",
 turnAround: true
 });
 $(".test").carousel(false);*/

/**
 * @模态框
 * {
 *      area: [width,height]//高宽
 *      relatedModal: ""//链接的对话框的选择器
 *      cancelElements: ["","",...]//点击关闭模态框的元素选择器
 *
 * }
 * Created by Administrator on 2016/12/28.
 */
+function ($) {
    //name,target,width,height
    function Modal(element,options) {
        //内部标志状态属性
        this._isShown = false;

        //
        this.configs = options;
        this.elements = {};
        this.elements.body = $("body");
        this.elements.triggerElement = element;
        this.elements.relatedModal = $(this.configs.relatedModal);
        this.elements.modalBackdrop = this.elements.relatedModal.find("div.ch-ui-modal-backdrop");
        this.elements.modalContent = this.elements.relatedModal.find("div.ch-ui-modal-content");

        /*  this.width = width+"px";
         this.height = height+"px";
         this.showBefore = $.Event("show-before");
         this.showAfter = $.Event("show-after");
         this.hideBefore = $.Event("hide-before");
         this.hideAfter = $.Event("hide-after");
         this.rootPop = $(
         "<div class='ch-ui-popup'>" +
         "<div class='ch-ui-popup-back'></div>"+
         "<div class='ch-ui-popup-content'></div>"+
         "</div>"
         );*/
        if(!this.initModal){
            Modal.prototype.initModal = function () {
                var me = this;
                me.elements.modalContent.css({
                    "width": me.configs.area[0],
                    "height": me.configs.area[1],
                    "margin-left": "-"+(me.configs.area[0]/2)+"px"
                });
                me.elements.modalBackdrop.on("click",function () {
                    me.hideModal();
                });
                for (var i = 0;i<me.configs.cancelElements.length;i++){
                    me.elements.modalContent.find(me.configs.cancelElements[i]).on("click",function () {
                        me.hideModal();
                    });
                }
            };
            Modal.prototype.showModal = function () {
                if(this._isShown) return;
                var me = this;
                me.elements.triggerElement.trigger("show-before");
                me.elements.body.addClass("ch-ui-modal-body-hide");
                me.elements.relatedModal.show();
                setTimeout(function () {
                    me.elements.modalBackdrop.css({
                        "opacity": 0.5
                    });
                    me.elements.modalContent.css({
                        "opacity": 1,
                        "margin-top": "-"+(me.configs.area[1]/2)+"px"
                    });
                },50);
                me._isShown = true;
                me.elements.triggerElement.trigger("show-after");
            };
            Modal.prototype.hideModal = function () {
                if(!this._isShown) return;
                var me = this;
                me.elements.triggerElement.trigger("hide-before");
                this.elements.modalBackdrop.css({
                    "opacity": 0
                });
                this.elements.modalContent.css({
                    "opacity": 0,
                    "margin-top": 0
                });
                setTimeout(function () {
                    me.elements.relatedModal.hide();
                    me.elements.body.removeClass("ch-ui-modal-body-hide");
                },250);

                me._isShown  = false;
                me.elements.triggerElement.trigger("hide-after");
            };
        }
        this.initModal();
        //return me.rootPop;
    };
    //name,target,width,height,close
    function plugin(options) {
        //this.addClass(name);
        return this.each(function () {
            var me = $(this);
            var data = me.data("ch-ui-modal");
            //var PopUp = new Modal(me,options);
            if (!data){
                me.data("ch-ui-modal",(data = new Modal(me,options)));
                me.on("click",function () {
                    data._isShown && data.hideModal();
                    data._isShown || data.showModal();
                });
            }
        });
    }

    var old = $.fn.modal;
    $.fn.modal = plugin;
    $.fn.modal.noConflict = function () {
        $.fn.modal = old;
        return this;
    }
}(jQuery);

var chUiExampledata = {
    configs:{
        target: ".table-example-xxx-test",//按需删掉
        caption:"测试用表格",
        theadText: ["名字","英文名","年龄","身高（cm）","体重（kg）"],
        theadName: ["name","ename","age","height","weight"],
        sortable: true,
        /*selectable: true,
        editable: true,*/
        expression: {
            type: "rolling",
             viewHeight: "260px"
           /* type: "paging",//rolling
            pageRows: 6//viewHeight: "260px"*/
        },
        url: null
    },
    data:[
        {
            name: "张三",
            ename: "adfdse",
            age: 25,
            height: 159,
            weight: 66
        },
        {
            name: "李四",
            ename: "hgjjh",
            age: 36,
            height: 179,
            weight: 66
        },
        {
            name: "王麻子",
            ename: "sdfsd",
            age: 30,
            height: 172,
            weight: 22
        },
        {
            name: "开机",
            ename: "lkt",
            age: 19,
            height: 169,
            weight: 50
        },
        {
            name: "是德国",
            ename: "yfvwe",
            age: 66,
            height: 166,
            weight: 66
        },
        {
            name: "隧道股",
            ename: "wegf",
            age: 36,
            height: 185,
            weight: 89
        },
        {
            name: "缴费单",
            ename: "ihger",
            age: 59,
            height: 196,
            weight: 256
        },
        {
            name: "部分",
            ename: "bgh",
            age: 28,
            height: 176,
            weight: 55
        },
        {
            name: "草端",
            ename: "hves",
            age: 65,
            height: 156,
            weight: 46
        },
        {
            name: "掉书袋",
            ename: "fgjvcx",
            age: 46,
            height: 189,
            weight: 88
        },
        {
            name: "是德国",
            ename: "phvs",
            age: 96,
            height: 564,
            weight: 15
        },
        {
            name: "啊边银",
            ename: "pbbe",
            age: 94,
            height: 168,
            weight: 51
        },
        {
            name: "拍过不",
            ename: "bndsa",
            age: 45,
            height: 155,
            weight: 98
        },
        {
            name: "的萨范",
            ename: "bgh",
            age: 28,
            height: 176,
            weight: 55
        },
        {
            name: "上帝发",
            ename: "sdgf",
            age: 28,
            height: 176,
            weight: 55
        },
        {
            name: "今天",
            ename: "bgh",
            age: 28,
            height: 176,
            weight: 55
        },
        {
            name: "雷大水",
            ename: "nmte",
            age: 28,
            height: 176,
            weight: 55
        },
        {
            name: "士大夫",
            ename: "new",
            age: 28,
            height: 176,
            weight: 55
        },
        {
            name: "哦配额",
            ename: "sgfh",
            age: 28,
            height: 176,
            weight: 55
        },
        {
            name: "跑任务",
            ename: "bvee",
            age: 28,
            height: 176,
            weight: 55
        },
        {
            name: "分别为",
            ename: "ufw",
            age: 28,
            height: 176,
            weight: 55
        },
        {
            name: "轻松的",
            ename: "yhdsf",
            age: 28,
            height: 176,
            weight: 55
        }
    ]
};
+function ($) {
    function table(options,rootElement){
        this.elements = {}; //元素命名空间
        this.elements.rootElement = $(options.configs.target);//以后修改为参数rootElement

        this.configs = options.configs; //配置参数命名空间
        this.configs._reference = "";//内部缓存的比较参数
        this.configs._contenteditable = false;//内部标识是否可编辑的属性

        this.datas = {};    //数据命名空间
        this.datas.original = options.data;  //原始数据
        this.datas.modified = [];  //修改后的数据
        this.datas.sorted = [];    //排序后的数据
        this.datas.grouped = [];  //分组后的数据

        this._cidModified = [];//存储修改过条目cid
        this._tdWidths = [];//存储隐藏thead的个th的宽度，用于同步rolling表格表头的宽度

        if(!this.init){
            //初次调用时运行的函数，根据参数初始化表格
            table.prototype.init = function () {
                this._addCid();
                switch (this.configs.expression.type) {
                    case "rolling":
                        this.initRollingTable();
                        break;
                    case "paging":
                        this.initPagingTable();
                        break;
                    default: break;
                }
            };
            //添加本地_cid
            table.prototype._addCid = function () {
                for(var i = 0; i < this.datas.original.length; i++){
                    //创建每个数据的cid
                    this.datas.original[i]._cid = i;
                }
                //每次修改后的数据集合
                this.datas.modified = this._cloneDeep(this.datas.original);
                //每次排序后的数据集合
                this.datas.sorted = this._cloneDeep(this.datas.original);
            };
            //删除数据本地_cid
            table.prototype._deleteCid = function (data) {
                for(var i = 0; i < data; i++){
                    //删除每个数据的cid
                    delete  data[i]._cid;
                }
            };
            //获取表格行的_cid
            table.prototype._getTrCid = function (target) {
                //只能是装文字的div，可改进
                var trCid = target.parent().parent().attr("_cid");
                return trCid;
            };
            //深度克隆数据，返回副本
            table.prototype._cloneDeep = function (data) {
                var cloneData = $.map( data, function(obj){
                    return $.extend(true,{},obj);//返回对象的深拷贝
                });
                return cloneData;
            };
            //创建table元素
            table.prototype.createTable = function () {
                var table = $("<table class='ch-ui-table'></table>");
                return table;
            };
            //创建表格标题元素
            table.prototype.createCaption = function(){
                var caption = $("<caption></caption>");
                caption.text(this.configs.caption);
                this.elements.caption = caption;
                return caption;
            };
            //创建表头元素
            table.prototype.createThead = function () {
                var thead = $("<thead></thead>")
                var tr = this.createTr();
                for(var i=0;i<this.configs.theadText.length;i++){
                    var th = this.createTh(this.configs.theadText[i]);
                    th.attr("_name",this.configs.theadName[i]);
                    tr.append(th);
                }
                thead.append(tr);
                this.elements.thead = thead;
                return thead;
            };
            //创建隐藏的表头元素，用于获取宽度(直接获取td宽度，似乎没必要这个函数)
            table.prototype.createHiddenThead = function () {
                var thead = $("<thead style='height: 0'></thead>")
                var tr = this.createTr();
                for(var i=0;i<this.configs.theadText.length;i++){
                    var th = this.createTh(this.configs.theadText[i]);
                    th.attr("_name",this.configs.theadName[i]);
                    tr.append(th);
                }
                thead.append(tr);
                this.elements.hiddenThead = thead;
                return thead;
            };
            //获取隐藏表格头部各宽，用于设置头部宽度
            table.prototype.getTdWidths = function () {
                var me = this;
                var widths = [];
                for (var i=0;i<this.configs.theadName.length;i++){
                    widths.push(me.elements.tbody.find("tr:first").find("td").eq(i).outerWidth());
                }
                this._tdWidths = widths;
                return widths;
            };
            //根据传入的参数设置表头宽度
            table.prototype.setThWidths = function () {
                var me = this;
                var widths = me._tdWidths;
                for(var i = 0;i<widths.length;i++){
                    me.elements.thead.find("th").eq(i).outerWidth(widths[i]);
                }
            };
            //创建tbody元素
            table.prototype.createTbody = function () {
                var tbody = $("<tbody></tbody>");
                this.elements.tbody = tbody;
                return tbody;
            };
            //创建tr元素
            table.prototype.createTr = function () {
                var tr = $("<tr></tr>");
                return tr;
            };
            //创建th元素
            table.prototype.createTh = function (text) {
                var th = $("<th></th>");
                var spanUp = $("<span class='ch-ui-table-up deactive'></span>");
                var spanDown = $("<span class='ch-ui-table-down deactive'></span>");
                th.text(text);
                th.append(spanUp).append(spanDown);
                return th;
            };
            //创建td元素并内嵌一个div供编辑使用
            table.prototype.createTd = function (text) {
                var td = $("<td><div></div></td>");
                td.children("div").text(text);
                td.children("div").attr("title",text);//可以再考虑
                return td;
            };
            //根据数据渲染表格内容
            table.prototype.renderTbody = function (data) {
                for(var i = 0;i<data.length;i++){
                    var tr = this.createTr();
                    //根据数据_cid为每条tr赋予_cid值，从0开始;
                    tr.attr("_cid",data[i]._cid);
                    for (var j=0;j<this.configs.theadName.length;j++){
                        tr.append(this.createTd(data[i][this.configs.theadName[j]]));
                    }
                    this.elements.tbody.append(tr);
                }
            };
            //组合创建滚动表格头部
            table.prototype.createRollingHead = function () {
                var container = $("<div class='ch-ui-table-rolling-thead'></div>");
                var table = this.createTable();
                this.createThead();
                if(this.configs.caption){
                    this.createCaption();
                    table.append(this.elements.caption);
                }
                table.append(this.elements.thead);
                container.append(table);
                return container;
            };
            //组合创建滚动表格内容
            table.prototype.createRollingBody = function () {
                var container = $("<div class='ch-ui-table-rolling-tbody' style='height: "+this.configs.expression.viewHeight+"'></div>");
                var table = this.createTable();
                this.createTbody();
                this.renderTbody(this.datas.original);
                table.append(this.elements.tbody);
                container.append(table);
                return container;
            };
            //初始化滚动表格
            table.prototype.initRollingTable = function () {
                var tableHead = this.createRollingHead();
                var tableBody = this.createRollingBody();
                this.elements.rootElement.append(tableHead).append(tableBody);
                this.getTdWidths();
                this.setThWidths();
            };
            //初始化分页表格
            table.prototype.initPagingTable = function () {
                var container = $("<div class='ch-ui-table-paging'></div>");
                var table = this.createTable();
                if(this.configs.caption){
                    this.createCaption();
                    table.append(this.elements.caption);
                }
                this.createThead();
                this.createTbody();
                table.append(this.elements.thead).append(this.elements.tbody);
                this.divideDataIntoGroups(this.datas.original,this.configs.expression.pageRows);
                container.append(table);
                this.elements.rootElement.append(container).append(this.createPagination(this.datas.grouped));
            };
            //激活编辑状态
            table.prototype.activateEdit = function () {
                var me = this;
                me.elements.tbody.find("td>div").attr("contenteditable",true);
                //将修改过的行的_cid加到数组
                me.elements.tbody.on("focusout","td>div",function (evt) {
                    var trCid = test._getTrCid($(evt.target));
                    if($.inArray(trCid,me._cidModified)<0) me._cidModified.push(trCid);
                });
                this.configs._contenteditable = true;
            };
            //注销编辑状态
            table.prototype.deactiveEdit = function () {
                this.elements.tbody.find("td>div").attr("contenteditable",false);
                this.elements.tbody.off("focusout");
                this.configs._contenteditable = false;
            };
            //合并修改后的数据到this.datas.modified
            table.prototype.modifyData = function () {
                var me = this;
                var cidArray = me._cidModified;
                for(var i = 0; i<cidArray.length;i++){
                    var select = "tr"+"[_cid="+cidArray[i]+"]",
                        selectElement = me.elements.tbody.find(select),
                        selectData = {};
                    for (var j= 0; j<me.configs.theadName.length; j++){
                        selectData[me.configs.theadName[j]] = selectElement.find("td>div").eq(j).text();
                    }
                    $.extend(me.datas.modified[cidArray[i]],selectData);
                }
            };
            //表格数据一般比较函数
            table.prototype.compareCommonFn = function (value1, value2) {
                if (value1[this.configs._reference] < value2[this.configs._reference]) {
                    return -1;
                } else if (value1[this.configs._reference] > value2[this.configs._reference]) {
                    return 1;
                } else {
                    return 0;
                }
            };
            //表格数据中文比较函数（调用本地比较方法）
            table.prototype.compareCnFn = function (value1,value2) {
                return value1[this.configs._reference].localeCompare(value2[this.configs._reference]);
            };
            //将传入的数据排序，依据reference是否为中文选择相应的排序规则
            table.prototype.sortData = function (reference,data) {
                this.configs._reference = reference;
                if(escape(data[0][reference]).indexOf("%u")<0){
                    data.sort($.proxy(this.compareCommonFn,this));
                }
                else{
                    data.sort($.proxy(this.compareCnFn,this));
                }
            };
            table.prototype.activateSort = function () {
                var me = this;
                me.elements.thead.find("span").removeClass("deactive");
                me.elements.thead.on("click","th",function (evt) {
                    $target = $(evt.currentTarget);
                    if($target.find("span").hasClass("active")){
                        if(me.configs.expression.type == "rolling"){
                            $target.find("span:first").toggleClass("active");
                            $target.find("span:last").toggleClass("active");
                            me.datas.sorted.reverse();
                            me.elements.tbody.empty();
                            me.renderTbody(me.datas.sorted);
                        }else {
                            $target.find("span:first").toggleClass("active");
                            $target.find("span:last").toggleClass("active");
                            me.datas.sorted.reverse();
                            me.divideDataIntoGroups(me.datas.sorted,me.configs.expression.pageRows);
                            me.elements.tbody.empty();
                            me.elements.pagination.find("a.pagination-item").eq(0).trigger("click");
                        }
                    }else {
                        if(me.configs.expression.type == "rolling"){
                            me.elements.thead.find("span.active").removeClass("active");
                            $target.find("span:first").addClass("active");
                            me.sortData($target.attr("_name"),me.datas.sorted);
                            me.elements.tbody.empty();
                            me.renderTbody(me.datas.sorted);
                        }else {
                            me.elements.thead.find("span.active").removeClass("active");
                            $target.find("span:first").addClass("active");
                            me.sortData($target.attr("_name"),me.datas.sorted);
                            me.divideDataIntoGroups(me.datas.sorted,me.configs.expression.pageRows);
                            me.elements.tbody.empty();
                            me.elements.pagination.find("a.pagination-item").eq(0).trigger("click");
                        }
                    }
                });
            };
            table.prototype.deactiveSort = function () {
                this.elements.thead.off("click");
                this.elements.thead.find("span").addClass("deactive");
            };
            //激活可选中状态
            table.prototype.activateSelect = function () {
                this.elements.tbody.on("click","tr",function () {
                    $(this).toggleClass("selected");
                });
            };
            //注销可选择状态
            table.prototype.deactiveSelect = function () {
                this.elements.tbody.off("click","tr");
            };
            //根据个数将数据分组
            table.prototype.divideDataIntoGroups = function (data,number) {
                var index = 0;
                var dataGrouped = [];
                for(var i = 0;i<data.length;i+=number){
                    dataGrouped.push(data.slice(index,index+=number));
                }
                this.datas.grouped = dataGrouped;
                return dataGrouped;
            };
            //创建分页导航
            table.prototype.createPagination = function (data) {
                var me = this;
                var length = data.length;
                var container = $("<div class='ch-ui-table-pagination' data-table-page-total="+length+"></div>");
                var previous = $("<a class='pagination-previous'>&laquo;</a>");
                var next = $("<a class='pagination-next'>&raquo;</a>");
                var span = $("<span></span>");
                for(var i = 1;i<(length+1);i++){
                    var item = $("<a class='pagination-item' data-table-page-number = "+(i-1)+">"+i+"</a>");
                    span.append(item);
                }
                container.append(previous).append(span).append(next);
                container.on("click",function (evt) {
                    var target = $(evt.target);
                    if(target.hasClass("pagination-item")){
                        var number = target.data("table-page-number");
                        container.find(".pagination-item.active").removeClass("active");
                        target.addClass("active");
                        me.elements.tbody.empty();
                        me.renderTbody(me.datas.grouped[number]);
                    }
                    if(target.hasClass("pagination-previous")){
                        var previousNum = container.find(".pagination-item.active").data("table-page-number");
                        if((previousNum+1)>1){
                            container.find(".pagination-item").eq(previousNum-1).trigger("click");
                        }else {
                            return;
                        }
                    }
                    if(target.hasClass("pagination-next")){
                        var nextNum = container.find(".pagination-item.active").data("table-page-number");
                        if((nextNum+1)<length){
                            container.find(".pagination-item").eq(nextNum+1).trigger("click");
                        }else {
                            return;
                        }
                    }
                });
                container.find("a.pagination-item").eq(0).trigger("click");
                this.elements.pagination = container;
                return container;
            };
            //索引数据，考虑$.grep
        }
        this.init();
    }
    /*data = {
     configs:{
     //必配置项
     theadText: ["名字","英文名","年龄","身高（cm）","体重（kg）"],
     theadName: ["name","ename","age","height","weight"],

     target: ".test",//按需删掉
     caption:"测试用表格",
     //可选择配置
     sortable: true,
     selectable: true,
     editable: true,


     url: null
     },
     data*/
    function plugin(options) {
        var defalt = {
            configs: {
                caption: null,
                sortable: true,
                selectable: false,
                editable: false,
                expression: {
                    type: "paging",//rolling
                    pageRows: 6//viewHeight: "260px"
                }
            },
            data:{

            }
        };
    }
    test = new table(chUiExampledata);
     test.activateSort();
     test.activateEdit();
}(jQuery);



