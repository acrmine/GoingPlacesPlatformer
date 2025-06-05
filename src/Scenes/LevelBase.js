class LevelBase extends Phaser.Scene
{
    static playerScore = 0;
    
    static SPRING_BOUNCE_DEF = 400;

    createLevelVFX()
    {
        my.vfx.coin = this.add.particles(0, 0, "kenny-particles", {
            frame: ['magic_05.png'],
            scale: {start: 0.03, end: 0.3},
            alpha: {start: 1, end: 0.1},
            lifespan: 200,
            duration: 1,
        });
        my.vfx.coin.stop();
    }

    createLayerCollision(map)
    {
        for(let layer of map.layers)
        {
            let tileset = map.tilesets[0];
            for(let i = 0; i < map.width; i++)
            {
                for(let j = 0; j < map.height; j++)
                {
                    let tile = layer.tilemapLayer.getTileAt(i, j);
                    if(tile != null)
                    {
                        let tileProps = tileset.getTileProperties(tile.index);
                        if(tileProps != null)
                        {
                            if(tileProps.jumpthru)
                                tile.setCollision(false, false, true, false, false);
                            else if(tileProps.collides)
                                tile.setCollision(true, true, true, true);
                            else
                                tile.resetCollision(false);
                        }
                    }
                }
            }
        }
    }

    createBGLayer(texture, imageWidth, imageHeight, scale)
    {
        let textureObject = this.textures.get(texture);
        let width = textureObject.getSourceImage().width;
        let height = textureObject.getSourceImage().height;
        let background = this.add.tileSprite(width/2, height/2, imageWidth, imageHeight, texture);
        background.setOrigin(0, 0);
        background.setScrollFactor(0);
        background.setScale(scale);
        return background;
    }

    scrollBGLayer(bg, camera, rate)
    {
        bg.tilePositionX = camera.scrollX * rate;
    }

    createStaticBGImage(texture, x, y, scale)
    {
        let image = this.add.image(x, y, texture).setOrigin(0,0).setScale(scale);
        return image;
    }

    getPlayerSpawn(map, objectLayer)
    {
        let playerLayer = map.getObjectLayer(objectLayer);
        let playerSpawn = {
            x: playerLayer.objects[0].x,
            y: playerLayer.objects[0].y
        };
        return playerSpawn;
    }

    //returns group with coin objects
    spawnCoins(map, objectLayer, playerObject)
    {
        // make the objects
        let coins = map.createFromObjects(objectLayer, {
            name: "coin",
            key: "tilemap_sheet",
            frame: 151
        });

        // enable arcade physics for the objects
        this.physics.world.enable(coins, Phaser.Physics.Arcade.STATIC_BODY);

        // add them all to a group
        let coinGroup = this.add.group(coins);
        for(let child of coinGroup.getChildren())
            child.anims.play('coinspin', true);

        // create collision event with the player
        this.physics.add.overlap(playerObject, coinGroup, (obj1, obj2) => 
        { 
            my.vfx.coin.x = obj2.x;
            my.vfx.coin.y = obj2.y;
            my.vfx.coin.start();
            this.coinSound.play();
            obj1.score += 50;
            obj2.destroy(); // remove coin on overlap
        });
        return coinGroup;
    }

    spawnDeathZones(map, objectLayer, playerObject)
    {
        let deathZones = map.createFromObjects(objectLayer, {
            name: "death",
        });
        this.physics.world.enable(deathZones, Phaser.Physics.Arcade.STATIC_BODY);
        let deathBoxGroup = this.add.group(deathZones);
        for(let child of deathBoxGroup.getChildren())
            child.visible = false;
        this.physics.add.overlap(playerObject, deathBoxGroup, (obj1, obj2) => {
            obj1.die("falling");
        });
        return deathBoxGroup;
    }

    spawnWinZones(map, objectLayer, playerObject, nextScene)
    {
        let winZones = map.createFromObjects(objectLayer, {
            name: "win",
        });
        this.physics.world.enable(winZones, Phaser.Physics.Arcade.STATIC_BODY);
        let winGroup = this.add.group(winZones);
        for(let child of winGroup.getChildren())
            child.visible = false;
        this.physics.add.overlap(playerObject, winGroup, (obj1, obj2) => {
            obj1.win(nextScene);
        });
        return winGroup;
    }

    spawnSprings(map, objectLayer, playerObject)
    {
        let springs = map.createFromObjects(objectLayer, {
            name: "spring",
            key: "tilemap_sheet",
            frame: 107
        });
        this.physics.world.enable(springs, Phaser.Physics.Arcade.STATIC_BODY);
        let springGroup = this.add.group(springs);
        this.physics.add.overlap(playerObject, springGroup, (obj1, obj2) => {
            obj2.anims.play('springBounce', true);
            obj1.setVelocityY(-LevelBase.SPRING_BOUNCE_DEF);
            if(obj2.getData("bounce") == null)
                obj1.setVelocityY(-LevelBase.SPRING_BOUNCE_DEF);
            else
                obj1.setVelocityY(-obj2.getData("bounce"));
        });
        return springGroup;
    }
}