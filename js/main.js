require.config({
    paths: {
        jquery: 'libs/jquery/jquery',
        jquery_ui: "libs/jquery-ui/jquery-ui",
        underscore: 'libs/underscore/underscore',
        backbone: 'libs/backbone/backbone',
        backbone_sm: 'libs/backbone.statemachine/backbone.statemachine',
        text: 'libs/require/plugins/text',
        templates: '../templates'
    },
    shim: {
        'jquery':{
            exports: '$'
        },
        'jquery_ui':{
            deps: ["jquery"]
        },
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'backbone_sm': {
            deps: ['backbone']
        }
    }
});


require(['jquery','jquery_ui','debug', 'models/game', 'views/game'], function($, Jquery_ui, Debug, Game, GameView){
    var game = new Game({});
    var gameView = new GameView({model: game});
    gameView.render();
    $(document.body).prepend(gameView.$el);

    Debug.doFirstTurns();
});
