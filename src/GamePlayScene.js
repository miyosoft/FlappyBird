/**
 * Created by vutruong on 9/24/2016.
 */

var GamePlayScene = cc.Scene.extend({
    space:null,

    initPhysics:function(){
        this.space = new cp.Space();
        this.space.gravity = cp.v(0, g_spaceGravity);
    },

    onEnter:function () {
        this._super();
        this.initPhysics();
        this.addChild(new BackgroundLayer());
        this.addChild(new GamePlayLayer(this.space));
        this.scheduleUpdate();
    },

    update:function(dt){
        this.space.step(dt);
    }
});

var GamePlayLayer = cc.Layer.extend({
    status: 'ready',
    bird: null,
    ground: null,
    scoreSprite: null,
    tapSprite: null,
    readySprite: null,
    groundDeltaX: 0,

    space: null,

    ctor:function(space){
        this._super();
        this.space = space;
        this.init();
    },

    init:function(){
        this._super();

        var centerPos = cc.p(cc.winSize.width/2, cc.winSize.height/2);

        this.tapSprite = new cc.Sprite(res.tap_png);
        this.tapSprite.setPosition(centerPos);

        this.readySprite = new cc.Sprite(res.ready_png);
        this.readySprite.setPosition(this.tapSprite.x, this.tapSprite.y + 100);

        cc.spriteFrameCache.addSpriteFrames(res.score_plist);
        this.scoreSprite = new cc.Sprite("#score0.png");
        this.scoreSprite.setPosition(this.readySprite.x, this.readySprite.y + 80);

        this.ground = new Ground(this.space);

        this.bird = new Bird(this.space);
        var birdPos = cc.p(this.tapSprite.x - this.tapSprite.width/2, this.tapSprite.y);
        this.bird.setPosition(birdPos.x, birdPos.y);

        this.addChild(this.tapSprite);
        this.addChild(this.readySprite);
        this.addChild(this.scoreSprite);
        this.addChild(this.ground);
        this.addChild(this.bird);

        this.scheduleUpdate();
    },

    hideInstructions:function()
    {
        this.tapSprite.runAction(new cc.FadeTo(0.5, 0));
        this.readySprite.runAction(new cc.FadeTo(0.5, 0));
    },

    setGameState:function(currentState)
    {
        GameState.Current = currentState;

        var event = new cc.EventCustom("GameStateChanged");
        event.setUserData(currentState);
        cc.eventManager.dispatchEvent(event);

        if(GameState.Current == GameState.Play)
        {
            this.hideInstructions();
        }
    },

    onEnter:function(){
      this._super();

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function(touch, event){
                var target = event.getCurrentTarget();
                if(GameState.Current == GameState.Ready) {
                    target.setGameState(GameState.Play)
                    target.bird.flapWings();
                }
                else if(GameState.Current == GameState.Play)
                {
                    target.bird.flapWings();
                }
            }
        }, this);
    },

    update : function(dt) {
        this.groundDeltaX += g_groundMoveSpeed;
        this.ground.setPositionX(-this.groundDeltaX);
        this.ground.checkAndReload(this.groundDeltaX);
    }
});
