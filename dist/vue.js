(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;

    var _s, _e;

    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function isFunction(val) {
    return typeof val === 'function';
  }
  function isObject(val) {
    return _typeof(val) === 'object' && val !== null;
  }

  // arrayMethods是继承自Array.prototype，不直接修改Array.prototype，不污染Array.prototype
  var oldArrayPrototype = Array.prototype;
  var arrayMethods = Object.create(oldArrayPrototype);
  var methods = ['push', 'pop', 'unshift', 'shift', 'sort', 'reverse', 'splice'];
  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      var _oldArrayPrototype$me;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var result = (_oldArrayPrototype$me = oldArrayPrototype[method]).call.apply(_oldArrayPrototype$me, [this].concat(args)); // this指向调用该方法的data（即经过响应式处理的数组）
      // 对于数组中新增的元素，也需要进行监控


      var ob = this.__ob__;
      var inserted;

      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;

        case "splice":
          inserted = args.slice(2);
      } // inserted是个数组，需要调用observeArray来监测


      if (inserted) ob.observeArray(inserted); // 数组派发更新

      ob.dep.notify();
      return result;
    };
  });

  /**
   * 1. 每个属性我都给他分配一个dep（一对一的关系），一个dep可以存放多个watcher（一个属性可能对应多个watcher）
   * 2. 一个watcher中还可以存放多个dep（一个watcher可能对应多个属性，而dep与属性一一对应）
   * 3. dep具有唯一性
   */
  var id$1 = 0; // 给dep添加一个标识，保证它的唯一性

  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);

      this.id = id$1++;
      this.subs = []; // 用来存放watcher
    } // 将dep实例放到watcher中


    _createClass(Dep, [{
      key: "depend",
      value: function depend() {
        // 如果当前存在watcher
        if (Dep.target) {
          // Dep.target即当前watcher，是在new Watcher时设置的
          Dep.target.addDep(this); // this为dep实例（与属性一一对应），即把自身dep实例存放在watcher里面
        }
      } // 依次执行subs里面的watcher更新方法

    }, {
      key: "notify",
      value: function notify() {
        this.subs.forEach(function (watcher) {
          return watcher.update();
        });
      } // 把watcher加入到dep实例的subs容器（因为一个dep可能对应多个watcher）

    }, {
      key: "addSub",
      value: function addSub(watcher) {
        console.log('dep.subs', this.subs);
        this.subs.push(watcher);
      }
    }]);

    return Dep;
  }();
  var targetStack = []; // Dep.target 为 dep 当前所对应的watcher（即栈顶的watcher），默认为null

  Dep.target = null;
  function pushTarget(watcher) {
    targetStack.push(watcher);
    Dep.target = watcher; // Dep.target指向当前watcher
  }
  function popTarget() {
    targetStack.pop(); // 当前watcher出栈 拿到上一个watcher

    Dep.target = targetStack[targetStack.length - 1];
  }

  /**
   * 数据劫持：
   * 1. 如果是对象，则递归对象所有属性，进行劫持
   * 2. 如果数组，则会劫持数组方法（方法中如果是新增元素，会劫持新增元素），并对数组中类型为数组/对象的元素进行劫持
   */

  var Observer = /*#__PURE__*/function () {
    // 通过new命令生成class实例时，会自动调用constructor()，即会执行this.walk(data)方法
    function Observer(data) {
      _classCallCheck(this, Observer);

      this.value = data;
      this.dep = new Dep(); // 给data添加一个dep，收集data整体的一个dep（主要用于数组的依赖收集）
      // 在数据data上新增属性 data.__ob__；指向经过new Observer(data)创建的实例，可以访问Observer.prototype上的方法observeArray、walk等
      // 所有被劫持过的数据都有__ob__属性（通过这个属性可以判断数据是否被检测过）

      Object.defineProperty(data, "__ob__", {
        // 值指代的就是Observer的实例，即监控的数据
        value: this,
        //  设为不可枚举，防止在forEach对每一项响应式的时候监控__ob__，造成死循环
        enumerable: false,
        writable: true,
        configurable: true
      });
      /**
       * 思考一下数组如何进行响应式？
       * 和对象一样，对每一个属性进行代理吗？
       * 如果数组长度为10000，给每一项设置代理，性能非常差！
       * 用户很少通过索引操作数组，我们只需要重写数组的原型方法，在方法中进行响应式即可。
       */

      if (Array.isArray(data)) {
        // 数组响应式处理
        // 重写数组的原型方法，将data原型指向重写后的对象
        data.__proto__ = arrayMethods; // 如果数组中的数据是对象，需要监控对象的变化

        this.observeArray(data);
      } else {
        // 对象响应式处理
        this.walk(data);
      }
    }

    _createClass(Observer, [{
      key: "observeArray",
      value: function observeArray(data) {
        // 【关键】递归了，监控数组每一项（observe会筛选出对象和数组，其他的不监控）的改变，数组长度很长的话，会影响性能
        // 【*********】数组并没有对索引进行监控，但是对数组的原型方法进行了改写，还对每一项（数组和对象类型）进行了监控
        data.forEach(function (item) {
          observe(item);
        });
      }
    }, {
      key: "walk",
      value: function walk(data) {
        Object.keys(data).forEach(function (key) {
          // 对data中的每个属性进行响应式处理
          defineReactive(data, key, data[key]);
        });
      }
    }]);

    return Observer;
  }();

  function defineReactive(data, key, value) {
    var childOb = observe(value); // 【关键】递归，劫持对象中所有层级的所有属性
    // 如果Vue数据嵌套层级过深 >> 性能会受影响【******************************】

    var dep = new Dep(); // 为每个属性创建一个独一无二的dep

    Object.defineProperty(data, key, {
      get: function get() {
        if (Dep.target) {
          dep.depend(); // 如果属性的值依然是一个数组/对象，则对该 数组/对象 整体进行依赖收集

          if (childOb) {
            childOb.dep.depend(); // 让对象和数组也记录watcher
            // 如果数据结构类似 {a:[1,2,[3,4,[5,6]]]} 这种数组多层嵌套，数组包含数组的情况，那么我们访问a的时候，只是对第一层的数组进行了依赖收集
            // 里面的数组因为没访问到，所以无法收集依赖，但是如果我们改变了a里面的第二层数组的值，是需要更新页面的，所以需要对数组递归进行依赖收集

            if (Array.isArray(value)) {
              // 如果内部还是数组
              dependArray(value); // 遍历 + 递归数组，对数组不同层级的所有数组元素 进行依赖收集
            }
          }
        }

        return value;
      },
      set: function set(newVal) {
        if (newVal === value) return; // 对新数据进行观察

        observe(newVal);
        value = newVal;
        console.log('-------------------数据更新，通知watchers更新-------------------');
        dep.notify(); // 通知dep存放的watcher去更新--派发更新
      }
    });
  } // 递归收集数组依赖


  function dependArray(value) {
    for (var e, i = 0, l = value.length; i < l; i++) {
      e = value[i]; // 对每一项进行依赖收集

      e && e.__ob__ && e.__ob__.dep.depend();

      if (Array.isArray(e)) {
        // 【递归】如果数组里面还有数组，就递归去收集依赖
        dependArray(e);
      }
    }
  }

  function observe(data) {
    // 如果是object类型（对象或数组）才观测；第一次调用observe(vm.$options._data)时，_data一定是个对象，官方要求的写法（data函数返回一个对象）
    if (!isObject(data)) {
      return;
    } // 如果已经是响应式的数据，直接return


    if (data.__ob__) {
      return data.__ob__;
    } // 返回经过响应式处理之后的data


    return new Observer(data);
  }

  /**
   * 数据初始化：initProps、initMethod、initData、initComputed、initWatch
   */
  function initState(vm) {
    var opts = vm.$options;

    if (opts.props) ;

    if (opts.methods) ;

    if (opts.data) {
      // 初始化data
      initData(vm);
    }

    if (opts.computed) ;

    if (opts.watch) ;

    function initData(vm) {
      var data = vm.$options.data; // 往实例上添加一个属性 _data，即传入的data
      // vue组件data推荐使用函数 防止数据在组件之间共享

      data = vm._data = isFunction(data) ? data.call(vm) : data; // 将vm._data上的所有属性代理到 vm 上

      for (var key in data) {
        proxy(vm, "_data", key);
      } // 对数据进行观测 -- 数据响应式


      observe(data);
    }


    function proxy(vm, source, key) {
      Object.defineProperty(vm, key, {
        get: function get() {
          return vm[source][key];
        },
        set: function set(newValue) {
          vm[source][key] = newValue;
        }
      });
    }
  }

  // 以下为vue源码的正则
  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; //匹配标签名；形如 abc-123

  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); //匹配特殊标签;形如 abc:234,前面的abc:可有可无；获取标签名；

  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 匹配标签开头；形如  <  ；捕获里面的标签名

  var startTagClose = /^\s*(\/?)>/; // 匹配标签结尾，形如 >、/>

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配结束标签 如 </abc-123> 捕获里面的标签名

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性  形如 id="app"

  function parse(template) {
    /**
     * handleStartTag、handleEndTag、handleChars将初始解析的结果，组装成一个树结构。
     * 使用栈结构构建AST树
     */
    var root; // 根节点

    var currentParent; // 下一个子元素的父元素

    var stack = []; // 栈结构；栈中push/pop元素节点，对于文本节点，直接push到currentParent.children即可，不用push到栈中
    // 表示元素和文本的type

    var ELEMENT_TYPE = 1;
    var TEXT_TYPE = 3; // 创建AST节点

    function createASTElement(tagName, attrs) {
      return {
        tag: tagName,
        type: ELEMENT_TYPE,
        children: [],
        attrs: attrs,
        parent: null
      };
    } // 对开始标签进行处理


    function handleStartTag(_ref) {
      var tagName = _ref.tagName,
          attrs = _ref.attrs;
      var element = createASTElement(tagName, attrs); // 如果没有根元素，则当前元素即为根元素

      if (!root) {
        root = element;
      }

      currentParent = element; // 将元素放入栈中

      stack.push(element);
    } // 对结束标签进行处理


    function handleEndTag(tagName) {
      // 处理到结束标签时，将该元素从栈中移出
      var element = stack.pop();

      if (element.tag !== tagName) {
        throw new Error('标签名有误');
      } // currentParent此时为element的上一个元素


      currentParent = stack[stack.length - 1]; // 建立parent和children关系

      if (currentParent) {
        element.parent = currentParent;
        currentParent.children.push(element);
      }
    } // 对文本进行处理


    function handleChars(text) {
      // 去掉空格
      text = text.replace(/\s/g, "");

      if (text) {
        currentParent.children.push({
          type: TEXT_TYPE,
          text: text
        });
      }
    }
    /**
     * 递归解析template，进行初步处理
     * 解析开始标签，将结果{tagName, attrs} 交给 handleStartTag 处理
     * 解析结束标签，将结果 tagName 交给 handleEndTag 处理
     * 解析文本门将结果 text 交给 handleChars 处理
     */


    while (template) {
      // 查找 < 的位置，根据它的位置判断第一个元素是什么标签
      var textEnd = template.indexOf("<"); // 当第一个元素为 '<' 时，即碰到开始标签/结束标签时

      if (textEnd === 0) {
        // 匹配开始标签<div> 或 <image/>
        var startTagMatch = parseStartTag();

        if (startTagMatch) {
          handleStartTag(startTagMatch);
          continue; // continue 表示跳出本次循环，进入下一次循环
        } // 匹配结束标签</div>


        var endTagMatch = template.match(endTag);

        if (endTagMatch) {
          // endTagMatch如果匹配成功，其格式为数组：['</div>', 'div']
          advance(endTagMatch[0].length);
          handleEndTag(endTagMatch[1]);
          continue;
        }
      } // 当第一个元素不是'<'，即第一个元素是文本时


      var text = void 0;

      if (textEnd >= 0) {
        // 获取文本
        text = template.substring(0, textEnd);
      }

      if (text) {
        advance(text.length);
        handleChars(text);
      }
    } // 解析开始标签


    function parseStartTag() {
      // 1. 匹配开始标签
      var start = template.match(startTagOpen); // start格式为数组，形如 ['<div', 'div']；第二项为标签名

      if (start) {
        var match = {
          tagName: start[1],
          attrs: []
        }; //匹配到了开始标签，就把 <tagname 截取掉，往后继续匹配属性

        advance(start[0].length); // 2. 开始递归匹配标签属性
        // end代表结束符号 > ；如果匹配成功，格式为：['>', '']
        // attr 表示匹配的属性

        var end, attr; // 不是标签结尾，并且能匹配到属性时

        while (!(end = template.match(startTagClose)) && (attr = template.match(attribute))) {
          // attr如果匹配成功，也是一个数组，格式为：["class=\"myClass\"", "class", "=", "myClass", undefined, undefined]
          // attr[1]为属性名，attr[3]/attr[4]/attr[5]为属性值，取决于属性定义是双引号/单引号/无引号
          // 匹配成功一个属性，就在template上截取掉该属性，继续往后匹配
          advance(attr[0].length);
          attr = {
            name: attr[1],
            value: attr[3] || attr[4] || attr[5] //这里是因为正则捕获支持双引号（） 单引号 和无引号的属性值

          };
          match.attrs.push(attr);
        } // 3. 匹配到开始标签结尾


        if (end) {
          //   代表一个标签匹配到结束的>了 代表开始标签解析完毕
          advance(1);
          return match;
        }
      }
    } // 截取template字符串 每次匹配到了就【往前继续匹配】


    function advance(n) {
      template = template.substring(n);
    } // 返回生成的ast；root包含整个树状结构信息


    return root;
  }

  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // 匹配花括号 {{  }}；捕获花括号里面的内容

  function gen(node) {
    // 如果是元素类型
    if (node.type == 1) {
      // 【关键】递归创建
      return generate(node);
    } else {
      // else即文本类型
      var text = node.text; // 1. 如果text中不存在花括号变量表达式

      if (!defaultTagRE.test(text)) {
        // _v表示创建文本
        return "_v(".concat(JSON.stringify(text), ")");
      } // 正则是全局模式 每次需要重置正则的lastIndex属性，不然会引发匹配bug（defaultTagRE.exec()匹配完一次后，再次匹配为null，需要重置lastIndex）


      var lastIndex = defaultTagRE.lastIndex = 0;
      var tokens = [];
      var match, index; // 2. 如果text中存在花括号变量（使用while循环，是因为可能存在多个{{变量}}）

      while (match = defaultTagRE.exec(text)) {
        // match如果匹配成功，其结构为：['{{myValue}}', 'myValue', index: indexof({) ]
        // index代表匹配到的位置
        index = match.index; // 初始 lastIndex 为0，index > lastIndex 表示在{{ 前有普通文本

        if (index > lastIndex) {
          // 在tokens里面放入 {{ 之前的普通文本
          tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        } // tokens中放入捕获到的变量内容


        tokens.push("_s(".concat(match[1].trim(), ")")); // 匹配指针后移，移到 }} 后面

        lastIndex = index + match[0].length;
      } // 3. 如果匹配完了花括号，text里面还有剩余的普通文本，那么继续push


      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      } // _v表示创建文本


      return "_v(".concat(tokens.join("+"), ")");
    }
  } // 生成子节点：遍历children调用gen(item)，使用逗号拼接每一项的结果


  function getChildren(el) {
    var children = el.children;

    if (children) {
      return "".concat(children.map(function (c) {
        return gen(c);
      }).join(","));
    }
  } // 处理attrs/props属性：将[{name: 'class', value: 'home'}, {name: 'style', value: "font-size:12px;color:red"}]
  //                  转化成 "class:"home",style:{"font-size":"12px","color":"red"}"


  function genProps(attrs) {
    var str = "";

    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i]; // 对attrs属性里面的style做特殊处理

      if (attr.name === "style") {
        (function () {
          var obj = {};
          attr.value.split(";").forEach(function (item) {
            var _item$split = item.split(":"),
                _item$split2 = _slicedToArray(_item$split, 2),
                key = _item$split2[0],
                value = _item$split2[1];

            obj[key] = value;
          });
          attr.value = obj;
        })();
      }

      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
    }

    return "{".concat(str.slice(0, -1), "}");
  } // 将ast转化成render函数


  function generate(ast) {
    var children = getChildren(ast);
    var code = "_c('".concat(ast.tag, "',").concat(ast.attrs.length ? "".concat(genProps(ast.attrs)) : "undefined").concat(children ? ",".concat(children) : "", ")");
    return code;
  }

  function compileToFunctions(template) {
    // 1. 把template转成AST语法树；AST用来描述代码本身形成树结构，不仅可以描述html，也能描述css以及js语法
    var ast = parse(template);
    console.log("AST", ast); // 2. 优化静态节点
    // 这个有兴趣的可以去看源码  不影响核心功能就不实现了
    //   if (options.optimize !== false) {
    //     optimize(ast, options);
    //   }
    // 3. 通过ast，重新生成代码
    // 我们最后生成的代码需要和render函数一样
    // 类似_c('div',{id:"app"},_c('div',undefined,_v("hello"+_s(name)),_c('span',undefined,_v("world"))))
    // _c代表创建元素 _v代表创建文本 _s代表文Json.stringify--把对象解析成文本

    var code = generate(ast);
    console.log("code", code); // 通过new Function生成函数

    var renderFn = new Function("with(this){return ".concat(code, "}"));
    return renderFn;
  }

  function patch(oldVnode, vnode, vm) {
    // 如果没有el，也没有oldVnode
    if (!oldVnode) {
      // 组件的创建过程是没有el属性的
      return createElm(vnode);
    } else {
      // Vnode没有设置nodeType，值为undefined；真实节点可以获取到nodeType
      var isRealElement = oldVnode.nodeType; // 如果是初次渲染

      if (isRealElement) {
        var oldElm = oldVnode;
        var parentElm = oldElm.parentNode; // 将虚拟dom转化成真实dom节点

        var el = createElm(vnode); // 插入到 老的el节点 的下一个节点的前面，就相当于插入到老的el节点的后面
        // 这里不直接使用父元素appendChild是为了不破坏替换的位置

        parentElm.insertBefore(el, oldElm.nextSibling); // 删除老的el节点

        parentElm.removeChild(oldVnode);
        return el;
      } else {
        // 如果是更新视图
        var _el = createElm(vnode);

        var _oldVnode = vm.$el; // vm.$el在初次渲染时赋值的

        var _parentElm = _oldVnode.parentNode;

        _parentElm.insertBefore(_el, _oldVnode.nextSibling);

        _parentElm.removeChild(_oldVnode); // TODO....diff算法

      }
    }
  } // 虚拟dom转成真实dom

  function createElm(vnode) {
    var tag = vnode.tag;
        vnode.data;
        vnode.key;
        var children = vnode.children,
        text = vnode.text; // 判断虚拟dom 是元素节点还是文本节点（文本节点tag为undefined）

    if (typeof tag === "string") {
      // 虚拟dom的el属性指向真实dom，方便后续更新diff算法操作
      vnode.el = document.createElement(tag); // 解析vnode属性

      updateProperties(vnode); // 如果有子节点就递归插入到父节点里面

      children.forEach(function (child) {
        return vnode.el.appendChild(createElm(child));
      });
    } else {
      vnode.el = document.createTextNode(text);
    }

    return vnode.el;
  } // 解析vnode的data属性，映射到真实dom上


  function updateProperties(vnode) {
    var oldProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var newProps = vnode.data || {};
    var el = vnode.el; // 真实节点
    // 如果新的节点没有 需要把老的节点属性移除

    for (var k in oldProps) {
      if (!newProps[k]) {
        el.removeAttribute(k);
      }
    } // 对style样式做特殊处理 如果新的没有 需要把老的style值置为空


    var newStyle = newProps.style || {};
    var oldStyle = oldProps.style || {};

    for (var key in oldStyle) {
      if (!newStyle[key]) {
        el.style[key] = "";
      }
    } // 遍历新的属性 进行增加操作


    for (var _key in newProps) {
      if (_key === "style") {
        for (var styleName in newProps.style) {
          el.style[styleName] = newProps.style[styleName];
        }
      } else if (_key === "class") {
        el.className = newProps["class"];
      } else {
        // 给这个元素添加属性 值就是对应的值
        el.setAttribute(_key, newProps[_key]);
      }
    }
  }

  var callbacks = [];

  function flushCallbacks() {
    callbacks.forEach(function (cb) {
      return cb();
    });
    waiting = false;
  }

  var waiting = false;
  /**
   * 流程：
   * 1. watcher更新流程：
   *       ——> watcher.update()
   *       ——> queueWatcher(watcher)
   *       ——> 对watcher去重，并将watcher放到一个数组中；最后执行 nextTick(flushSchedulerQueue)（flushSchedulerQueue的作用是遍历watcher数组，调用watcher.run()）
   *       ——> 将 flushSchedulerQueue 放入一个 回调函数数组callbacks 中；定义一个微任务：flushCallbacks(callbacks)；
   * 2. vm.$nextTick(cb)：
   *       ——> 直接会执行Vue原型上的$nextTick()方法，即nextTick(cb)方法
   *       ——> 将cb 放入 上述的回调函数数组 callbacks 中，紧接着上述的flushSchedulerQueue，在微任务中一并执行
   *       ——> 由于在flushSchedulerQueue中会执行 watcher.run() 创建真实DOM，所以可以在$nextTick()回调中获取到最新DOM节点
   * 
   * 总结：
   * 1. callbacks 中包含 flushSchedulerQueue，以及$nextTick()的回调
   * 2. dep.subs中每个watcher执行update时，最后都会执行nextick，
   * 3. 执行nextick是否会创建微任务，取决于上一个微任务是否完成
   * 4. 执行微任务在UI渲染完成之前，为何能拿到页面dom？：：：$nextTick()回调中获取的时内存中的DOM，不关心UI有没有渲染完成
   */

  function nextTick(cb) {
    callbacks.push(cb);

    if (!waiting) {
      // 异步执行callBacks
      Promise.resolve().then(flushCallbacks);
      waiting = true;
    }
  }

  var queue = [];
  var has = {}; // 维护存放了哪些watcher

  /**
   * queueWatcher逻辑：
   * 1. 对watcher去重（有相同watcher的情况下，不重复push）
   * 2. 防抖：一段时间内只执行一次的更新（遍历所有watcher，执行watcher.run()）
   */

  function queueWatcher(watcher) {
    var id = watcher.id; // watcher去重，即相同watcher只push一次

    if (!has[id]) {
      //  同步代码执行 把全部的watcher都放到队列里面去
      queue.push(watcher);
      has[id] = true; // 开启一次异步更新操作，批处理（防抖）
      // 进行异步调用

      nextTick(flushSchedulerQueue);
    }
  }

  function flushSchedulerQueue() {
    for (var index = 0; index < queue.length; index++) {
      // 调用watcher的run方法，执行真正的更新操作
      queue[index].run();
    } // 执行完之后清空队列


    queue = [];
    has = {};
  }

  var id = 0;

  var Watcher = /*#__PURE__*/function () {
    function Watcher(vm, exprOrFn, cb, options) {
      _classCallCheck(this, Watcher);

      this.vm = vm;
      this.exprOrFn = exprOrFn;
      this.cb = cb;
      this.options = options;
      this.id = id++; // watcher的唯一标识

      this.deps = []; //存放dep的容器

      this.depsId = new Set(); //用来去重dep

      this.getter = exprOrFn;
      this.get();
    } // new Watcher时会执行get方法；之后数据更新时，直接手动调用get方法即可


    _createClass(Watcher, [{
      key: "get",
      value: function get() {
        // 把当前watcher放到全局栈，并设置Dep.target（无法继承，具唯一性）为当前watcher
        pushTarget(this);
        /**
         * 执行exprOrFn，如果watcher是渲染watcher，则exprOrFn为vm._update(vm._render())
         * 在执行render函数的时候，获取变量会触发属性的getter（定义在对象数据劫持中），在getter中进行依赖收集
         */

        var res = this.getter.call(this.vm); // 执行完getter就把当前watcher删掉，以防止用户在methods/生命周期中访问data属性时进行依赖收集（数据劫持时会判断Dep.target是否存在）

        popTarget(); // 在调用方法之后把当前watcher实例从全局watcher栈中移除，设置Dep.target为新的栈顶watcher

        return res;
      }
      /**
       * 1. 保证dep唯一，因为在render过程中，同一属性可能被多次调用，只需收集一次依赖即可；另外初始渲染收集过的dep，在更新时也不用再次收集（通过dep的id来判断）
       * 2. 将dep放到watcher中的deps数组中
       * 3. 在dep实例中添加watcher
       */

    }, {
      key: "addDep",
      value: function addDep(dep) {
        var id = dep.id;

        if (!this.depsId.has(id)) {
          this.depsId.add(id); // 将dep放到watcher中的deps数组中

          this.deps.push(dep);
          console.log("watcher.deps", this.deps); // 直接调用dep的addSub方法  把自己watcher实例添加到dep的subs容器里面

          dep.addSub(this);
        }
      } // 更新当前watcher相关的视图
      // Vue中的更新是异步的

    }, {
      key: "update",
      value: function update() {
        // 每次watcher进行更新的时候，可以让他们先缓存起来，之后再一起调用
        // 异步队列机制
        queueWatcher(this);
      }
    }, {
      key: "run",
      value: function run() {
        // TODO 其他功能扩展
        this.getter.call(this.vm);
      }
    }]);

    return Watcher;
  }();

  function lifecycleMixin(Vue) {
    // _update：初始挂载及后续更新
    // 更新的时候，不会重新进行模板编译，因为更新只是数据发生变化，render函数没有改变。
    Vue.prototype._update = function (vnode) {
      var vm = this;
      var prevVnode = vm._vnode; // 保留上一次的vnode

      vm._vnode = vnode; // 获取本次的vnode
      // 【核心】patch是渲染vnode为真实dom

      if (!prevVnode) {
        // 初次渲染
        vm.$el = patch(vm.$el, vnode); // 初次渲染 vm._vnode肯定不存在 要通过虚拟节点 渲染出真实的dom 赋值给$el属性
      } else {
        // 视图更新
        vm.$el = patch(prevVnode, vnode, vm); // 更新时把上次的vnode和这次更新的vnode穿进去 进行diff算法
      }
    };
  }
  /**
   * 1. 调用render方法，生成虚拟DOM —— 即执行 vm._render()
   * 2. 将VNode渲染成真实DOM —— 即执行 vm._update(VNode)
   */

  function mountComponent(vm, el) {
    vm.$el = el; // 执行beforeMount生命周期钩子

    callHook(vm, "beforeMount");

    var updateComponent = function updateComponent() {
      vm._update(vm._render());
    }; // 每个组件渲染的时候，都会创建一个watcher，并执行updateComponent；true表示是渲染Watcher


    new Watcher(vm, updateComponent, function () {
      console.log('视图更新了');
      callHook(vm, "beforeUpdate");
    }, true);
    callHook(vm, "mounted");
  }
  function callHook(vm, hook) {
    // 依次执行生命周期对应的方法
    var handlers = vm.$options[hook];

    if (handlers) {
      for (var i = 0; i < handlers.length; i++) {
        handlers[i].call(vm); //生命周期里面的this指向当前实例
      }
    }
  }

  /**
   * initMixin
   * 表示在vue的基础上做一次混合操作
   */
  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      // this指向实例
      var vm = this;
      vm.$options = options; // 后面会对options进行扩展

      callHook(vm, "beforeCreate"); // 初始化状态，包括initProps、initMethod、initData、initComputed、initWatch等

      initState(vm);
      callHook(vm, "created"); // 如果有el属性 进行模板渲染

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      // $mount 由vue实例调用，所以this指向vue实例
      var vm = this;
      var options = vm.$options;
      el = document.querySelector(el);
      /**
       * 1. 把模板转化成render函数
       * 2. 执行render函数，生成VNode
       * 3. 更新时进行diff
       * 4. 产生真实DOM
       */
      // 可以直接在options中写render函数，它的优先级比template高

      if (!options.render) {
        var template = options.template; // 如果不存在render和template但是存在el属性，则直接将template赋值为el元素

        if (!template && el) {
          template = el.outerHTML;
        } // 最终需要把tempalte模板转化成render函数


        if (template) {
          // 将template转化成render函数
          var render = compileToFunctions(template);
          options.render = render;
        }
      } // 调用render方法，渲染成真实DOM
      // 组件挂载方法


      return mountComponent(vm, el);
    };
  }

  function isReservedTag(tagName) {
    // 定义常见标签
    var str = "html,body,base,head,link,meta,style,title," + "address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section," + "div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul," + "a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby," + "s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video," + "embed,object,param,source,canvas,script,noscript,del,ins," + "caption,col,colgroup,table,thead,tbody,td,th,tr," + "button,datalist,fieldset,form,input,label,legend,meter,optgroup,option," + "output,progress,select,textarea," + "details,dialog,menu,menuitem,summary," + "content,element,shadow,template,blockquote,iframe,tfoot";
    var obj = {};
    str.split(",").forEach(function (tag) {
      obj[tag] = true;
    });
    return obj[tagName];
  }

  var Vnode = /*#__PURE__*/_createClass(
  /**
   * @param {标签名} tag
   * @param {属性} data
   * @param {标签唯一的key} key
   * @param {子节点} children
   * @param {文本节点} text
   * @param {组件节点的其他属性} componentOptions
   */
  function Vnode(tag, data, key, children, text, componentOptions) {
    _classCallCheck(this, Vnode);

    // console.log(
    //   "🚀 ~ file: index.js ~ line 5 ~ Vnode ~ constructor ~ componentOptions",
    //   componentOptions
    // );
    this.tag = tag;
    this.data = data;
    this.key = key;
    this.children = children;
    this.text = text;
    this.componentOptions = componentOptions;
  }); // 创建元素vnode
  function createElement(vm, tag) {
    var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var key = data.key; // 如果是普通标签

    for (var _len = arguments.length, children = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      children[_key - 3] = arguments[_key];
    }

    if (isReservedTag(tag)) {
      return new Vnode(tag, data, key, children);
    } else {
      console.log("将自定义组件render函数解析成Vnode"); // 否则就是组件

      vm.$options.components[tag]; //获取组件的构造函数

      return createComponent();
    }
  } // 组件处理

  function createComponent(vm, tag, data, key, children, Ctor) {// todo...如果 _c(tag,...) 创建的是自定义组件，如何处理？
    //   if (isObject(Ctor)) {
    //     Ctor = vm.$options._base.extend(Ctor);
    //   }
  } // 创建文本vnode


  function createTextNode(vm, text) {
    return new Vnode(undefined, undefined, undefined, undefined, text);
  }

  function renderMixin(Vue) {
    Vue.prototype._c = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      // 创建虚拟dom元素
      return createElement.apply(void 0, [this].concat(args));
    };

    Vue.prototype._v = function (text) {
      // 创建虚拟dom文本
      return createTextNode(this, text);
    };

    Vue.prototype._s = function (val) {
      // 如果模板里面的是一个对象，需要JSON.stringify
      return val == null ? "" : _typeof(val) === "object" ? JSON.stringify(val) : val;
    };

    Vue.prototype._render = function () {
      var vm = this; // 获取模板编译生成的render方法

      var render = vm.$options.render; // 生成vnode--虚拟dom

      var vnode = render.call(vm);
      console.log("🚀 ~ file: render.js ~ renderMixin ~ _render ~ vnode", vnode);
      return vnode;
    }; // 挂载在原型的nextTick方法


    Vue.prototype.$nextTick = nextTick;
  }

  function Vue(options) {
    // new Vue创建实例时会调用_init()方法
    this._init(options);
  }

  initMixin(Vue); // 在原型上挂载_init()（数据监控；props、events、computed、watch初始化等）、$mount()（compiler流程）方法

  lifecycleMixin(Vue); // 在原型上挂载 _update()方法（第一次创建dom及更新dom（有diff过程））

  renderMixin(Vue); //  在原型上挂载_c、_v、_s、$nextTick、_render()方法

  return Vue;

}));
//# sourceMappingURL=vue.js.map
