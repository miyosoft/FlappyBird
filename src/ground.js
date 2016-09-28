/**
 * Created by vutruong on 9/23/2016.
 */

var Ground = cc.Node.extend({
    space:null,
    sprite1: null,
    sprite2: null,
    spriteIndex: 0,

    ctor: function(space){
        this._super();
        this.space = space;
        this.init();
    },

    init: function(){
        this._super();

        this.sprite1 = new cc.Sprite(res.ground_png);
        this.sprite1.setScale(cc.winSize.width/this.sprite1.getContentSize().width, g_groundHeight/this.sprite1.getContentSize().height);
        this.sprite1.setAnchorPoint(cc.p(0,0));

        this.sprite2 = new cc.Sprite(res.ground_png);
        this.sprite2.setScale(cc.winSize.width/this.sprite1.getContentSize().width, g_groundHeight/this.sprite1.getContentSize().height);
        this.sprite2.setAnchorPoint(cc.p(0,0));
        this.sprite2.setPositionX(cc.winSize.width);
        this.addChild(this.sprite1);
        this.addChild(this.sprite2);

        this.scheduleUpdate();
    },

    checkAndReload:function (deltaX) {
        var spriteNewIndex = parseInt(deltaX / cc.winSize.width);

        if (this.spriteIndex == spriteNewIndex) {
            return false;
        }

        if (0 == spriteNewIndex % 2) {
            // change to sprite2
            this.sprite2.setPositionX(cc.winSize.width * (spriteNewIndex + 1));
        } else {
            // change to sprite1
            this.sprite1.setPositionX(cc.winSize.width * (spriteNewIndex + 1));
        }
        this.spriteIndex = spriteNewIndex;

        return true;
    }
});