/**
 * Created by vutruong on 10/2/16.
 */

var AnimationLayer = cc.Layer.extend({
    spriteSheet: null,
    sprite: null,
    space: null,
    body: null,
    shape: null,
    birdStartX: 0,

    upDownAction: null,
    animateAction: null,

    birdFlapY: 0,
    birdCollideGround: false,
    continueUpdate: true,

    ctor: function (space) {
        this._super();
        this.space = space;
        this.init();
    },
    init: function () {
        this._super();

        cc.spriteFrameCache.addSpriteFrames(res.bird_plist);
        this.spriteSheet = new cc.SpriteBatchNode(res.bird_png);
        this.addChild(this.spriteSheet);

        this.initAction();

        this.sprite = new cc.PhysicsSprite("#bird0.png");

        var radius = this.sprite.getContentSize().width / 2;

        this.body = new cp.Body(1, cp.momentForCircle(1, 0, radius, cp.vzero));
        this.body.setVel(cp.v(g_birdVelX, 0));
        this.space.addBody(this.body);

        this.shape = new cp.CircleShape(this.body, radius, cp.vzero);
        this.shape.setCollisionType(SpriteTag.Bird);
        this.shape.setElasticity(0);
        this.shape.setFriction(0);
        this.space.addShape(this.shape);

        this.sprite.setBody(this.body);
        this.sprite.runAction(this.animateAction);
        this.sprite.runAction(this.upDownAction);

        this.spriteSheet.addChild(this.sprite);

        this.scheduleUpdate();
    },

    stopBirdUpDownAction: function () {
        this.sprite.stopAction(this.upDownAction);
    },

    initAction: function () {
        var animFrames = [];
        for (var i = 0; i < 3; i++) {
            var str = "bird" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            animFrames.push(frame);
        }

        var animation = new cc.Animation(animFrames, 0.1);
        this.animateAction = new cc.RepeatForever(new cc.Animate(animation));
        this.upDownAction = new cc.RepeatForever(new cc.Sequence(new cc.MoveBy(0.4, 0, 10), new cc.MoveBy(0.4, 0, -10)));
    },

    setBirdStartPos: function (x, y) {
        this.birdStartX = x;
        this.body.setPos(new cp.v(x, y));
    },

    setBirdCollideGround: function (birdCollideGround) {
        this.birdCollideGround = birdCollideGround;
    },

    getDistanceX: function () {
        return this.sprite.getPositionX() - this.birdStartX;
    },

    getBirdLeftEdgeX: function () {
        return this.sprite.getPositionX() - this.sprite.getContentSize().width / 2;
    },

    flapWings: function () {
        cc.audioEngine.playEffect(res.sfx_wing_ogg);
        this.body.setVel(cp.v(this.body.vx, g_birdVelY));
        this.birdFlapY = this.sprite.y;
    },

    rotateBird: function (dt) {
        var rotation = this.sprite.getRotation();
        if (GameState.Current == GameState.Play) {
            var birdY = this.sprite.y;
            if (birdY > this.birdFlapY) {
                rotation -= 300 * dt;
            }
            else {
                if (this.body.getVel().y < 0)
                    rotation -= this.body.getVel().y * dt;
            }

            rotation = cc.clampf(rotation, g_birdAngleMin, g_birdAngleMax);
            this.sprite.setRotation(rotation);
        }
        else if (GameState.Current == GameState.GameOver) {
            if (this.body.getVel().y < 0)
                rotation -= this.body.getVel().y * dt;

            if (this.birdCollideGround) {
                this.sprite.stopAllActions();
                rotation += 300 * dt;
            }

            rotation = cc.clampf(rotation, g_birdAngleMin, g_birdAngleMax);
            this.sprite.setRotation(rotation);

            if (rotation >= g_birdAngleMax) {
                this.sprite.stopAllActions();
                this.continueUpdate = false;
            }
        }
    },

    update: function (dt) {
        if (GameState.Current == GameState.Play || GameState.Current == GameState.GameOver && this.continueUpdate)
            this.rotateBird(dt);
    }
});
