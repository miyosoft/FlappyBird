/**
 * Created by vutruong on 9/24/2016.
 */

var g_spaceGravity = -1000;

var g_birdVelY = 300;
var g_birdVelX = 140;
var g_birdAngleMin = -25;
var g_birdAngleMax = 90;

var g_groundHeight = 96;
var g_pipeTextureWidth = 52;
var g_pipeTextureHeight = 320;
var g_maxSoundEffects = 24;

if(typeof GameState == "undefined") {
    var GameState = {};
    GameState.Ready = 0;
    GameState.Play = 1;
    GameState.GameOver = 2;
    GameState.Current = 0;
};

if(typeof TagOfLayer == "undefined") {
    var TagOfLayer = {};
    TagOfLayer.Background = 0;
    TagOfLayer.Animation = 1;
    TagOfLayer.Menu = 2;
    TagOfLayer.Status = 3;
    TagOfLayer.GameOver = 4;
};

if(typeof SpriteTag == "undefined") {
    var SpriteTag = {};
    SpriteTag.Bird = 0;
    SpriteTag.Pipe = 1;
    SpriteTag.Ground = 2;
};

if(typeof PipeType == "undefined") {
    var PipeType = {};
    PipeType.Up = 0;
    PipeType.Down = 1;
};

