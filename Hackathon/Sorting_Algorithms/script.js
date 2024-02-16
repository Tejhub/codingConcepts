HTMLElement.prototype.hasClassName = function (name) {
  return new RegExp('(\\s|^)' + name + '(\\s|$)').test(this.className);
};

HTMLElement.prototype.addClass = function (name) {
  if (!this.hasClassName(name)) {
    this.className += ' ' + name;
  }
};

HTMLElement.prototype.removeClass = function (name) {
  if (this.hasClassName(name)) {
    var reg = new RegExp('(\\s|^)' + name + '(\\s|$)');
    this.className = this.className.replace(reg, ' ').trim();
  }
};

HTMLElement.prototype.toggleClass = function (name) {
  if (this.hasClassName(name)) {
    this.removeClass(name);
  } else {
    this.addClass(name);
  }
};

HTMLElement.prototype.findChildrenByClassName = function (className) {
  var result = [];

  var childNodes = this.childNodes;
  var childNodeLen = childNodes.length;

  for (var i = 0; i < childNodeLen; i++) {
    if (childNodes[i].className === className) {
      result.push(childNodes[i]);
    }
  }

  return result;
};

class Slider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      curIndex: this.props.curIndex };


    this.handleKeyup = this.handleKeyup.bind(this);
    this.navigate = this.navigate.bind(this);
    this.dir = '';
  }

  handleKeyup(ev) {
    var keyCode = ev.keyCode || ev.which;
    switch (keyCode) {
      case 37:
        this.navigate('left');
        break;
      case 39:
        this.navigate('right');
        break;}

  }

  componentDidMount() {
    document.addEventListener('keyup', this.handleKeyup);
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.handleKeyup);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.curIndex !== nextState.curIndex;
  }

  componentDidUpdate() {
    var nextItem = this.refs['item__' + this.state.curIndex];
    var nextTitle = nextItem.findChildrenByClassName('title')[0];
    var nextDescription = nextItem.findChildrenByClassName('description')[0];

    /** set the right properties for the next element to come in */
    dynamics.css(nextItem, { opacity: 1, visibility: 'visible' });
    dynamics.css(nextTitle, {
      opacity: 0,
      translateX: this.dir === 'right' ? nextTitle.offsetWidth / 2 : -1 * nextTitle.offsetWidth / 2,
      rotateZ: this.dir === 'right' ? 10 : -10 });


    /** animate the next title in */
    dynamics.animate(nextTitle, { opacity: 1, translateX: 0 }, {
      type: dynamics.spring,
      duration: 2000,
      friction: 600,
      complete: function () {
      } });


    /** set the right properties for the next description to come in */
    dynamics.css(nextDescription, {
      translateX: this.dir === 'right' ? 250 : -250,
      opacity: 0 });


    /** animate the next description in */
    dynamics.animate(nextDescription, { translateX: 0, opacity: 1 }, {
      type: dynamics.bezier,
      points: [{ "x": 0, "y": 0, "cp": [{ "x": 0.2, "y": 1 }] }, { "x": 1, "y": 1, "cp": [{ "x": 0.3, "y": 1 }] }],
      duration: 650 });

  }

  navigate(dir) {
    this.dir = dir;

    var total = this.props.items.length;
    var current = this.state.curIndex;
    var curItem = this.refs['item__' + current];
    var curTitle = curItem.findChildrenByClassName('title')[0];
    var curDescription = curItem.findChildrenByClassName('description')[0];
    var next = this.dir === 'right' ? (current + 1) % total : current - 1 < 0 ? (current + total - 1) % total : current - 1;

    /** animate the current title out */
    dynamics.animate(curTitle, {
      opacity: 0,
      translateX: this.dir === 'right' ? -1 * curTitle.offsetWidth / 2 : curTitle.offsetWidth / 2,
      rotateZ: this.dir === 'right' ? -10 : 10 },
    {
      type: dynamics.spring,
      duration: 2000,
      friction: 600,
      complete: function () {
        dynamics.css(curItem, {
          opacity: 0,
          visibility: 'hidden' });

      } });


    /** animate the current description out */
    dynamics.animate(curDescription, {
      translateX: this.dir === 'right' ? -250 : 250,
      opacity: 0 },
    {
      type: dynamics.bezier,
      points: [{ "x": 0, "y": 0, "cp": [{ "x": 0.2, "y": 1 }] }, { "x": 1, "y": 1, "cp": [{ "x": 0.3, "y": 1 }] }],
      duration: 450 });


    setTimeout(function () {
      this.setState({
        curIndex: next });

    }.bind(this), 200);
  }

  render() {
    var items = [];
    this.props.items.forEach((ele, index) => {
      items.push( /*#__PURE__*/React.createElement("li", { key: index, ref: 'item__' + index, className: 'content__item' + (index == this.state.curIndex ? ' content__item--current' : '') }, /*#__PURE__*/
      React.createElement("div", { className: "title", dangerouslySetInnerHTML: { __html: ele.title } }), /*#__PURE__*/
      React.createElement("div", { className: "description", dangerouslySetInnerHTML: { __html: ele.description } })));

    });

    return /*#__PURE__*/(
      React.createElement("div", { className: "slider__container" }, /*#__PURE__*/
      React.createElement("ul", { className: "slider__contents" },
      items, /*#__PURE__*/
      React.createElement("li", { className: "slider__button slider__button--left fa fa-angle-left", onClick:
        function () {
          this.navigate('left');
        }.bind(this) }), /*#__PURE__*/

      React.createElement("li", { className: "slider__button slider__button--right fa fa-angle-right", onClick:
        function () {
          this.navigate('right');
        }.bind(this) }))));




  }}


