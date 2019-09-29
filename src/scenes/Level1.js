/*global Phaser*/
import * as ChangeScene from'./Changescene.js';
export default class Level1 extends Phaser.Scene {
  constructor () {
    super('Level1');
  }

  init (data) {
    // Initialization code goes here
  }

  preload () {

    this.load.spritesheet('peggy', "./assets/spritesheets/mainCharacter-gun.png", {
      frameHeight: 32,
      frameWidth: 32
    });
    this.load.image('bullet', './assets/sprites/bomb.png');
    this.load.image("desert", "./assets/sprites/background.png");
    this.load.image("ground", "./assets/sprites/platform.png");
    this.load.image("enemy", "./assets/possibleAssets/pirate.png");
    this.load.image('L1', './assets/Level_1/LVL1.0.png')


    //attemping to load tile map
    this.load.image('tiles', './assets/Level_1/temp_tile.png');
    this.load.tilemapTiledJSON('map', './assets/Level_1/LVL1.json');

    // Load the gun sound effect
    this.load.audio('gunAudio', './assets/audio/477346__mattiagiovanetti__some-laser-gun-shots-iii.mp3');


    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {
    //Create the scene
    ChangeScene.addSceneEventListeners(this);

    this.player;
    var background;
    var bullets;
    var bullet;
    var enemy;
    var enemyGroup;

    this.gunSound = this.sound.add('gunAudio')

    var score;
    this.score = 0;
    var background = this.add.sprite(1280/2, 960/2, "desert");
    this.player = this.physics.add.sprite(32, 32, 'peggy');
    this.player.setCollideWorldBounds(true);
    this.player.setScale(1.5);
    this.physics.world.setBounds(0, 0, 1280, 960);
    //this.player.setBounce(0.2);
    this.cameras.main.setBounds(0, 0, 1280, 960);
    this.cameras.main.startFollow(this.player);


    // tile map
    const map = this.make.tilemap({ key: 'map' });
    var tileset = map.addTilesetImage('tile1.0', 'tiles');
    const platforms = map.createStaticLayer('platforms', tileset, 0, 0);
    platforms.setCollisionByExclusion(-1, true);

    this.physics.add.collider(this.player, platforms);

    this.nextFire = 0;
    this.fireRate = 200;

    //add bullet group
    this.bullets = this.physics.add.group({
      defaultKey: "bullet",
      maxSize: 10
    });

    //how to get gravity of bullets to be zero??
    this.bullets.children.iterate(function(child){
      child.body.gravity.y = 0;
      child.body.gravity.x = 0;
    });

    //automate adding multiple enemies to an enemy
    this.enemyGroup = this.physics.add.group({});

    this.enemy1 = this.physics.add.sprite(400, 100, 'enemy');
    this.enemy2 = this.physics.add.sprite(600, 350, 'enemy');
    this.enemy3 = this.physics.add.sprite(900, 500, 'enemy');
    this.enemy4 = this.physics.add.sprite(1100, 700, 'enemy');
    this.enemy5 = this.physics.add.sprite(1400, 900, 'enemy');
    this.enemyGroup.add(this.enemy1);
    this.enemyGroup.add(this.enemy2);
    this.enemyGroup.add(this.enemy3);
    this.enemyGroup.add(this.enemy4);
    this.enemyGroup.add(this.enemy5);

    this.enemyGroup.children.iterate(function(child){
      child.setScale(3);
      child.setCollideWorldBounds(true);
    });

    this.physics.add.collider(this.enemyGroup, platforms);

    //create animation from spritesheet
  this.anims.create({
    key: "walk",
    frames: this.anims.generateFrameNumbers('peggy', {start: 1, end: 5}),
    frameRate: 10,
    repeat: -1 //repeat forever
  });

  this.anims.create({
    key: "idle",
    frames: this.anims.generateFrameNumbers('peggy', {start:0, end:0}),
    frameRate: 10,
    repeat: -1
  });

//enemy has movement, varies per enemy

//enemy1
this.tweens.add({
  targets: this.enemy1,
  x: '-=200',
  ease: "Linear",
  delay: 1000,
  duration: 2000,
  yoyo: true,
  repeat: -1,
  flipX: true
});
//enemy2
this.tweens.add({
  targets: this.enemy2,
  x: '-=300',
  ease: "Linear",
  delay: 1000,
  duration: 3000,
  yoyo: true,
  repeat: -1,
  flipX: true
});
//enemy3
this.tweens.add({
  targets: this.enemy3,
  x: '-=100',
  ease: "Linear",
  delay: 1000,
  duration: 1000,
  yoyo: true,
  repeat: -1,
  flipX: true,
  repeatDelay: 1000
});
//enemy4...doesn't move for now...but maybe could shoot bullets?
this.tweens.add({
  targets: this.enemy4,
//  x: '-=100',
  ease: "Linear",
  delay: 1000,
  duration: 1000,
  yoyo: true,
  repeat: -1,
  flipX: true
});
//enemy5
this.tweens.add({
  targets: this.enemy5,
  x: '-=500',
  ease: "Linear",
  delay: 1000,
  duration: 5000,
  yoyo: true,
  repeat: -1,
  flipX: true
});

//if player touches enemy
this.enemyGroup.children.each(
      function (b) {
        if (b.active) {
          this.physics.add.overlap( //if enemyGroup touches player, calls function
            b,
            this.player,
            this.gameOver,
            null,
            this
          );
        }
      }.bind(this) //binds to each children
    );

  }

  update (time, delta) {
    // Update the scene


    // Player Movement with WASD and shift to sprint
    var movement = this.input.keyboard.addKeys('W, A, S, D, SHIFT');
    var speed;

    // Hold down shift to make Peggy sprint
    // this must come before input detection of WASD because
    // otherwise it wont change the speed variable before she
    // starts moving
    if (movement.SHIFT.isDown){
      speed = 210;
    }
    else{
      speed = 135;
    }
    // Move Left
    if (movement.A.isDown){
      this.player.setVelocityX(-speed);
      this.player.flipX = true;
      this.player.anims.play('walk', true);
    }
    // Move Right
    else if (movement.D.isDown){
      this.player.setVelocityX(speed);
      this.player.flipX = false;
      this.player.anims.play('walk', true);
    }
    // Idle
    else {
      this.player.anims.play('idle', true);
      this.player.setVelocityX(0);
    }
    // player can jump if they are touching the ground
    // removed the bounce because it means you cant jump right away after
    // intial jump because the bounce puts them in air
    if (movement.W.isDown && this.player.body.onFloor()){
      this.player.setVelocityY(-225);
    }
    //allows fast falling for more player mobility
    // jump and fall speed need to be experimented with
    else if(movement.S.isDown && !this.player.body.onFloor()){
      this.player.setVelocityY(300);
    }

    var bang = this.input.keyboard.addKeys('O');


    this.input.on(
  "pointermove",
  function(pointer){}, this
);
    this.input.on("pointerdown", this.shoot, this);


    this.bullets.children.each(
          function (b) {
            if (b.active) {
              this.physics.add.overlap( //if bullet touches enemyGroup, calls function
                b,
                this.enemyGroup,
                this.hitEnemy,
                null,
                this
              );
              //refresh bullet group
              if (b.y < 0) { //if bullet off top of screen
                b.setActive(false);
              }
              else if (b.y > this.cameras.main.height) { //if bullet off bottom of screen
                b.setActive(false);
              }
              else if (b.x < 0){
                b.setActive(false);
              }
              else if (b.x > this.cameras.main.width){
                b.setActive(false);
              }
            }
          }.bind(this) //binds to each children
        );
}

shoot(pointer) {
  if(this.player.flipX == false){
    var velocity = {x: 1000, y: 0};
  }
  else{
    var velocity = {x: -1000, y: 0};
  }
  var bullet = this.bullets.get();
  bullet.enableBody(true, this.player.x, this.player.y, true, true)
  .setVelocity(velocity.x, velocity.y);
  // Play gun noise
  this.gunSound.play();
}

  hitEnemy(bullet, enemy){
    console.log('hit');
    enemy.disableBody(true, true);
    bullet.disableBody(true, true);
    this.score += 1;
    console.log(this.score);
    if(this.score >= 5){
      this.success();
    }
  }

  gameOver(){
    //end game, goes to game over scene
    console.log('game over!');
    this.scene.start('GameOver');
  }

  success(){
      console.log('success!');
      this.scene.start('successScene');
      //successfully completed game, changes to success scene
  }
}
