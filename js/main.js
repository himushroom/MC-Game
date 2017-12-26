//var game = new Phaser.Game(gameSet);

var game = new Phaser.Game(gameSet.width, gameSet.height, Phaser.CANVAS, '', {
  preload: preload,
  create: create,
  update: update
})
var gamesNext = false
function preload() {
  game.load.image('ball', 'assets/ball.png')
  game.load.image('bricks', 'assets/bricks.jpg')
  game.load.image('plank', 'assets/plank.png')
  game.load.image('pause', 'assets/pause.png')
  game.load.image('start', 'assets/start.png')
}

function create() {
  // 添加游戏物理引擎
  game.physics.startSystem(Phaser.Physics.ARCADE)
  game.scale.scaleMode = Phaser.ScaleManager.RESIZE
  //   默认情况下，如果浏览器选项卡失去焦点，游戏将暂停。
  game.stage.disableVisibilityChange = true
  //   捕获鼠标
  game.input.mouse.capture = true
  game.stage.backgroundColor = '#273d4a'
  //生成3个球
  whiteBall = new ball(0, 0, 'ball', false)
  plank = new ball(0, 0, 'plank', true, 0)
  pause = game.add.button(
    gameSet.width - 20,
    gameSet.height * (3 / 5),
    'pause',
    pauseGame,
    null,
    this
  )
  pause = game.add.button(
    gameSet.width - 20,
    gameSet.height * (3 / 5) + 50,
    'start',
    startGame,
    null,
    this
  )
  bricks = game.add.group()
  bricks.enableBody = true
  for (var j = 0; j < 5; j++) {
    for (var i = 0; i < 30; i++) {
      var brick = bricks.create(i * 20, 50 * j, 'bricks')
    }
  }
  bricks.moves = false
  //   bricks = new ball(0, 0, 'bricks', true, 0)
  //设置球的body不会动
  plank.body.moves = false
  //设置黄球的反弹
  whiteBall.body.bounce.setTo(0.7)
  //碰撞不移动
  plank.body.immovable = true
  bricks.immovable = true
  iniGame()
}
function iniGame() {
  // 白板位置设置
  plank.x = gameSet.width / 2 - 88
  plank.y = gameSet.height * (5 / 6)
  // 锚定纹理的原点点
  plank.anchor.setTo(0, 0.5)
  // 白球位置设置
  whiteBall.x = gameSet.width / 2 - 44 - 8
  whiteBall.y = gameSet.height * (5 / 6) - 16
  whiteBall.anchor.setTo(0, 0.5)
  pause.anchor.setTo(0, 0.5)
}
// game.physics.arcade.enable(ground) 给ground添加物理属性
// ground.body.immovable = true ground不能移动
// game.physics.arcade.colliside(a, b) ab碰撞检测
function collision(e) {
  whiteBall.body.moves = true
  whiteBall.body.velocity.copyFrom(
    game.physics.arcade.velocityFromAngle(
      game.physics.arcade.angleBetween(e, whiteBall) * 180 / Math.PI,
      1500
    )
  )
}

function breakBricks(whiteBall, brick) {
  whiteBall.body.moves = true
  whiteBall.body.velocity.copyFrom(
    game.physics.arcade.velocityFromAngle(
      game.physics.arcade.angleBetween(brick, whiteBall) * 180 / Math.PI,
      700
    )
  )
  brick.kill()
}

function update() {
  //   if (whiteBall.y > gameSet.height * (3 / 4)) {
  //     alert('游戏结束')
  //     gamesNext = true
  //   }
  if (whiteBall.y > gameSet.height * (5 / 6) + 88) {
    alert('游戏结束')
    whiteBall.body.moves = false
    whiteBall.body.velocity.setTo(0)
    gamesNext = false
    iniGame()
  } else {
    game.physics.arcade.collide(plank, whiteBall, collision, null, this)
    game.physics.arcade.collide(bricks, whiteBall, breakBricks, null, this)
  }

  //     if (whiteBall.x > 960 && whiteBall.body.velocity.x > 20) {
  //       //黄球超出中线，红球追击
  //       game.physics.arcade.moveToXY(bricks, whiteBall.x - 30, whiteBall.y, 2000)
  //       if (bricks.x - whiteBall.x < 40) {
  //         //如果追击成功，红球返回边界
  //         game.physics.arcade.moveToXY(bricks, 1920, whiteBall.y, 2000)
  //       }
  //     } else {
  //       //红球返回边界
  //       game.physics.arcade.moveToXY(bricks, 1920, whiteBall.y, 500)
  //     }
  //   }
}
function pauseGame() {
  game.paused = true
}

function startGame() {
  game.paused = false
}
