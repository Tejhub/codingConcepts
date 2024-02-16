function randomValue(bottom, top) {
  return Math.floor( Math.random() * ( 1 + top - bottom ) ) + bottom;
}

function renderMove(move) {
  var node = document.createElement("li");
  let message = 'Move disc from ' + move.src + ' to ' + move.dst;
  var textnode = document.createTextNode(message);
  node.appendChild(textnode);
  $moves.prepend(node);
  let currentMoves = $moves.children().length;
  $numMoves.text(currentMoves + ' of ' + numMoves + ' ');
}

function move(src, dst) {
  ++numMoves;
  return { src, dst };
}

function solve(n, src, aux, dst) {
  if (n === 0) {
    return [];
  }
  else {
    let moves = solve(n-1, src, dst, aux);
    moves.push(move(src, dst));
    Array.prototype.push.apply(moves, solve(n-1, aux, src, dst));
    return moves;
  }
}

function towerMove(move) {
  const srcTower = $('#tower-' + move.src).first();
  const dstTower = $('#tower-' + move.dst).first();
  
  const $disk = srcTower.find(':last-child');
  const diskValue = $disk.data('value');

  if (debug) console.debug(`Picking up disk ${diskValue} from ${srcTower[0].id}`);
  $disk.addClass('hold');
  
  // drop disk in the future
  setTimeout( () => {
    if (debug) console.debug(`Dropping disk ${diskValue} on ${dstTower[0].id}`);
    renderMove(move);
    $disk.removeClass('hold');
    $disk.remove();
    dstTower.append($disk);
  }, delay / 2);
}

function clear() {
  numMoves = 0;
  $moves.html('');
}

function setupStartingTower() {
  $towers.html('');
  let startingTower = $towers.eq(0);
  for (var i = 1; i <= numDisks; i++) {
    startingTower.prepend($('<li class="disk disk-' + i + '" data-value="' + i + '"></li>'));
  }
}

function reset() {
  console.log('moveSubscription:', moveSubscription);
  if (moveSubscription) moveSubscription.unsubscribe();
  running = false;
  clear();
  setupStartingTower();
}

function startObservable(n, src, aux, dst) {
  const moves = solve(n, src, aux, dst);
  let source = Rx.Observable.from(moves).takeWhile(gameIsRunning)
  .concatMap(x => {
    return Rx.Observable.of(x).delay(randomValue(delay, delay + 100));
  });
  moveSubscription = source.subscribe(
    move => towerMove(move),
    err => console.log('ERROR:', err),
    () => {
      // setTimeout( () => celebrate( () => play(n, dst, aux, src) ), 1000 );
      if (running) {
        celebrate( () => {
          console.log('Starting next round');
          setTimeout( () => play(n, dst, aux, src), 1000 );          
        });
      }
    }
  );
}

function play(n, src, aux, dst) {
  clear();
  setTimeout( () => {
    console.log('=== Play ===');
    running = true;
    startObservable(n, src, aux, dst);
  }, 200);
}

function gameIsRunning() {
  return running;
}

function celebrate(cb) {
  swal({
    title: 'Round Complete!',
    text: "Boom Shaka Lak",
    type: 'success',
    allowEscapeKey: false,
    allowOutsideClick: false,
    confirmButtonColor: '#40ff40',
    confirmButtonText: 'Play again!',
    timer: 1000
  })
  .then(cb);
}

// model
let debug = false;
let numDisks = 7;
let numMoves = 0;
let delay = 200;
let running = false;
let moveSubscription = null;

let $towers = null;
let $moves = null;
let $numMoves = null;

console.clear();

$(document).ready(function() {  
  
  // rendering
  
  const $resetButton = document.getElementById('reset');
  const stop$ = Rx.Observable.fromEvent($resetButton, 'click');
  stop$.subscribe( e => {
    console.log("YOU CLICKED IT, DIDN'T YOU!");
    reset();
    play(numDisks, 'A', 'B', 'C');
  });
  
  const $slowButton = document.getElementById('slow');
  const slow$ = Rx.Observable.fromEvent($slowButton, 'click');
  slow$.subscribe( e => {
    console.log('setting delay to slow');
    delay = 2000;
  });
  
  const $fastButton = document.getElementById('fast');
  const fast$ = Rx.Observable.fromEvent($fastButton, 'click');
  fast$.subscribe( e => {
    console.log('setting delay to fast');
    delay = 200;
  });
  
  $towers = $('.tower');
  $moves = $('#moves');
  $numMoves = $('#numMoves');

  reset();
  play(numDisks, 'A', 'B', 'C');
  
  // Event Handlers
	$towers.on('click', function() {
		towerMove($(this));
	});
});