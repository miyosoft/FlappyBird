/**
 * Created by vutruong on 9/22/2016.
 */

var BackgroundLayer = cc.Layer.extend({
    map00:null,
    map01:null,
    mapWidth:0,
    mapIndex:0,
    space:null,
    spriteSheet:null,
    objects:[],

    shouldLoadPipeObjects: false,

    ctor:function (space) {
        this._super();

        this.objects = [];
        this.space = space;

        this.init();
    },

    init:function () {
        this._super();

        this.map00 = new cc.TMXTiledMap(res.map00_tmx);
        this.addChild(this.map00);

        this.mapWidth = this.map00.getContentSize().width;

        this.map01 = new cc.TMXTiledMap(res.map01_tmx);
        this.map01.setPosition(cc.p(this.mapWidth, 0));
        this.addChild(this.map01);

        this.scheduleUpdate();
    },

    loadObjects:function (map, mapIndex) {

        var pipeUpGroup = map.getObjectGroup("PipeUp");
        var pipeUpArray = pipeUpGroup.getObjects();
        for (var i = 0; i < pipeUpArray.length; i++) {
            var x = pipeUpArray[i]["x"];
            var y = pipeUpArray[i]["y"];
            var width = pipeUpArray[i]["width"];
            var height = pipeUpArray[i]["height"];

            var pipe = new Pipe(this,
                this.space,
                cc.p(x + this.mapWidth * mapIndex + width/2, y + height/2),
                PipeType.Up,
                width, height);
            pipe.mapIndex = mapIndex;
            this.objects.push(pipe);
        }

        var pipeDownGroup = map.getObjectGroup("PipeDown");
        var pipeDownArray = pipeDownGroup.getObjects();
        for (var i = 0; i < pipeDownArray.length; i++) {
            var x = pipeDownArray[i]["x"];
            var y = pipeDownArray[i]["y"];
            var width = pipeDownArray[i]["width"];
            var height = pipeDownArray[i]["height"];

            var pipe = new Pipe(this,
                this.space,
                cc.p(x + this.mapWidth * mapIndex + width/2, y + height/2),
                PipeType.Down,
                width,
                height);
            pipe.mapIndex = mapIndex;
            this.objects.push(pipe);
        }
    },

    removeObjects:function (mapIndex) {
        while((function (obj, index) {
            for (var i = 0; i < obj.length; i++) {
                if (obj[i].mapIndex == index) {
                    obj[i].removeFromParent();
                    obj.splice(i, 1);
                    return true;
                }
            }
            return false;
        })(this.objects, mapIndex));
    },

    removeObjectByShape:function (shape) {
        for (var i = 0; i < this.objects.length; i++) {
            if (this.objects[i].getShape() == shape) {
                this.objects[i].removeFromParent();
                this.objects.splice(i, 1);
                break;
            }
        }
    },

    setShouldLoadPipeObjects:function (shouldLoadPipeObjects)
    {
        this.shouldLoadPipeObjects = shouldLoadPipeObjects;
    },

    checkAndReload:function (eyeX) {
        var newMapIndex = parseInt(eyeX / this.mapWidth);
        if (this.mapIndex == newMapIndex) {
            return false;
        }

        if (0 == newMapIndex % 2) {
            // change mapSecond
            this.map01.setPositionX(this.mapWidth * (newMapIndex + 1));
            if(this.shouldLoadPipeObjects)
                this.loadObjects(this.map01, newMapIndex + 1);

        } else {
            // change mapFirst
            this.map00.setPositionX(this.mapWidth * (newMapIndex + 1));
            if(this.shouldLoadPipeObjects)
                this.loadObjects(this.map00, newMapIndex + 1);

        }

        if(this.shouldLoadPipeObjects)
            this.removeObjects(newMapIndex - 1);

        this.mapIndex = newMapIndex;

        return true;
    },

    update:function (dt) {
        var animationLayer = this.getParent().getChildByTag(TagOfLayer.Animation);
        var eyeX = animationLayer.getEyeX();
        this.checkAndReload(eyeX);

    }
});
