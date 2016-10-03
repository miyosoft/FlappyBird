/**
 * Created by vutruong on 10/2/16.
 */

var StatusLayer = cc.Layer.extend({
    tapSprite: null,
    readySprite: null,
    scoreLabel : null,
    score:0,

    ctor:function(){
        this._super();
        this.init();
    },

    init:function(){
        this._super();

        var centerPos = cc.p(cc.winSize.width/2, cc.winSize.height/2);

        this.tapSprite = new cc.Sprite(res.tap_png);
        this.tapSprite.setPosition(centerPos);

        this.readySprite = new cc.Sprite(res.ready_png);
        this.readySprite.setPosition(centerPos.x, centerPos.y + 100);

        this.scoreLabel = new cc.LabelBMFont("0", res.flappyBird_fnt);
        this.scoreLabel.setPosition(centerPos.x, this.readySprite.y + 80);

        this.addChild(this.tapSprite);
        this.addChild(this.readySprite);
        this.addChild(this.scoreLabel);
    },

    onEnter:function(){
        this._super();
        var animationLayer = this.getParent().getMainLayer().getChildByTag(TagOfLayer.Animation);
        animationLayer.setBirdStartPos(cc.winSize.width/2 - this.tapSprite.width/2, this.tapSprite.y);
    },

    addScore:function(){
        this.score++;
        this.scoreLabel.setString(this.score.toString());
    },

    hideInstructions:function()
    {
        this.tapSprite.runAction(new cc.FadeTo(0.5, 0));
        this.readySprite.runAction(new cc.FadeTo(0.5, 0));
    }
});