/**
 * Created by vutruong on 9/24/2016.
 */

var GamePlayScene = cc.Scene.extend({
    space:null,
    mainLayer:null,

    onEnter:function () {
        this._super();

        this.initPhysics();

        this.mainLayer = new cc.Layer();

        this.mainLayer.addChild(new BackgroundLayer(this.space), 0, TagOfLayer.Background);
        this.mainLayer.addChild(new AnimationLayer(this.space), 0, TagOfLayer.Animation);

        this.addChild(this.mainLayer);
        this.addChild(new StatusLayer(), 0, TagOfLayer.Status);

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function(touch, event){
                var target = event.getCurrentTarget();
                if(GameState.Current == GameState.Ready) {
                    target.setGameState(GameState.Play)
                    target.getMainLayer().getChildByTag(TagOfLayer.Animation).flapWings();
                }
                else if(GameState.Current == GameState.Play)
                {
                    target.getMainLayer().getChildByTag(TagOfLayer.Animation).flapWings();
                }
            }
        }, this);

        this.scheduleUpdate();
    },

    initPhysics:function(){
        this.space = new cp.Space();

        var ground = new cp.SegmentShape(this.space.staticBody,
            cp.v(0, g_groundHeight),// start point
            cp.v(4294967295, g_groundHeight),// MAX INT:4294967295
            0);// thickness of wall

        ground.setCollisionType(SpriteTag.Ground);
        ground.setElasticity(0);
        ground.setFriction(0);
        this.space.addStaticShape(ground);

        this.space.addCollisionHandler(SpriteTag.Bird, SpriteTag.Ground,
            this.collisionGroundBegin.bind(this), null, null, null);
        this.space.addCollisionHandler(SpriteTag.Bird, SpriteTag.Pipe,
            this.collisionPipeBegin.bind(this), null, null, null);
    },

    collisionPipeBegin:function (arbiter, space) {
        if(GameState.Current == GameState.Play)
        {
            if(arbiter.a.collision_type == SpriteTag.Bird)
            {
                arbiter.a.getBody().setVel(cp.v(0,0));
            }
            else
            {
                arbiter.b.getBody().setVel(cp.v(0,0));
            }
            this.hitEffect();
            this.setGameState(GameState.GameOver);
            this.addChild(new GameOverLayer(), 0, TagOfLayer.GameOver);
        }
        return false;
    },

    collisionGroundBegin:function (arbiter, space) {
        if(GameState.Current == GameState.Play)
        {
            if(arbiter.a.collision_type == SpriteTag.Bird)
            {
                arbiter.a.getBody().setVel(cp.v(0,0));
            }
            else
            {
                arbiter.b.getBody().setVel(cp.v(0,0));
            }
            this.hitEffect();
            this.setGameState(GameState.GameOver);
            this.addChild(new GameOverLayer(), 0, TagOfLayer.GameOver);
        }
        return true;
    },

    hitEffect : function () {

        var overlay = new cc.LayerColor(
            new cc.Color(255, 255, 255, 200),
            cc.winSize.width,
            cc.winSize.height
        );

        cc.director.getRunningScene().addChild(overlay, 4);

        overlay.runAction(new cc.sequence(
            cc.fadeOut(0.2),
            cc.callFunc(function(target){
                target.removeChild(overlay);
            }, this)
        ));
    },

    checkBirdPassPipes:function()
    {
        var animationLayer = this.mainLayer.getChildByTag(TagOfLayer.Animation);
        var backgroundLayer = this.mainLayer.getChildByTag(TagOfLayer.Background);

        for (var i = 0; i < backgroundLayer.objects.length; i++) {
            var object = backgroundLayer.objects[i];
            if (object.pipeType == PipeType.Up && object.passed == false) {
                if(animationLayer.getBirdLeftEdgeX() > object.getRightEdgeX())
                {
                    object.passed = true;
                    this.getChildByTag(TagOfLayer.Status).addScore();
                }
            }
        }
    },

    update : function(dt) {
        this.space.step(dt);

        var animationLayer = this.mainLayer.getChildByTag(TagOfLayer.Animation);
        var eyeX = animationLayer.getEyeX();
        this.mainLayer.setPosition(cc.p(-eyeX,0));

        this.checkBirdPassPipes();
    },
    getMainLayer:function(){
        return this.mainLayer;
    },

    setGameState:function(currentState)
    {
        GameState.Current = currentState;

        if(GameState.Current == GameState.Play)
        {
            this.getChildByTag(TagOfLayer.Status).hideInstructions();
            this.getMainLayer().getChildByTag(TagOfLayer.Animation).stopBirdUpDownAction();
            this.getMainLayer().getChildByTag(TagOfLayer.Background).setShouldLoadPipeObjects(true);
            this.space.gravity = cp.v(0, g_spaceGravity);
        }
    },
});
