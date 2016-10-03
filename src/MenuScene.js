
var MenuScene = cc.Scene.extend({
    space:null,
    mainLayer:null,
    onEnter:function () {
        this._super();

        this.space = new cp.Space();

        this.mainLayer = new cc.Layer();

        this.mainLayer.addChild(new BackgroundLayer(this.space), 0, TagOfLayer.Background);
        this.mainLayer.addChild(new AnimationLayer(this.space), 0, TagOfLayer.Animation);

        this.addChild(this.mainLayer);
        this.addChild(new MenuLayer(), 0, TagOfLayer.Menu);
        this.scheduleUpdate();
    },

    update : function(dt) {
        this.space.step(dt);

        var animationLayer = this.mainLayer.getChildByTag(TagOfLayer.Animation);
        var eyeX = animationLayer.getEyeX();

        this.mainLayer.setPosition(cc.p(-eyeX,0));
    },

    getMainLayer:function(){
        return this.mainLayer;
    }
});

var MenuLayer = cc.Layer.extend({
    playBtn: null,
    rankBtn: null,

    ctor:function () {
        this._super();
        this.init();
    },

    init:function () {
        this._super();

        var centerPos = cc.p(cc.winSize.width/2, cc.winSize.height/2);

        var gameNameSprite = new cc.Sprite(res.gameName_png);
        gameNameSprite.setPosition(centerPos.x, centerPos.y + 60);

        var playBtnSprite = new cc.Sprite(res.playBtn_png);
        var rankBtnSprite = new cc.Sprite(res.rankBtn_png);

        this.playBtn = new cc.MenuItemSprite(playBtnSprite,null,this.onPlay, this);
        this.playBtn.setPositionX(-60);

        this.rankBtn = new cc.MenuItemSprite(rankBtnSprite,null,this.onPlay, this);
        this.rankBtn.setPositionX(60);

        var menu = new cc.Menu(this.playBtn, this.rankBtn);
        menu.setPosition(centerPos.x, centerPos.y - 115);

        this.addChild(gameNameSprite);
        this.addChild(menu);
    },

    onEnter:function()
    {
        this._super();
        var animationLayer = this.getParent().getMainLayer().getChildByTag(TagOfLayer.Animation);
        animationLayer.setBirdStartPos(cc.winSize.width/2, cc.winSize.height/2);
    },

    onPlay:function(){
        cc.director.runScene(new GamePlayScene());
    }
});

