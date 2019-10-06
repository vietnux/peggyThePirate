/*global Phaser*/
export default class Level1v2 extends Phaser.Scene {
  constructor () {
    super('Level1v2');
  }

  init (data) {
    // Initialization code goes here
  }

  preload () {
    // Preload assets
    // Peggy spritesheet
    this.load.spritesheet('peggy', "./assets/spritesheets/mainCharacter-gun.png", {
      frameHeight: 32,
      frameWidth: 32
    });

    // load background
    this.load.image('beachBackground', './assets/Level1.1/beachArtwork.png')


    //load tile map
    this.load.image('jungleTiles', './assets/Level1.1/placeholderTiles.png');
    this.load.image('beachTiles', './assets/Level1.1/shipAndBeachTiles.png');
    this.load.tilemapTiledJSON('map', './assets/Level1.1/Level1.json');

    // Load the gun/jump sound effect
    this.load.audio('gunAudio', './assets/audio/477346__mattiagiovanetti__some-laser-gun-shots-iii.mp3');
    this.load.audio('jumpAudio', './assets/audio/277219__thedweebman__8-bit-jump-2.mp3');


    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {
    //Create the scene
    var beachBackground = this.add.image(1200, 600, "beachBackground");
    beachBackground.setScale(3);

    this.gunSound = this.sound.add('gunAudio');
    this.jumpSound = this.sound.add('jumpAudio');
    this.jumpSound.volume = 0.1;

    this.player = this.physics.add.sprite(32, 546, 'peggy');
    this.player.setCollideWorldBounds(true);
    this.player.setScale(1.5);

    this.physics.world.setBounds(0, 0, 8000, 1920);

    this.cameras.main.setBounds(0, 0, 8000, 1920);
    this.cameras.main.startFollow(this.player);



    // tile map
    const map = this.make.tilemap({ key: 'map' });
    var tileset1 = map.addTilesetImage('placeholderTiles', 'jungleTiles');
    var tileset2 = map.addTilesetImage('shipAndBeachTiles', 'beachTiles');
    const platforms = map.createStaticLayer('beach', tileset2, 0, 0);
    const platforms2 = map.createStaticLayer('jungle', tileset1, 0, 0);
    platforms.setCollisionByExclusion(-1, true);
    platforms2.setCollisionByExclusion(-1, true);

    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(this.player, platforms2);



    // animations
    // Peggy animations
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

  }

  update (time, delta) {
    // Update the scene

    // Player Movement with WASD and shift to sprint
    var movement = this.input.keyboard  .addKeys('W, A, S, D, SHIFT');
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
      if (this.player.body.onFloor()){
      this.player.anims.play('idle', true);
      this.player.setVelocityX(0);
      }
    }
    // player can jump if they are touching the ground
    // removed the bounce because it means you cant jump right away after
    // intial jump because the bounce puts them in air
    if (movement.W.isDown && this.player.body.onFloor()){
      this.player.setVelocityY(-225);
      this.jumpSound.play();
    }
    //allows fast falling for more player mobility
    // jump and fall speed need to be experimented with
    else if(movement.S.isDown && !this.player.body.onFloor()){
      this.player.setVelocityY(300);
    }
  }
}
