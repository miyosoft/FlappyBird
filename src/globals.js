/**
 * Created by vutruong on 9/24/2016.
 */

var g_groundMoveSpeed = 2;
var g_spaceGravity = -700;
var g_birdVelLimit = 400;
var g_birdAngleMin = -25;
var g_birdAngleMax = 90;
var g_groundHeight = 100;

if(typeof GameState == "undefined") {
    var GameState = {};
    GameState.Ready = 0;
    GameState.Play = 1;
    GameState.GameOver = 2;
    GameState.Current = 0;
};
