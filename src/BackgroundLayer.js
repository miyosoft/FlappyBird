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
    pipeUpObjects:[],
	pipeDownObjects:[],

    shouldLoadPipes: false,

    ctor:function (space) {
        this._super();

        this.pipeUpObjects = [];
		this.pipeDownObjects = [];
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

    loadPipes:function (map, mapIndex) {

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
            this.pipeUpObjects.push(pipe);
        }

        var pipeDownGroup = map.getObjectGroup("PipeDown");
        var pipeDownArray = pipeDownGroup.getObjects();
        for (var j = 0; j < pipeDownArray.length; j++) {
            var x = pipeDownArray[j]["x"];
            var y = pipeDownArray[j]["y"];
            var width = pipeDownArray[j]["width"];
            var height = pipeDownArray[j]["height"];

            var pipe = new Pipe(this,
                this.space,
                cc.p(x + this.mapWidth * mapIndex + width/2, y + height/2),
                PipeType.Down,
                width,
                height);
            pipe.mapIndex = mapIndex;
            this.pipeDownObjects.push(pipe);
        }
    },

    removePipes:function (mapIndex) {
		for(var i = this.pipeUpObjects.length - 1; i >= 0; i--){
			var pipe = this.pipeUpObjects[i];
			if(pipe.mapIndex == mapIndex){
				pipe.removeFromParent();
				this.pipeUpObjects.splice(i,1);
			}
		}

		for(var j = this.pipeDownObjects.length - 1; j >= 0; j--){
			var pipe = this.pipeDownObjects[j];
			if(pipe.mapIndex == mapIndex){
				pipe.removeFromParent();
				this.pipeDownObjects.splice(j,1);
			}
		}
    },

    setShouldLoadPipeObjects:function (shouldLoadPipeObjects)
    {
        this.shouldLoadPipes = shouldLoadPipeObjects;
    },

    checkAndReload:function (distanceX) {
        var newMapIndex = parseInt(distanceX / this.mapWidth);
        if (this.mapIndex == newMapIndex) {
            return false;
        }

        if (0 == newMapIndex % 2) {
            // change mapSecond
            this.map01.setPositionX(this.mapWidth * (newMapIndex + 1));
            if(this.shouldLoadPipes)
                this.loadPipes(this.map01, newMapIndex + 1);

        } else {
            // change mapFirst
            this.map00.setPositionX(this.mapWidth * (newMapIndex + 1));
            if(this.shouldLoadPipes)
                this.loadPipes(this.map00, newMapIndex + 1);

        }

        if(this.shouldLoadPipes)
            this.removePipes(newMapIndex - 1);

        this.mapIndex = newMapIndex;

        return true;
    },

    update:function (dt) {
        var animationLayer = this.getParent().getChildByTag(TagOfLayer.Animation);
        var distanceX = animationLayer.getDistanceX();
        this.checkAndReload(distanceX);

    }
});
