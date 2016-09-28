
var MenuScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        this.addChild(new BackgroundLayer());
        this.addChild(new MenuLayer());
    }
});

var MenuLayer = cc.Layer.extend({
    ground: null,
    bird: null,
    playBtn: null,
    rankBtn: null,
    groundDeltaX: 0,
    ctor:function () {
        this._super();
        this.init();
    },

    init:function () {
        this._super();

        var centerPos = cc.p(cc.winSize.width/2, cc.winSize.height/2);

        this.ground = new Ground(null);

        this.bird = new Bird(null);
        this.bird.setPosition(centerPos);

        var gameNameSprite = new cc.Sprite(res.gameName_png);
        gameNameSprite.setPosition(cc.winSize.width/2, cc.winSize.height/2 + 60);

        var playBtnSprite = new cc.Sprite(res.playBtn_png);
        var rankBtnSprite = new cc.Sprite(res.rankBtn_png);

        this.playBtn = new cc.MenuItemSprite(playBtnSprite,null,this.onPlay, this);
        this.playBtn.setPositionX(-60);

        this.rankBtn = new cc.MenuItemSprite(rankBtnSprite,null,this.onPlay, this);
        this.rankBtn.setPositionX(60);

        var menu = new cc.Menu(this.playBtn, this.rankBtn);
        menu.setPosition(cc.winSize.width/2, this.bird.y - 115);

        this.addChild(this.ground);
        this.addChild(this.bird);
        this.addChild(gameNameSprite);
        this.addChild(menu);

        this.scheduleUpdate();
    },

    onPlay:function(){
        cc.director.runScene(new GamePlayScene());
    },

    update : function(dt) {
        this.groundDeltaX += g_groundMoveSpeed;
        this.ground.setPositionX(-this.groundDeltaX);
        this.ground.checkAndReload(this.groundDeltaX);
    }
});

