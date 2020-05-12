const screen = document.getElementById('screen');
const context = screen.getContext('2d');

function createGame() {
  const state = {
    players: {},
    fruits: {}
  };

  function addPlayer(command) {
    const playerId = command.playerId;
    const playerX = command.playerX;
    const playerY = command.playerY;

    state.players[playerId] = {
      x: playerX,
      y: playerY
    };
  }

  function removePlayer(command) {
    delete state.players[command.playerId];
  }

  function addFruit(command) {
    const fruitId = command.fruitId;
    const fruitX = command.fruitX;
    const fruitY = command.fruitY;

    state.fruits[fruitId] = {
      x: fruitX,
      y: fruitY
    };
  }

  function removeFruit(command) {
    delete state.fruits[command.fruitId];
  }

  function checkCollision(playerId) {
    for (const fruitId in state.fruits) {
      if (state.fruits[fruitId].x === state.players[playerId].x && state.fruits[fruitId].y=== state.players[playerId].y) {
        removeFruit({ fruitId })
      }
    }
  }

  const movements = {
    ArrowUp: (player) => {
      if (player.y > 0) {
        player.y -= 1;
      }
    },
    ArrowDown: (player) => {
      if (player.y + 1 < screen.height) {
        player.y += 1;
      }
    },
    ArrowLeft: (player) => {
      if (player.x > 0) {
        player.x -= 1;
      }
    },
    ArrowRight: (player) => {
      if (player.x + 1 < screen.width){
        player.x += 1;
      }
    }
  }

  function movePlayer({ playerId, key }) {
    const player = state.players[playerId];
    try {
      if (player) {
        movements[key](player);
        checkCollision(playerId);
      }
    } catch (err) {
      console.log('That key has no rule');
    }
      }

  return {
    addPlayer,
    removePlayer,
    addFruit,
    removeFruit,
    state,
    movePlayer,
  };
}

function createKeyboardListener() {
  const state = {
    observers: []
  };

  function subscribe(observeFunction) {
    state.observers.push(observeFunction);
  }

  function notifyAll(command) {
    for (const observeFunction of state.observers) {
      observeFunction(command);
    }
  }

  document.addEventListener('keydown', handleKeydown);

  function handleKeydown({ key }) {
    const command = {
      playerId: 'player2',
      key
    }

    notifyAll(command);
  }

  return {
    subscribe
  }
}

function renderScreen(state) {
  context.fillStyle = 'white';
  context.clearRect(0, 0, 10, 10);

  for (const playerId in state.players) {
    const player = state.players[playerId];
    context.fillStyle = 'black';
    context.fillRect(player.x, player.y, 1, 1);
  }

  for (const fruitId in state.fruits) {
    const fruit = state.fruits[fruitId];
    context.fillStyle = 'green';
    context.fillRect(fruit.x, fruit.y, 1, 1);
  }

  requestAnimationFrame(() => renderScreen(game.state));
}

const game = createGame();
const keyboardListener = createKeyboardListener();
keyboardListener.subscribe(game.movePlayer);

game.addPlayer({playerId: 'player1', playerX: 0, playerY: 0});
game.addPlayer({playerId: 'player2', playerX: 4, playerY: 5});
game.addPlayer({playerId: 'player3', playerX: 7, playerY: 9});
game.addFruit({fruitId: 'fruit', fruitX: 2, fruitY: 2});

renderScreen(game.state);