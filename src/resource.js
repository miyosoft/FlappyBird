var res = {
    dayBG_png : "res/images/dayBG.png",
    nightBG_png :"res/images/nightBG.png",
    bird_png : "res/images/bird.png",
    bird_plist : "res/images/bird.plist",
    gameName_png : "res/images/gameName.png",
    ground_png : "res/images/ground.png",
    playBtn_png : "res/images/playBtn.png",
    rankBtn_png : "res/images/rankBtn.png",
    ready_png : "res/images/ready.png",
    tap_png : "res/images/tap.png",
    map00_tmx : "res/images/map00.tmx",
    map01_tmx : "res/images/map01.tmx",
    pipeUp_png: "res/images/pipeUp.png",
    pipeDown_png: "res/images/pipeDown.png",
    scoreboard_png: "res/images/scoreboard.png",
    newBest_png: "res/images/new.png",
    gameover_png: "res/images/gameover.png",
    medal_png: "res/images/medal.png",
    medal_plist: "res/images/medal.plist",
    flappyBird_fnt: "res/fonts/flappyBird.fnt",
    sfx_swooshing_ogg : "res/sounds/sfx_swooshing.ogg",
    sfx_wing_ogg : "res/sounds/sfx_wing.ogg",
    sfx_hit_ogg : "res/sounds/sfx_hit.ogg",
    sfx_point_ogg : "res/sounds/sfx_point.ogg",
    sfx_die_ogg : "res/sounds/sfx_die.ogg"
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
