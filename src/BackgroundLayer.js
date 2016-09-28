/**
 * Created by vutruong on 9/22/2016.
 */

var BackgroundLayer = cc.Layer.extend({
    bgSprite:null,
    ctor:function(){
        this._super();
        this.init();
    },
    init:function(){
        this._super();
        var centerPos = cc.p(cc.winSize.width/2, cc.winSize.height/2);
        this.bgSprite = new cc.Sprite(res.dayBG_png);
        this.bgSprite.setPosition(centerPos);
        this.bgSprite.setScale(cc.winSize.width/this.bgSprite.getContentSize().width,cc.winSize.height/this.bgSprite.getContentSize().height);
        this.addChild(this.bgSprite);

    }
});