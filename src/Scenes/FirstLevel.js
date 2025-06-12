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
        this.outerMap = this.add.tilemap("outside-level", 16, 16, 200, 100);
        this.physics.world.setBounds(0, 0, this.outerMap.widthInPixels, this.outerMap.heightInPixels * 1.5);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("KennyBasicPlat", "tilemap_tiles");
        this.outTileset = this.outerMap.addTilesetImage("MonochromeBlack", "outside_tilemap");

        this.bg_1 = this.createStaticBGImage("backgroundM", 0, 0, 3);
        // this.bg_1 = this.createStaticBGImage("backgroundB", 0, -72, 3);
        this.cover1 = this.createStaticBGImage("coverRectangle", 0, 360, 3).setDepth(3);
        // this.cover2 = this.createStaticBGImage("coverRectangle", 2160, 0, 3);
        this.groundLayer = this.map.createLayer("groundLayer", this.tileset, 0, 0);
        this.overlap1 = this.map.createLayer("overlap1", this.tileset, 0, 0);
        this.overlap2 = this.map.createLayer("overlap2", this.tileset, 0, 0).setDepth(3);
        this.createLayerCollision(this.map);

        this.outsideGround = this.outerMap.createLayer("groundLayer", this.outTileset, 0, 0);
        this.createLayerCollision(this.outerMap);

        this.playerSpawn = this.getPlayerSpawn(this.map, "playerSpawn");
        this.loadedLayers = [this.groundLayer, this.overlap1, this.overlap2, this.outsideGround];
        // need loadedLayers array as a scene variable for player to add its own collision 
        my.sprite.player = new Player(this, this.playerSpawn.x, this.playerSpawn.y, "platformer_characters", "tile_0000.png");

        this.createLevelVFX();
        this.coinGroup = this.spawnCoins(this.map, "Interactables", my.sprite.player);
        this.deathBoxGroup = this.spawnDeathZones(this.map, "Interactables", my.sprite.player);
        this.springGroup = this.spawnSprings(this.map, "Interactables", my.sprite.player);
        
        this.cameras.main.setBounds(0, 0, this.outerMap.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE * 0.75);
        this.camTransEvent = this.spawnEventCollider(this.outerMap, "EventColliders", "CameraTransition", my.sprite.player, () =>
        {
            this.cameras.main.setBounds(0, 0, this.outerMap.widthInPixels, this.outerMap.heightInPixels);
        });

        this.animatedTiles.init(this.map);

        this.rKey = this.input.keyboard.addKey('R');
    }

    update() 
    {
        if(Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.scene.restart();
        }
        // player movement
        my.sprite.player.update();
    }
}