
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'wdi-game', { preload: preload, create: create, update: update, render: render });
//new Game(width, height, renderer, parent, state, transparent, antialias, physicsConfig)

function preload() {

    game.load.spritesheet('dude', 'assets/images/dude.png', 18, 24, 23, 0, 14 );
    //spritesheet(key, url, frameWidth, frameHeight, frameMax, margin, spacing)
    game.load.image('background', 'assets/layers/parallax-mountain-bg.png');

}

var player;
var facing = 'left';
var jumpTimer = 0;
var cursors;
var jumpButton;
var bg;

function create() {

    // background image
    bg = game.add.image(0, 0, 'background');
    bg.width = 960;
    bg.height = 720;

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 300;

    // add.sprite x-coord, y-coord, flag, frame
    player = game.add.sprite( 450, 300, 'dude');
    player.scale.set(2);

    game.physics.enable(player, Phaser.Physics.ARCADE);

    player.body.collideWorldBounds = true;
    // player.body.gravity.y = 1000;
    // player.body.maxVelocity.y = 500;
    // player.body.setSize(20, 32, 5, 16);

    player.animations.add('right', [ 1, 2, 3, 4], 10, true);
    player.animations.add('jump', [5,6,7,8], 5, true );
    // player.animations.add('turn', [4], 20, true);
    // player.animations.add('right', [5, 6, 7, 8], 10, true);

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

}

function update() {

    // game.physics.arcade.collide(player, layer);

    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        player.body.velocity.x = -150;

        if (facing != 'left')
        {
            player.animations.play('left');
            facing = 'left';
        }
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 150;

        if (facing != 'right')
        {
            player.animations.play('right');
            facing = 'right';
        }
    }
    else
    {
        if (facing != 'idle')
        {
            player.animations.stop();

            if (facing == 'left')
            {
                player.frame = 0;
            }
            else
            {
                player.frame = 5;
            }

            facing = 'idle';
        }
    }

    if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer)
    {
        player.animations.play("jump");
        player.body.velocity.y = -250;
        jumpTimer = game.time.now + 750;
    }

}

function render () {

    // game.debug.text(game.time.physicsElapsed, 32, 32);
    game.debug.body(player);
    // game.debug.bodyInfo(player, 16, 24);

}
