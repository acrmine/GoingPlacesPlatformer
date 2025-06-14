class WinScreen extends LevelBase {
    constructor() {
        super("winScene");

        this.restartKey = "SPACE";
    }

    create()
    {
        this.createStaticBGImage("background_basic", 0, 0, 3);
        this.createStaticBGImage("win_screen", 0, 0, 4);

        this.deathMessage = this.add.bitmapText(game.config.width/5.5, game.config.height * 0.25, "pixelFont", "YOU\nWIN!!", 100);
        this.deathMessage.setOrigin(0.5).setCenterAlign();
        this.scoreReport = this.add.bitmapText(game.config.width/3, game.config.height * 0.91, "pixelFont", "Final score: " + LevelBase.playerScore, 80);
        this.scoreReport.setOrigin(0.5).setCenterAlign();
        this.titleMessage = this.add.bitmapText(game.config.width * 0.8, game.config.height * 0.8, "pixelFont", "Press  " + this.restartKey + "\nto start over", 48);
        this.titleMessage.setOrigin(0.5).setCenterAlign();

        this.input.keyboard.on('keydown-' + this.restartKey, (event) => {this.scene.start("firstLevel");});
    }
}