/**
 * Created by vutruong on 10/2/16.
 */

var AnimationLayer = cc.Layer.extend({
    spriteSheet: null,
    sprite: null,
    space:null,
    body:null,
    shape:null,
    birdStartX:0,

    upDownAction: null,
    animateAction: null,

    startX: 0,

    ctor:function (space) {
        this._super();
        this.space = space;
        this.init();
    },
    init:function () {
        this._super();

        cc.spriteFrameCache.addSpriteFrames(res.bird_plist);
        this.spriteSheet = new cc.SpriteBatchNode(res.bird_png);
        this.addChild(this.spriteSheet);

        this.initAction();

        this.sprite = new cc.PhysicsSprite("#bird0.png");
        var contentSize = this.sprite.getContentSize();

        var radius = this.sprite.getContentSize().width / 2;

        this.body = new cp.Body(1, cp.momentForCircle(1, 0, radius, cp.vzero));
        this.body.v_limit = g_birdVelLimit;
        this.body.applyImpulse(cp.v(150, 0), cp.v(0, 0));//run speed
        this.space.addBody(this.body);

        this.shape = new cp.CircleShape(this.body, radius, cp.vzero);
        this.shape.setCollisionType(SpriteTag.Bird);
        this.shape.setElasticity(0);
        this.shape.setFriction(0);
        this.space.addShape(this.shape);

        this.sprite.setBody(this.body);
        this.sprite.setIgnoreBodyRotation(true);
        this.sprite.runAction(this.animateAction);
        this.sprite.runAction(this.upDownAction);

        this.spriteSheet.addChild(this.sprite);

        this.scheduleUpdate();
    },

    stopBirdUpDownAction:function()
    {
        this.sprite.stopAction(this.upDownAction);
    },

    initAction:function () {
        var animFrames = [];
        for(var i = 0; i < 3; i++){
            var str = "bird" + i + ".png";
            var frame =  cc.spriteFrameCache.getSpriteFrame(str);
            animFrames.push(frame);
        }

        var animation = new cc.Animation(animFrames, 0.1);
        this.animateAction = new cc.RepeatForever(new cc.Animate(animation));
        this.upDownAction = new cc.RepeatForever(new cc.Sequence(new cc.MoveBy(0.4,0,10), new cc.MoveBy(0.4,0,-10)));
    },

    setBirdStartPos:function (x, y)
    {
        this.birdStartX = x;
        this.body.setPos(new cp.v(x, y));
    },

    getEyeX:function () {
        return this.sprite.getPositionX() - this.birdStartX;
    },

    getBirdLeftEdgeX:function(){
        return this.sprite.getPositionX() - this.sprite.getContentSize().width/2;
    },

    flapWings:function(){
        this.body.applyImpulse(cp.v(0,g_birdVelLimit), cp.v(0,0));
        this.sprite.runAction(cc.rotateTo(0.1, g_birdAngleMin));
    },

    rotateOnFall:function(dt){
        var rotation = this.sprite.getRotation();

        if(this.body.getVel().y < 0 && rotation < g_birdAngleMax)
        {
            rotation -= this.body.getVel().y * dt;
        }

        if(GameState.Current == GameState.GameOver && rotation < g_birdAngleMax)
        {
            rotation += 10;

        }

        rotation = cc.clampf(rotation, g_birdAngleMin, g_birdAngleMax);
        this.sprite.setRotation(rotation);
    },

    update:function(dt){
        this.rotateOnFall(dt);
    }

});