Slider.defaultProps = {
  items: [
  {
    title: 'item1',
    description: 'the item 1 of the slider' },
  {
    title: 'item2',
    description: 'the item 2 of the slider' },
  {
    title: 'item3',
    description: 'the item 3 of the slider' }],


  curIndex: 0 };


Slider.propTypes = {
  items: React.PropTypes.arrayOf(React.PropTypes.objectOf({
    title: React.PropTypes.string,
    description: React.PropTypes.string })),

  curIndex: React.PropTypes.number };


class Sort extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: this.props.data };


    this.animationList = [];
    this.isRunning = false;

    /** interfaces */
    this.swapInterface = this.swapInterface.bind(this);
    this.insertInterface = this.insertInterface.bind(this);

    this.callback = this.callback.bind(this);
  }

  componentDidUpdate() {
    /** clear transform */
    var len = this.props.data.length;

    for (var i = 0; i < len; i++) {
      var target = this.refs['item__' + i];
      var targetStyle = target.style;

      target.toggleClass('item__transition');
      targetStyle.transform = 'none';
      targetStyle.WebkitTransform = 'none';

      setTimeout(function (t) {
        return function () {
          t.toggleClass('item__transition');
        };
      }(target), 400);
    }
  }

  swapInterface(arr, replaced, replacement) {
    this.animationList.push({
      arr,
      replaced,
      replacement,
      type: 'swap' });

  }

  markPosInterface(index) {
    this.animationList.push({
      index,
      type: 'markPos' });

  }

  insertInterface(arr, from, to) {
    this.animationList.push({
      arr,
      from,
      to,
      type: 'insert' });

  }

  callback() {
    var index = 0;
    var recursivePreview = function (i) {
      var animationList = this.animationList;

      if (i >= animationList.length) {
        this.isRunning = false;
        this.refs['reset__button'].toggleClass('button--disabled');
        this.refs['run__button'].toggleClass('button--disabled');
        return;
      }

      /** animation */
      var nextStep = i + 1;
      var dur = 300;
      var data = animationList[i].arr;

      switch (animationList[i].type) {
        case 'swap':
          var replacedIndex = animationList[i].replaced;
          var replacementIndex = animationList[i].replacement;
          var replacedMoveX = 52 * -(replacedIndex - replacementIndex);
          var replacementMoveX = 52 * (replacedIndex - replacementIndex);

          var replacedEle = this.refs['item__' + animationList[i].replaced];
          var replacementEle = this.refs['item__' + animationList[i].replacement];

          var replacedStyle = replacedEle.style;
          var replacementStyle = replacementEle.style;

          /** move up */
          replacementStyle.transform = 'translate(0, -50px)';
          replacementStyle.WebkitTransform = 'translate(0, -50px)';

          if (Math.abs(replacedIndex - replacementIndex) > 1) {
            replacedStyle.transform = 'translate(0, 50px)';
            replacedStyle.WebkitTransform = 'translate(0, 50px)';
          }

          /** move */
          setTimeout(function () {
            replacementStyle.transform = 'translate(' + replacementMoveX + 'px, -50px)';
            replacementStyle.WebkitTransform = 'translate(' + replacementMoveX + 'px, -50px)';

            if (Math.abs(replacedIndex - replacementIndex) > 1) {
              replacedStyle.transform = 'translate(' + replacedMoveX + 'px, 50px)';
              replacedStyle.WebkitTransform = 'translate(' + replacedMoveX + 'px, 50px)';
            }

            setTimeout(function () {
              /** move down */
              replacementStyle.transform = 'translate(' + replacementMoveX + 'px, 0)';
              replacementStyle.WebkitTransform = 'translate(' + replacementMoveX + 'px, 0)';

              replacedStyle.transform = 'translate(' + replacedMoveX + 'px, 0)';
              replacedStyle.WebkitTransform = 'translate(' + replacedMoveX + 'px, 0)';

              setTimeout(function () {
                this.setState({
                  data });


                setTimeout(function () {
                  recursivePreview(nextStep);
                }, 400);
              }.bind(this), dur);
            }.bind(this), dur);
          }.bind(this), dur);
          break;
        case 'insert':
          var fromIndex = animationList[i].from;
          var toIndex = animationList[i].to;
          var fromMoveX = 52 * (toIndex - fromIndex);
          var toMoveX = 52 * (toIndex - fromIndex < 0 ? 1 : -1);

          var fromEle = this.refs['item__' + animationList[i].from];
          var toEle = this.refs['item__' + animationList[i].to];

          var fromStyle = fromEle.style;
          var toStyle = toEle.style;

          var start = toIndex > fromIndex ? fromIndex + 1 : toIndex;
          var end = toIndex > fromIndex ? toIndex : fromIndex - 1;

          /** move up */
          fromStyle.transform = 'translate(0, -50px)';
          fromStyle.WebkitTransform = 'translate(0, -50px)';

          /** move */
          setTimeout(function () {
            fromStyle.transform = 'translate(' + fromMoveX + 'px, -50px)';
            fromStyle.WebkitTransform = 'translate(' + fromMoveX + 'px, -50px)';

            setTimeout(function () {
              /** move down */
              fromStyle.transform = 'translate(' + fromMoveX + 'px, 0)';
              fromStyle.WebkitTransform = 'translate(' + fromMoveX + 'px, 0)';

              for (var i = start; i <= end; i++) {
                this.refs['item__' + i].style.transform = 'translate(' + toMoveX + 'px, 0)';
                this.refs['item__' + i].style.WebkitTransform = 'translate(' + toMoveX + 'px, 0)';
              }

              setTimeout(function () {
                this.setState({
                  data });


                setTimeout(function () {
                  recursivePreview(nextStep);
                }, 400);
              }.bind(this), dur);
            }.bind(this), dur);
          }.bind(this), dur);
          break;
        case 'markPos':
          this.refs['item__' + animationList[i].index].addClass('item--fixed');

          setTimeout(function () {
            recursivePreview(nextStep);
          }.bind(this), dur);
          break;
        default:
          break;}

    }.bind(this);

    recursivePreview(index);
  }

  render() {
    var items = [];

    this.state.data.forEach((ele, index) => {
      items.push( /*#__PURE__*/React.createElement("li", { className: "item__transition data__item", key: index, ref: 'item__' + index, style: {
          transform: 'none',
          WebkitTransform: 'none' } },
      ele));
    });

    var sortIndex = 0;
    var sortTypesItems = [];

    this.props.sortTypes.forEach((ele, index) => {
      if (ele.title === this.props.sortType) {
        sortIndex = index;
      }

      sortTypesItems.push({
        title: ele.title,
        description: ele.description });

    });

    return /*#__PURE__*/(
      React.createElement("div", null, /*#__PURE__*/
      React.createElement("div", { className: "info__area" }, /*#__PURE__*/
      React.createElement("div", { className: "info__title" }, "Sorting Algorithms"), /*#__PURE__*/
      React.createElement("div", { className: "sort__types" }, /*#__PURE__*/
      React.createElement(Slider, { ref: "slider", items: sortTypesItems, curIndex: sortIndex }))), /*#__PURE__*/


      React.createElement("div", { className: "data__preview" }, /*#__PURE__*/
      React.createElement("ul", null,
      items)), /*#__PURE__*/


      React.createElement("div", { className: "button__area" }, /*#__PURE__*/
      React.createElement("div", { className: "button", ref: "reset__button", onClick:
        function () {
          if (this.isRunning) {
            return;
          }

          var len = this.props.data.length;

          for (var i = 0; i < len; i++) {
            this.refs['item__' + i].removeClass('item--fixed');
          }

          this.setState({
            data: this.props.data });

        }.bind(this) }, "Reset"), /*#__PURE__*/

      React.createElement("div", { className: "button", ref: "run__button", onClick:
        function () {
          if (this.isRunning) {
            return;
          }

          this.isRunning = true;
          this.refs['reset__button'].toggleClass('button--disabled');
          this.refs['run__button'].toggleClass('button--disabled');


          /** clear the swapping list */
          this.animationList = [];

          this.props.sortMethods[this.props.sortTypes[this.refs['slider'].state.curIndex].title].call(this, [].concat(this.state.data));
        }.bind(this) }, "Run"))));




  }}


