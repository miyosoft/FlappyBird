/**
 * Created by vutruong on 9/23/2016.
 */

var Bird = cc.Node.extend({
    bridSpriteSheet: null,
    birdSprite: null,
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

        this.birdSprite = new cc.PhysicsSprite("#bird0.png");
        this.birdSprite.setBody(new cp.StaticBody());
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
                    target.birdSprite.stopAction(target.upDownAction);
                    target.changeToDynamic();
                }
            }
        });
        cc.eventManager.addListener(listener, this);

        this.scheduleUpdate();
    },

    changeToDynamic:function(){
        var contentSize = this.birdSprite.getContentSize();
        this.body = new cp.Body(1, cp.momentForBox(1, contentSize.width, contentSize.height));
        this.body.v_limit = g_birdVelLimit;
        this.space.addBody(this.body);

        this.shape = new cp.BoxShape(this.body, contentSize.width, contentSize.height);
        this.space.addShape(this.shape);

        this.birdSprite.setBody(this.body);
        this.birdSprite.setIgnoreBodyRotation(true);
    },

    flapWings:function(){
        if(GameState.Current == GameState.Play)
        {
            this.body.applyImpulse(cp.v(0,g_birdVelLimit), cp.v(0,0));
            this.birdSprite.runAction(cc.rotateTo(0.1, g_birdAngleMin));
        }
    },

    rotateOnFall:function(dt){

        if(GameState.Current == GameState.Play)
        {
            if(this.body.getVel().y < 0)
            {
                var rotation = this.birdSprite.getRotation();
                rotation -= this.body.getVel().y * dt;
                rotation = cc.clampf(rotation, g_birdAngleMin, g_birdAngleMax);
                this.birdSprite.setRotation(rotation);
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