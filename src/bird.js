/**
 * Created by vutruong on 9/23/2016.
 */

var Bird = cc.Node.extend({
    bridSpriteSheet: null,
    birdSprite: null,
    physicsBirdSprite: null,
    upDownAction: null,
    animateAction: null,

    space:null,
    body:null,
    shape:null,
    ctor: function(space){
        this._super();
        this.space = space;
        this.init();
    },
    init: function(){
        this._super();
        cc.spriteFrameCache.addSpriteFrames(res.bird_plist);
        this.birdSpriteSheet = new cc.SpriteBatchNode(res.bird_png);
        this.addChild(this.birdSpriteSheet);

        var animFrames = [];
        for(var i = 0; i < 3; i++){
            var str = "bird" + i + ".png";
            var frame =  cc.spriteFrameCache.getSpriteFrame(str);
            animFrames.push(frame);
        }
;
        var animation = new cc.Animation(animFrames, 0.1);
        this.animateAction = new cc.RepeatForever(new cc.Animate(animation));
        this.upDownAction = new cc.RepeatForever(new cc.Sequence(new cc.MoveBy(0.4,0,10), new cc.MoveBy(0.4,0,-10)));

        this.birdSprite = new cc.Sprite("#bird0.png");
        this.birdSprite.runAction(this.animateAction);
        this.birdSprite.runAction(this.upDownAction);
        this.birdSpriteSheet.addChild(this.birdSprite);

        var listener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "GameStateChanged",
            callback: function(event){
                var target = event.getCurrentTarget();
                var currentState = event.getUserData();
                if(currentState == GameState.Play)
                {
                    target.initPhysics();
                }
            }
        });
        cc.eventManager.addListener(listener, this);

        this.scheduleUpdate();
    },

    initPhysics:function(){
        this.birdSpriteSheet.removeChild(this.birdSprite, true);

        this.physicsBirdSprite = new cc.PhysicsSprite("#bird0.png");
        var contentSize = this.physicsBirdSprite.getContentSize();
        this.body = new cp.Body(1, cp.momentForBox(1, contentSize.width, contentSize.height));
        this.body.v_limit = g_birdVelLimit;
        this.space.addBody(this.body);

        this.shape = new cp.BoxShape(this.body, contentSize.width, contentSize.height);
        this.space.addShape(this.shape);

        this.physicsBirdSprite.setBody(this.body);
        this.physicsBirdSprite.setIgnoreBodyRotation(true);

        this.physicsBirdSprite.runAction(this.animateAction);
        this.birdSpriteSheet.addChild(this.physicsBirdSprite);
    },

    flapWings:function(){
        if(GameState.Current == GameState.Play)
        {
            this.body.applyImpulse(cp.v(0,g_birdVelLimit), cp.v(0,0));
            this.physicsBirdSprite.runAction(cc.rotateTo(0.1, g_birdAngleMin));
        }
    },

    rotateOnFall:function(dt){

        if(GameState.Current == GameState.Play)
        {
            if(this.body.getVel().y < 0)
            {
                var rotation = this.physicsBirdSprite.getRotation();
                rotation -= this.body.getVel().y * dt;
                rotation = cc.clampf(rotation, g_birdAngleMin, g_birdAngleMax);
                this.physicsBirdSprite.setRotation(rotation);
            }
        }
    },

    update:function(dt){
        if(GameState.Current == GameState.Play)
        {
            this.rotateOnFall(dt);
        }
    }
});