Sort.defaultProps = {
  data: [2, 8, 7, 1, 3, 5, 6, 4],
  sortMethods: {
    bubble: function (arr) {
      var arrLen = arr.length;

      for (var i = 0; i < arrLen; i++) {
        for (var j = 0; j < arrLen - i; j++) {
          if (arr[j] > arr[j + 1]) {
            var tmp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = tmp;

            if (Object.prototype.toString.call(this.swapInterface).toLowerCase() === '[object function]') {
              this.swapInterface([].concat(arr), j + 1, j);
            }
          }
        }

        /** fixed the item */
        if (Object.prototype.toString.call(this.markPosInterface).toLowerCase() === '[object function]') {
          this.markPosInterface(arrLen - i - 1);
        }
      }

      if (Object.prototype.toString.call(this.callback).toLowerCase() === '[object function]') {
        /** callback for previewing when finished */
        this.callback();
      }
    },
    quick: function (arr) {
      var partition = function (arr, p, q) {
        var pivot = arr[q];

        var m = p;
        var n = m - 1;

        for (var i = p; i < q; i++) {
          if (arr[i] < pivot) {
            n++;

            if (i !== n) {
              var tmp = arr[i];
              arr[i] = arr[n];
              arr[n] = tmp;

              if (Object.prototype.toString.call(this.swapInterface).toLowerCase() === '[object function]') {
                this.swapInterface([].concat(arr), i, n);
              }
            }
          }
        }

        if (n + 1 !== q) {
          var tmp = arr[n + 1];
          arr[n + 1] = arr[q];
          arr[q] = tmp;

          if (Object.prototype.toString.call(this.swapInterface).toLowerCase() === '[object function]') {
            this.swapInterface([].concat(arr), n + 1, q);
          }

          /** fixed the item */
          if (Object.prototype.toString.call(this.markPosInterface).toLowerCase() === '[object function]') {
            this.markPosInterface(n + 1);
          }
        }

        return n + 1;
      }.bind(this);

      var quickSort = function (arr, p, q) {
        if (p < q) {
          var m = partition(arr, p, q);
          quickSort(arr, p, m - 1);
          quickSort(arr, m + 1, q);

          return;
        }
      };

      quickSort(arr, 0, arr.length - 1);

      if (Object.prototype.toString.call(this.callback).toLowerCase() === '[object function]') {
        /** callback for previewing when finished */
        this.callback();
      }
    },
    insert: function (arr) {
      var arrLen = arr.length;

      for (var i = 0; i < arrLen; i++) {
        for (var j = 0; j < i;) {
          if (arr[i] > arr[j]) {
            j++;
          } else {
            break;
          }
        }

        if (i !== j) {
          /** insert */
          arr.splice(j, 0, arr[i]);

          /** remove te original one */
          arr.splice(i + 1, 1);

          if (Object.prototype.toString.call(this.insertInterface).toLowerCase() === '[object function]') {
            /** callback for previewing when finished */
            this.insertInterface([].concat(arr), i, j);
          }
        }
      }

      for (var i = 0; i < arrLen; i++) {
        /** fixed the item */
        if (Object.prototype.toString.call(this.markPosInterface).toLowerCase() === '[object function]') {
          this.markPosInterface(i);
        }
      }

      if (Object.prototype.toString.call(this.callback).toLowerCase() === '[object function]') {
        /** callback for previewing when finished */
        this.callback();
      }
    },
    heap: function (arr) {
      var arrLen = arr.length;

      for (var i = 0; i < arrLen; i++) {
        /** build the min heap and extract the minimal item */
        for (var j = Math.floor((arrLen - i) / 2) - 1; j >= 0; j--) {
          /** loop for each root node */
          if (typeof arr[2 * j + 1 + i] !== undefined && arr[j + i] > arr[2 * j + 1 + i]) {
            var tmp = arr[j + i];
            arr[j + i] = arr[2 * j + 1 + i];
            arr[2 * j + 1 + i] = tmp;

            if (Object.prototype.toString.call(this.swapInterface).toLowerCase() === '[object function]') {
              this.swapInterface([].concat(arr), j + i, 2 * j + 1 + i);
            }
          }

          if (typeof arr[2 * j + 2 + i] !== undefined && arr[j + i] > arr[2 * j + 2 + i]) {
            var tmp = arr[j + i];
            arr[j + i] = arr[2 * j + 2 + i];
            arr[2 * j + 2 + i] = tmp;

            if (Object.prototype.toString.call(this.swapInterface).toLowerCase() === '[object function]') {
              this.swapInterface([].concat(arr), j + i, 2 * j + 2 + i);
            }
          }
        }

        /** fixed the item */
        if (Object.prototype.toString.call(this.markPosInterface).toLowerCase() === '[object function]') {
          this.markPosInterface(i);
        }
      }

      if (Object.prototype.toString.call(this.callback).toLowerCase() === '[object function]') {
        this.callback();
      }
    } },

  sortType: 'Quick Sort',
  sortTypes: [
  {
    title: 'Bubble Sort',
    description: 'The maximal item will be bubbled to the last position each time.' },
  {
    title: 'Quick Sort',
    description: 'Select a pivot each time, and find out items which is less than or greater than the pivor. As you can see in the following case, the <strong>pivot</strong> will be marked with gray background each time, and notice that, once the pivot is marked, it has already worked out two types of items, less ones and greater ones.' },
  {
    title: 'Insert Sort',
    description: 'Find and insert the item into a proper position each time. As you can see in the following case, it will loop from the start of the array to the end. In each loop, it will take a item and compare it with preceding items. After finishing the process, the item will be inserted into them.' },
  {
    title: 'Heap Sort',
    description: 'Heap is an abstract concept for organizing data in an array. Heap Sorting will generate a minimal heap each time, as followed case shown. After generated, the first item of the array should be the minimal one, which will be marked with gray background.' }] };




Sort.propTypes = {
  data: React.PropTypes.array,
  sortMethods: React.PropTypes.object,
  sortType: React.PropTypes.string,
  sortTypes: React.PropTypes.arrayOf(React.PropTypes.string) };


ReactDOM.render( /*#__PURE__*/
React.createElement(Sort, null),
document.querySelector('.content'));