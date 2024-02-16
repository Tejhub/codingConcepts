/*

STACK

Abstract data type
LIFO - Last in, first out
Collection of elements with push and pop operations.
Note that there is a natural order. Elements are removed in the reverse order of their addition.

DO NOT use an array and the native push/pop method in your implementation. That's too easy, yeah? =P
Use an object as the underlying data structure.


*** Operations:

myStack.push(value)
=> count of stack
add value to collection

myStack.pop()
=> most recent element added collection
Remove item so that it is no longer in collection

myStack.peek()
=> most recent element added collection
Similiar to pop, but do not remove element from collection

myStack.count()
=> number of elements in stack


*** Additional Exercises:

Modify your stack to take a max capacity and return a string if you try to add an element when there's no more room:
myStack.push(value)
=> "Max capacity already reached. Remove element before adding a new one."

Create a contains method to check if a value is in the stack:
myStack.contains('findme')
=> true/false
What's the time complexity?

Create an until method to get the number of pops until you get to a certain value:
stack values - (first)2-5-7-3-6-9(last)
myStack.until(7)
=> 4
What's the time complexity?



 */
const $ = function (selector) {
  return document.querySelector(selector);
};
const $$ = function (selector, index) {
  return document.querySelectorAll(selector)[index];
};
const makeAbrick = function (el, text) {
  var brick = document.createElement('div');
  brick.className = 'brick';
  brick.textContent = text;
  var element = $(el);
  element.prepend(brick);
};
const blink = function (msg) {
  var message = document.createElement('p');
  message.textContent = msg;
  var main = $('main');
  main.prepend(message);
  setTimeout(() => {main.removeChild(main.firstChild);}, 1000);
};
const removeAbrick = function (el, child) {
  var element = el;
  element.removeChild(child);
};

function Stack(capacity) {
  this.capacity = capacity || Infinity;
  this.storage = {};
  this.count = 0;
}

function Queue(capacity) {
  this.capacity = capacity || Infinity;
  this.storage = {};
  this.head = 0;
  this.tail = 0;
}

Queue.prototype.enqueue = function (value) {
  if (this.count() < this.capacity) {
    this.storage[this.tail] = value;
    this.tail++;
    makeAbrick('#queue', value);
    return this.count();
  }
  return blink('Max capacity reached');
};

Queue.prototype.dequeue = function (value) {
  var value = this.storage[this.head];
  var toGo = $$('#queue .brick', this.count() - 1);
  toGo.classList.add('fadeOut');
  toGo.addEventListener("animationend", function (e) {
    removeAbrick($('#queue'), $$('#queue .brick', this.count() - 1));
    delete this.storage[this.head];
    this.head++;
    return value;
  }.bind(this));
};

Queue.prototype.count = function () {
  return this.tail - this.head;
};

Stack.prototype.push = function (value) {
  if (this.count < this.capacity) {
    this.storage[this.count++] = value;
    makeAbrick('#stack', value);
    return this.count;
  }
  return 'Max capacity reached';
};

Stack.prototype.pop = function () {
  const value = this.storage[--this.count];
  removeAbrick($('#stack'), $('.brick'));
  delete this.storage[this.count];
  return value;
};

Stack.prototype.peek = function () {
  return this.storage[this.count - 1];
};

Stack.prototype._count = function () {
  return this.count;
};

Stack.prototype._min = function () {
  let min = this.peek();
  console.log(min);
  for (let val in this.storage) {
    if (parseInt(val) < min) {min = parseInt(val);}
  }
  return min;
};

const myStack = new Stack(10);
const myQueue = new Queue(10);
myStack.push(0);
myStack.push(1);
myStack.push(2);
myQueue.enqueue('zero');


const push = $('#push');
push.addEventListener('click', function (e) {
  e.preventDefault();
  var text = $('input');
  myStack.push(text.value || myStack._count());
  text.value = '';
});

const pop = $('#pop');
pop.addEventListener('click', function (e) {
  e.preventDefault();
  myStack.pop();
});

const enqueue = $('#enqueue');
enqueue.addEventListener('click', function (e) {
  e.preventDefault();
  var text = $('input');
  myQueue.enqueue(text.value || myQueue.tail);
  text.value = '';
});

const dequeue = $('#dequeue');
dequeue.addEventListener('click', function (e) {
  e.preventDefault();
  myQueue.dequeue();
});

/*
*** Exercises:

1. Implement a stack with a min method which returns the minimum element currently in the stack. This method should have O(1) time complexity. Make sure your implementation handles duplicates.

2. Sort a stack so that its elements are in ascending order.

3. Given a string, determine if the parenthesis in the string are balanced.
Ex: balancedParens( 'sqrt(5*(3+8)/(4-2))' ) => true
Ex: balancedParens( 'Math.min(5,(6-3))(' ) => false

4. Towers of Hanoi - https://en.wikipedia.org/wiki/Tower_of_Hanoi
You are given three towers (stacks) and N disks, each of different size. You can move the disks according to three constraints:
   1. only one disk can be moved at a time
   2. when moving a disk, you can only use pop (remove the top element) and push (add to the top of a stack)
   3. no disk can be placed on top of a disk that is smaller than it
The disks begin on tower#1. Write a function that will move the disks from tower#1 to tower#3 in such a way that none of the constraints are violated.
 */

function Queue_two_stacks() {
  this.stackIn = new Stack();
  this.stackOut = new Stack();
}