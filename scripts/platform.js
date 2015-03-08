
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'wdi-game', { preload: preload, create: create, update: update, render: render });
//new Game(width, height, renderer, parent, state, transparent, antialias, physicsConfig)

function preload() {

    game.load.spritesheet('dude', 'assets/images/dude.png', 18, 24, 23, 0, 14 );
    //spritesheet(key, url, frameWidth, frameHeight, frameMax, margin, spacing)
    // game.load.tilemap('godot-tree', 'assets/godot.json', null, Phaser.Tilemap.TILED_JSON);

    game.load.image('background', 'assets/layers/parallax-mountain-bg.png');
    game.load.image('chain', 'assets/images/chain.png', 16, 16);
    // game.load.image('tiles-1', 'assets/images/sheet_9.png');

}

var player;
var chain;
var facing = 'right';
var jumpTimer = 0;
var cursors;
var jumpButton;
var bg;

function create() {

    // background image
    bg = game.add.image(0, 0, 'background');
    bg.width = 960;
    bg.height = 720;
    bg.fixedToCamera = true;

    //level
    // map = game.add.tilemap( 'godot-tree' );
    // map.addTilesetImage('tiles-1');
    // layer = map.createLayer('Tile Layer 1');
    // layer.resizeWorld();

    // game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.startSystem(Phaser.Physics.P2JS);

    game.physics.p2.gravity.y = 300;

    // add.sprite x-coord, y-coord, flag, frame
    player = game.add.sprite( 450, 300, 'dude');

    player.scale.set(2);
    player.anchor.setTo(0.5,0.5);


    game.physics.p2.enable(player);
    // player.body.kinematic = true;
    player.body.fixedRotation = true;

    player.body.collideWorldBounds = true;
    // player.body.gravity.y = 1000;
    // player.body.maxVelocity.y = 500;
    // player.body.setSize(20, 32, 5, 16);


    player.animations.add('walk', [ 1, 2, 3, 4], 8, true);
    player.animations.add('jump', [5,6,7,8], 5, true );
    // player.animations.add('turn', [4], 20, true);
    // player.animations.add('right', [5, 6, 7, 8], 10, true);


    game.camera.follow(player);
    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    //chain
    createChain( 40, 480, 0);

}

function update() {

    // game.physics.arcade.collide(player, layer);
    
    // reset velocity every tick
    

    //flip sprite based on direction
    if(facing == 'left'){
        player.scale.x = -2;
    } else if (facing == 'right'){
        player.scale.x = 2;
    }


    if (cursors.left.isDown)
    {
        player.body.moveLeft(150);

        if (facing != 'left')
        {
            player.animations.play('walk');
            facing = 'left';
        }
    }
    else if (cursors.right.isDown)
    {
        player.body.moveRight(150);

        if (facing != 'right')
        {
            player.animations.play('walk');
            facing = 'right';
        }
    }
    else
    {
        player.body.velocity.x = 0;
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

    if (jumpButton.isDown && game.time.now > jumpTimer && checkIfCanJump())
    {
        player.animations.play("jump");
        player.body.moveUp(250);
        jumpTimer = game.time.now + 750;
    }



}

function render () {

    game.debug.text(game.time.physicsElapsed, 32, 32);
    // game.debug.body(player);
    // game.debug.bodyInfo(player, 16, 24);

}

function createChain( length, xAnchor, yAnchor){
    
    var lastRect;
    var height = 20;        //  Height for the physics body - your image height is 8px
    var width = 16;         //  This is the width for the physics body. If too small the rectangles will get scrambled together.
    var maxForce = 20000;   //  The force that holds the rectangles together.

    for (var i = 0; i <= length; i++)
    {
        var x = xAnchor;                    //  All rects are on the same x position
        var y = yAnchor + (i * height);     //  Every new rect is positioned below the last

        if (i % 2 === 0)
        {
            //  Add sprite (and switch frame every 2nd time)
            newRect = game.add.sprite(x, y, 'chain', 1);
        }   
        else
        {
            newRect = game.add.sprite(x, y, 'chain', 0);
            lastRect.bringToTop();
        }

        //  Enable physicsbody
        game.physics.p2.enable(newRect, false);

        //  Set custom rectangle
        newRect.body.setRectangle(width, height);

        if (i === 0)
        {
            newRect.body.static = true;
        }
        else
        {  
            //  Anchor the first one created
            newRect.body.velocity.x = 400;      //  Give it a push :) just for fun
            newRect.body.mass = length / i;     //  Reduce mass for evey rope element
        }

        //  After the first rectangle is created we can add the constraint
        if (lastRect)
        {
            game.physics.p2.createRevoluteConstraint(newRect, [0, -10], lastRect, [0, 10], maxForce);
        }

        lastRect = newRect;

    }
}

function checkIfCanJump() {

    var yAxis = p2.vec2.fromValues(0, 1);
    var result = false;

    for (var i = 0; i < game.physics.p2.world.narrowphase.contactEquations.length; i++)
    {
        var c = game.physics.p2.world.narrowphase.contactEquations[i];

        if (c.bodyA === player.body.data || c.bodyB === player.body.data)
        {
            var d = p2.vec2.dot(c.normalA, yAxis); // Normal dot Y-axis
            if (c.bodyA === player.body.data) d *= -1;
            if (d > 0.5) result = true;
        }
    }
    
    return result;

}
