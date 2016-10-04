/**
 * Created by vutruong on 10/2/16.
 */

var GameOverLayer = cc.Layer.extend({
    menu:null,
    medalSprite:null,
    gameOverSprite:null,
    scoreboardSprite:null,
    newBestSprite:null,
    scoreLabel:null,
    bestScoreLabel:null,
    score:0,
    lastBestScore:0,

    // constructor
    ctor:function (score) {
        this._super();
        this.init(score);
    },
    init:function (score) {
        this._super();

        this.score = score;
        var bestScore = cc.sys.localStorage.getItem("bestScore");
        this.lastBestScore = bestScore ? parseInt(bestScore) : 0;

        var centerPos = cc.p(cc.winSize.width/2, cc.winSize.height/2);

        cc.spriteFrameCache.addSpriteFrames(res.medal_plist);
        this.medalSprite = new cc.Sprite("#bronze.png");

        this.scoreboardSprite = new cc.Sprite(res.scoreboard_png);
        this.scoreboardSprite.setPosition(centerPos);

        this.scoreLabel = new cc.LabelBMFont("0", res.flappyBird_fnt);
        this.scoreLabel.setScale(0.5);
        this.scoreLabel.setAnchorPoint(1, 0.5);
        this.scoreLabel.setPosition(this.scoreboardSprite.getContentSize().width - 28, this.scoreboardSprite.getContentSize().height - 35);

        this.bestScoreLabel = new cc.LabelBMFont(this.lastBestScore.toString(), res.flappyBird_fnt);
        this.bestScoreLabel.setScale(0.5);
        this.bestScoreLabel.setAnchorPoint(1, 0.5);
        this.bestScoreLabel.setPosition(this.scoreboardSprite.getContentSize().width - 28, this.scoreboardSprite.getContentSize().height - 75);

        this.newBestSprite = new cc.Sprite(res.newBest_png);
        this.newBestSprite.setAnchorPoint(1, 0.5);
        this.newBestSprite.setPosition(this.scoreboardSprite.getContentSize().width - 65, this.scoreboardSprite.getContentSize().height - 67);

        this.gameOverSprite = new cc.Sprite(res.gameover_png);
        this.gameOverSprite.setPosition(centerPos.x, centerPos.y + 100);

        var playBtnSprite = new cc.Sprite(res.playBtn_png);
        var rankBtnSprite = new cc.Sprite(res.rankBtn_png);

        var playBtn = new cc.MenuItemSprite(playBtnSprite,null,this.onRestart, this);
        playBtn.setPositionX(-60);

        var rankBtn = new cc.MenuItemSprite(rankBtnSprite,null,this.onRestart, this);
        rankBtn.setPositionX(60);

        this.menu = new cc.Menu(playBtn, rankBtn);
        this.menu.setPosition(centerPos.x, centerPos.y - 115);

        var seq = new cc.Sequence(
            new cc.DelayTime(0.5),
            cc.callFunc(this.showGameOverSprite, this),
            new cc.DelayTime(1.0),
            cc.callFunc(this.showScoreboard, this),
            new cc.DelayTime(0.1),
            cc.callFunc(this.showMenu, this)
        );

        this.runAction(seq);
    },

    showGameOverSprite:function(){
        this.addChild(this.gameOverSprite);
        this.gameOverSprite.runAction(new cc.Sequence(
            cc.fadeOut(0),
            cc.fadeIn(0.1)
        ));
        cc.audioEngine.playEffect(res.sfx_swooshing_ogg);
    },

    showScoreboard:function(){
        this.scoreboardSprite.addChild(this.scoreLabel);
        this.scoreboardSprite.addChild(this.bestScoreLabel);
        this.addChild(this.scoreboardSprite);

        this.scoreboardSprite.runAction(new cc.Sequence(
            cc.fadeOut(0),
            cc.fadeIn(0.1),
            cc.callFunc(this.calcScore, this)
        ));
        cc.audioEngine.playEffect(res.sfx_swooshing_ogg);
    },

    calcScore:function(scoreBoard, currentLayer) {

        if(this.score > 0){
            var start = 1;
            var delayTime = (0.5/this.score);
            var delay = new cc.DelayTime(delayTime);
            var incrementSeq = new cc.Sequence(
                delay,
                cc.callFunc(function(layer){

                    this.scoreLabel.setString(start.toString());

                    if(this.score == start) {
                        this.scoreLabel.stopAllActions();
                        return;
                    }

                    start++;

                }, this)
            );

            this.scoreLabel.runAction(new cc.RepeatForever(incrementSeq));
        }

        if(this.score > this.lastBestScore)
        {
            var start = this.lastBestScore + 1;
            cc.log("1 start = " + start);
            var delayTime = (0.5/this.score - this.lastBestScore);
            var delay = new cc.DelayTime(delayTime);
            var incrementSeq = new cc.Sequence(
                delay,
                cc.callFunc(function(){

                    this.bestScoreLabel.setString(start.toString());

                    if(this.score == start) {
                        this.bestScoreLabel.stopAllActions();
                        return;
                    }

                    start++;

                }, this)
            );

            this.bestScoreLabel.runAction(new cc.RepeatForever(incrementSeq));
            this.scoreboardSprite.addChild(this.newBestSprite);
            cc.sys.localStorage.setItem("bestScore", this.score);
        }
    },

    showMenu:function(){
        this.addChild(this.menu);
    },
    onRestart:function (sender) {
        cc.audioEngine.playEffect(res.sfx_swooshing_ogg);
        GameState.Current = GameState.Ready;
        cc.director.runScene(new GamePlayScene());
    }
});