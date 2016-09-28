/**
 * A brief explanation for "project.json":
 * Here is the content of project.json file, this is the global configuration for your game, you can modify it to customize some behavior.
 * The detail of each field is under it.
 {
    "project_type": "javascript",
    // "project_type" indicate the program language of your project, you can ignore this field

    "debugMode"     : 1,
    // "debugMode" possible values :
    //      0 - No message will be printed.
    //      1 - cc.error, cc.assert, cc.warn, cc.log will print in console.
    //      2 - cc.error, cc.assert, cc.warn will print in console.
    //      3 - cc.error, cc.assert will print in console.
    //      4 - cc.error, cc.assert, cc.warn, cc.log will print on canvas, available only on web.
    //      5 - cc.error, cc.assert, cc.warn will print on canvas, available only on web.
    //      6 - cc.error, cc.assert will print on canvas, available only on web.

    "showFPS"       : true,
    // Left bottom corner fps information will show when "showFPS" equals true, otherwise it will be hide.

    "frameRate"     : 60,
    // "frameRate" set the wanted frame rate for your game, but the real fps depends on your game implementation and the running environment.

    "noCache"       : false,
    // "noCache" set whether your resources will be loaded with a timestamp suffix in the url.
    // In this way, your resources will be force updated even if the browser holds a cache of it.
    // It's very useful for mobile browser debuging.

    "id"            : "gameCanvas",
    // "gameCanvas" sets the id of your canvas element on the web page, it's useful only on web.

    "renderMode"    : 0,
    // "renderMode" sets the renderer type, only useful on web :
    //      0 - Automatically chosen by engine
    //      1 - Forced to use canvas renderer
    //      2 - Forced to use WebGL renderer, but this will be ignored on mobile browsers

    "engineDir"     : "frameworks/cocos2d-html5/",
    // In debug mode, if you use the whole engine to develop your game, you should specify its relative path with "engineDir",
    // but if you are using a single engine file, you can ignore it.

    "modules"       : ["cocos2d"],
    // "modules" defines which modules you will need in your game, it's useful only on web,
    // using this can greatly reduce your game's resource size, and the cocos console tool can package your game with only the modules you set.
    // For details about modules definitions, you can refer to "../../frameworks/cocos2d-html5/modulesConfig.json".

    "jsList"        : [
    ]
    // "jsList" sets the list of js files in your game.
 }
 *
 */

cc.game.onStart = function(){
    if(!cc.sys.isNative && document.getElementById("cocosLoading")) //If referenced loading.js, please remove it
        document.body.removeChild(document.getElementById("cocosLoading"));

    // Pass true to enable retina display, on Android disabled by default to improve performance
    cc.view.enableRetina(cc.sys.os === cc.sys.OS_IOS ? true : false);

    // Adjust viewport meta
    cc.view.adjustViewPort(true);

    // Uncomment the following line to set a fixed orientation for your game
    // cc.view.setOrientation(cc.ORIENTATION_PORTRAIT);

    // Setup the resolution policy and design resolution size
    cc.view.setDesignResolutionSize(320, 480, cc.ResolutionPolicy.SHOW_ALL);

    // The game will be resized when browser size change
    cc.view.resizeWithBrowserSize(true);

    cc._loaderImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKsAAAB4CAMAAAC6nPKqAAAAsVBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+3mHKcAAAAOnRSTlMA6hYE5Lv5EfG+CPW2i9qylMJ1ysfQ7qqum0oM3yEcotSQcCyGeXzNpoA4n1GYJ2ZbVmxOQTUxYTxFZc+BdAAAC59JREFUeNrM2otyokAQBdAWBUFRNMACioJvfItv7/9/2A4iWcwmWxkUsyeppFJJyludqemeIZRFsdgWhM5qcJyd963Nad0fDmu1huPMPc+ybU1TVZHRdX3C6OxdYV+qmmbbwdzp1cbrcH8YdMpFykvnsulP56Ju+m6pIEsSHlUt+PbbYkVPtlo7JnJSd9Zdepbjm4F8SVpYocdV1gpeoTQV6DHFUQmvIk/pEYs6Xsk/U2YNvNqYMlLweg5lYuEnzCmDEX5Gj7h18FNC4mXgxwjEZ4+foxAfDV+TfhX+8utKluPPhbRS5PZTcvU7I8+BeJTxCdObnlqzTpke0mbDZDRLXlrhZj3qeZqPjybEY4OPrEUl6buVdjlF+I7yVbtd/LQwoYh7M+Lg4Z42YxlPzqSKJ5EkueS6/kRt9PdEdGhm32R93FkTdQIJCdn1fdNQREa9TvuqaluWbQWBx04GXhCww4Ft2dHhoKnrbDj3665bYmv689VasHdEp3QZpCJ9W/e+BqyoW8Rc73QUKKtitH6EbqczOB5m+9YuPI2WShTSXVBbybbHnpF2Jhrjqn6i5ytvfQDWXVPXOGZBpIyIQlzVKCdbmdWhSx4S1TZ91xp/lN6XRJ9y022yfKtUs2zRd73dj5RavlVNpjpJIAngrcsUf3RpgIhJ+bKBAp35d63aXQ9ZIrKinDUBm0TE/CxZa0QymIDy1q4CszZihSJ9Uy/dBi6I7IlDMY2nsRfIxpUkZMh6oSEYufIxjjA4jabsEmseWJoqKoah65OoQ0Ut6p7ruvW6708UJXBqo/4p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";
    //load resources
    cc.LoaderScene.preload(g_resources, function () {
        cc.director.runScene(new MenuScene());
    }, this);
};
cc.game.run();