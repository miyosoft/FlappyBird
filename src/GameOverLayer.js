/**
 * Created by vutruong on 10/2/16.
 */

var GameOverLayer = cc.Layer.extend({
    menu:null,
    gameOverSprite:null,
    scoreboardSprite:null,
    scoreLabel:null,

    // constructor
    ctor:function (score) {
        this._super();
        this.init(score);
    },
    init:function (score) {
        this._super();

        var centerPos = cc.p(cc.winSize.width/2, cc.winSize.height/2);

        this.scoreboardSprite = new cc.Sprite(res.scoreboard_png);
        this.scoreboardSprite.setPosition(centerPos);

        this.scoreLabel = new cc.LabelBMFont(score.toString(), res.flappyBird_fnt);
        this.scoreLabel.setScale(0.5);
        this.scoreLabel.setAnchorPoint(1, 0.5);
        this.scoreLabel.setPosition(this.scoreboardSprite.getContentSize().width - 28, this.scoreboardSprite.getContentSize().height - 35);

        this.gameOverSprite = new cc.Sprite(res.gameover_png);
        this.gameOverSprite.setPosition(centerPos.x, centerPos.y + 100);

        var playBtnSprite = new cc.Sprite(res.playBtn_png);
        var rankBtnSprite = new cc.Sprite(res.rankBtn_png);

        var playBtn = new cc.MenuItemSprite(playBtnSprite,null,this.onPlay, this);
        playBtn.setPositionX(-60);

        var rankBtn = new cc.MenuItemSprite(rankBtnSprite,null,this.onPlay, this);
        rankBtn.setPositionX(60);

        this.menu = new cc.Menu(playBtn, rankBtn);
        this.menu.setPosition(centerPos.x, centerPos.y - 115);

        var seq = new cc.Sequence(
            new cc.DelayTime(0.1),
            cc.callFunc(this.showGameOverSprite, this),
            new cc.DelayTime(1.0),
            cc.callFunc(this.showScoreboard, this),
            new cc.DelayTime(0.5),
            cc.callFunc(this.showMenu, this)
        );

        this.runAction(seq);
    },

    showGameOverSprite:function(){
        this.addChild(this.gameOverSprite);
        this.gameOverSprite.runAction(new cc.Sequence(
            cc.fadeOut(0),
            cc.fadeIn(0.1)
        ));
    },

    showScoreboard:function(){
        this.scoreboardSprite.addChild(this.scoreLabel);
        this.addChild(this.scoreboardSprite);

        this.scoreboardSprite.runAction(new cc.Sequence(
            cc.fadeOut(0),
            cc.fadeIn(0.1)
        ));
    },

    showMenu:function(){
        this.addChild(this.menu);
    },
    onPlay:function (sender) {
        GameState.Current = GameState.Ready;
        cc.director.runScene(new GamePlayScene());
    }
});