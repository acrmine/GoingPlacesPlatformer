class FirstLevel extends LevelBase {
    constructor() {
        super("firstLevel");
    }

    init() {
        // variables and settings
        this.physics.world.gravity.y = 1500;
        this.SCALE = 2.0;

        this.coinSound = this.sound.add('sfx_coin', { volume: 0.3, });
    }

    preload()
    {
        this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
    }

    create() {
        // Create a new tilemap game object which uses 18x18 pixel tiles, and is
        // 45 tiles wide and 25 tiles tall.
        this.map = this.add.tilemap("platformer-level-1", 18, 18, 40, 25);
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels * 1.5);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("KennyBasicPlat", "tilemap_tiles");

        this.bg_1 = this.createBGLayer("background_basic", 2);
        // groundLayer must be named as such for player object to use it
        this.groundLayer = this.map.createLayer("groundLayer", this.tileset, 0, 0);
        this.overlap1 = this.map.createLayer("overlap1", this.tileset, 0, 0).setDepth(1);
        this.overlap2 = this.map.createLayer("overlap2", this.tileset, 0, 0).setDepth(3);
        this.loadedLayers = [this.groundLayer, this.overlap1, this.overlap2];
        // Make the layers collidable, need this.loadedLayers (array with all layer objects in it)
        this.createLayerCollision(this.map);

        this.playerSpawn = this.getPlayerSpawn(this.map, "playerSpawn");
        my.sprite.player = new Player(this, this.playerSpawn.x, this.playerSpawn.y, "platformer_characters", "tile_0000.png");

        this.createLevelVFX();
        this.coinGroup = this.spawnCoins(this.map, "Interactables", my.sprite.player);
        this.deathBoxGroup = this.spawnDeathZones(this.map, "Death_Boxes", my.sprite.player);
        this.winBoxGroup = this.spawnWinZones(this.map, "Interactables", my.sprite.player, "winScene");
        this.springGroup = this.spawnSprings(this.map, "Interactables", my.sprite.player);
        
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE);

        this.animatedTiles.init(this.map);

        this.rKey = this.input.keyboard.addKey('R');
        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);
    }

    update() 
    {
        if(Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.scene.restart();
        }
        // player movement
        my.sprite.player.update();

        // background movement
        this.scrollBGLayer(this.bg_1, this.cameras.main, 0.1);
    }
}