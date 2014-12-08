define([
    'jquery',
    'underscore',
    'backbone',
    "debug",
    "models/const",
    'text!templates/game.html',
    'views/player',
    "views/map",
    "views/dice",
    'statemachine/robber',
    "statemachine/firstTurns",
    "statemachine/secondTurn",
    "statemachine/rollDice",
    "statemachine/mainGame",
    "statemachine/trading",
    "statemachine/building",
    "statemachine/endOfGame",
    'backbone_sm'
], function($, _, Backbone, Debug, Const, GameTemplate, PlayerView, MapView, DiceView, robber, firstTurns, secondTurn, rollDice, mainGame, trading, building, endOfGame) {
    var GameView;
    GameView = Backbone.StatefulView.extend({
        states: {
            init: {}
        },
        transitions: {
            init: {
                initialized: 'ftSettlement'
            }
        },
        startGame: function() {
            Debug.log("$('.start-game').click();");
            this.renderCurrentPlayer();
            this.trigger('initialized');
        },
        className: "game",
        playerViews: [],
        events: {
            "click .start-game": "startGame"
        },
        initialize: function() {
            this.addListeners();
        },
        render: function() {
            var htmlTemplate = _.template(GameTemplate);
            var $game = $(htmlTemplate({}));
            this.$el.append($game);
            this.renderPlayers();
            this.renderMap();
            this.renderDice();
            return this;
        },
        addListeners: function() {
            this.model.on("change:currentPlayer", this.renderCurrentPlayer, this);
        },
        renderPlayers: function() {
            var players = this.model.get('players');
            var $players = $('<div class="players"></div>');
            for (var i = 0; i < players.length; i++) {
                var p = new PlayerView({model: players[i]});
                $players.append(p.render().el);
                this.playerViews.push(p);
            }
            this.$el.append($players);
        },
        renderMap: function() {
            var mapView = new MapView({model: this.model.get("map")});
            this.$el.append(mapView.render().el);
        },
        renderDice: function() {
            var diceView = new DiceView({model: this.model.get("dice")});
            this.$el.append(diceView.render().el);
        },
        renderCurrentPlayer: function() {
            this.$(".players div .player").removeClass("active");
            this.$(".players div:nth-child(" + (this.model.get("currentPlayer") + 1) + ") .player").addClass("active");
        },
        displayPlayerResourcesForChange: function(player) {
            var k, value, prefix;
            for (k in player.attributes) {
                value = player.attributes[k];
                prefix = k.substring(0, 3);
                if (prefix === "res") {
                    this.$(".player-resources .res-" + k.substring(4)).text(value);
                }
            }
        },
        displayExchangeRate: function(player) {
            var j;
            for (j in player.attributes.exchangeRate) {
                this.$(".resources-for-change ." + j + " .rate").text("1 : " + player.attributes.exchangeRate[j]);
            }
        }

    });
    firstTurns(GameView);
    secondTurn(GameView);
    mainGame(GameView);
    rollDice(GameView);
    trading(GameView);
    building(GameView);
    robber(GameView);
    endOfGame(GameView);
    return GameView;
});



