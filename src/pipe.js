/**
 * Created by vutruong on 10/2/16.
 */

var Pipe = cc.Class.extend({
    space: null,
    sprite: null,
    shape: null,
    _mapIndex: 0,// which map belongs to

    pipeType: 0,
    passed: false,
    get mapIndex() {
        return this._mapIndex;
    },
    set mapIndex(index) {
        this._mapIndex = index;
    },

    ctor: function (layer, space, pos, pipeType, pipeWidth, pipeHeight) {
        this.space = space;
        this.pipeType = pipeType;

        if (this.pipeType == PipeType.Up) {
            this.sprite = new cc.PhysicsSprite(res.pipe_up_png, cc.rect(0, g_pipeTextureHeight - pipeHeight, g_pipeTextureWidth, pipeHeight));
        }
        else {
            this.sprite = new cc.PhysicsSprite(res.pipe_down_png, cc.rect(0, 0, g_pipeTextureWidth, pipeHeight));
        }
        this.sprite.setScaleX(pipeWidth / this.sprite.getContentSize().width);

        var body = new cp.StaticBody();
        body.setPos(pos);
        this.sprite.setBody(body);

        this.shape = new cp.BoxShape(body,
            pipeWidth,
            pipeHeight);
        this.shape.setCollisionType(SpriteTag.Pipe);
        this.shape.setElasticity(0);
        this.shape.setFriction(0);

        this.space.addStaticShape(this.shape);
        layer.addChild(this.sprite);
    },

    removeFromParent: function () {
        this.space.removeStaticShape(this.shape);
        this.shape = null;
        this.sprite.removeFromParent();
        this.sprite = null;
    },

    getShape: function () {
        return this.shape;
    },

    getLeftEdgeX: function () {
        return this.sprite.getPositionX() - this.sprite.getBoundingBox().width / 2;
    }
});