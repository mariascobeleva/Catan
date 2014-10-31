require.config({
    paths: {
        jquery: 'libs/jquery/jquery',
        underscore: 'libs/underscore/underscore',
        backbone: 'libs/backbone/backbone',
        text: 'libs/require/plugins/text',
        templates: '../templates'
    },
    shim: {
        'jquery':{
            exports: '$'
        },
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        }
    }

});


require(['jquery', 'debug', 'models/game', 'views/game'], function($, Debug, Game, GameView){
    var game = new Game({});
    var gameView = new GameView({model: game});
    gameView.render();
    $(document.body).prepend(gameView.$el);

    Debug.doFirstTurns();
});
