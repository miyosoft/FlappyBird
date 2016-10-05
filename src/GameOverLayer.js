/**
 * Created by vutruong on 10/2/16.
 */

var GameOverLayer = cc.Layer.extend({
    menu:null,
    medalSprite:null,
    shineSpriteSheet:null,
    shineSprite:null,
    shineAction:null,
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

        this.scoreboardSprite = new cc.Sprite(res.scoreboard_png);
        this.scoreboardSprite.setPosition(centerPos);

        cc.spriteFrameCache.addSpriteFrames(res.medal_plist);
        this.medalSprite = new cc.Sprite("#bronze.png");
        this.medalSprite.setPosition(54, this.scoreboardSprite.getContentSize().height/2 - 4);

        cc.spriteFrameCache.addSpriteFrames(res.shine_plist);
        this.shineSpriteSheet = new cc.SpriteBatchNode(res.shine_png);
        this.shineSprite = new cc.Sprite("#shine0.png");
        var animFrames = [];
        for(var i = 0; i < 3; i++){
            var str = "shine" + i + ".png";
            var frame =  cc.spriteFrameCache.getSpriteFrame(str);
            animFrames.push(frame);
        }
        var animation = new cc.Animation(animFrames, 0.1);
        var animateAction = new cc.Animate(animation);
        this.shineAction = new cc.Sequence(
            animateAction,
            animateAction.reverse(),
            cc.callFunc(function(){
                var limits = new cc.p(this.medalSprite.getContentSize().width, this.medalSprite.getContentSize().height);
                var randX = (cc.rand() % limits.x);
                var randY = (cc.rand() % limits.y);

                this.shineSprite.setPosition(randX, randY);
            }, this)
        );
        this.shineSpriteSheet.addChild(this.shineSprite);
        this.medalSprite.addChild(this.shineSpriteSheet);

        this.scoreLabel = new cc.LabelBMFont("0", res.score_fnt);
        this.scoreLabel.setScale(0.5);
        this.scoreLabel.setAnchorPoint(1, 0.5);
        this.scoreLabel.setPosition(this.scoreboardSprite.getContentSize().width - 28, this.scoreboardSprite.getContentSize().height/2 + 28);

        this.bestScoreLabel = new cc.LabelBMFont(this.lastBestScore.toString(), res.score_fnt);
        this.bestScoreLabel.setScale(0.5);
        this.bestScoreLabel.setAnchorPoint(1, 0.5);
        this.bestScoreLabel.setPosition(this.scoreboardSprite.getContentSize().width - 28, this.scoreboardSprite.getContentSize().height/2 - 14);

        this.newBestSprite = new cc.Sprite(res.new_best_png);
        this.newBestSprite.setAnchorPoint(1, 0.5);
        this.newBestSprite.setPosition(this.scoreboardSprite.getContentSize().width - 65, this.scoreboardSprite.getContentSize().height/2 - 4);

        this.gameOverSprite = new cc.Sprite(res.game_over_png);
        this.gameOverSprite.setPosition(centerPos.x, centerPos.y + 100);

        var playBtnSprite = new cc.Sprite(res.play_button_png);
        var rankBtnSprite = new cc.Sprite(res.rank_button_png);

        var playBtn = new cc.MenuItemSprite(playBtnSprite,null,this.onRestart, this);
        playBtn.setPositionX(-60);

        var rankBtn = new cc.MenuItemSprite(rankBtnSprite,null,this.onRestart, this);
        rankBtn.setPositionX(60);

        this.menu = new cc.Menu(playBtn, rankBtn);
        this.menu.setPosition(centerPos.x, centerPos.y - 115);

        var action = new cc.Sequence(
            new cc.DelayTime(0.5),
            cc.callFunc(this.showGameOverSprite, this),
            new cc.DelayTime(1.0),
            cc.callFunc(this.showScoreboard, this),
            new cc.DelayTime(0.3),
            cc.callFunc(this.showMenu, this)
        );

        this.runAction(action);
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
            var i = 1;
            var delayTime = (0.5/this.score);
            var delay = new cc.DelayTime(delayTime);
            var incrementSeq = new cc.Sequence(
                delay,
                cc.callFunc(function(layer){

                    this.scoreLabel.setString(i.toString());

                    if(i == this.score) {
                        this.scoreLabel.stopAllActions();
                        return;
                    }

                    i++;

                }, this)
            );

            this.scoreLabel.runAction(new cc.RepeatForever(incrementSeq));
        }

        if(this.score > this.lastBestScore)
        {
            var j = this.lastBestScore + 1;
            var delayTime = (0.5/this.score - this.lastBestScore);
            var delay = new cc.DelayTime(delayTime);
            var incrementSeq = new cc.Sequence(
                delay,
                cc.callFunc(function(){

                    this.bestScoreLabel.setString(j.toString());

                    if(j == this.score) {
                        this.bestScoreLabel.stopAllActions();
                        return;
                    }

                    j++;

                }, this)
            );

            this.bestScoreLabel.runAction(new cc.RepeatForever(incrementSeq));
            this.scoreboardSprite.addChild(this.newBestSprite);
            cc.sys.localStorage.setItem("bestScore", this.score);
        }

        if(this.score >= 10)
            this.addMedal();
    },

    addMedal:function(){
        if(this.score >= 10  && this.score < 20){
            this.medalSprite.setSpriteFrame("bronze.png");
        }
        else if(this.score >= 20 && this.score < 30){
            this.medalSprite.setSpriteFrame("silver.png");
        }
        else if(this.score >= 30 && this.score < 40){
            this.medalSprite.setSpriteFrame("gold.png");
        }
        else if(this.score >= 40){
            this.medalSprite.setSpriteFrame("platinum.png");
        }

        this.medalSprite.setOpacity(0);
        this.scoreboardSprite.addChild(this.medalSprite);

        this.medalSprite.runAction(cc.fadeIn(0.1));

        this.shineSprite.runAction(new cc.RepeatForever(this.shineAction));
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