class Player extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y, texture, frame)
    {
        super(scene, x, y, texture, frame);

        this.speed = 100;

        scene.add.existing(this);

        scene.physics.world.enable(this);
        this.setFlip(true, false);
        this.setDepth(2);
        this.setCollideWorldBounds(true);
        for(let layer of scene.loadedLayers)
            scene.physics.add.collider(this, layer);
    }

    
}