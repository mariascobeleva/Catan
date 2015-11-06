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
            //"click .start-game": "startGame"
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
            this.renderStartGamePopup();
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
        renderStartGamePopup: function(){

            //TODO: make as a state.
            var that = this;
            that.$('.box .title-main').text('Кратко об игре');
            that.$('.short-rules').text(Const.rules).show();
            that.$('.box,#overlay').addClass('active');
            that.showPopupControlBtns('Начать Игру!');
            that.$('.confirm-btn').one('click',function(){
                that.$('.box,#overlay').removeClass('active');
                that.$('.confirm-btn').text('').hide();
                that.$('.short-rules').hide();
                that.startGame();
            });
        },
        renderCurrentPlayer: function() {
            //this.$(".players div .player").removeClass("active");
            //this.$(".players div:nth-child(" + (this.model.get("currentPlayer") + 1) + ") .player").addClass("active");
            var currentPlayer = this.model.getCurrentPlayer();
            $('.active-player-menu .name').text(currentPlayer.get('name'));
            this.renderCurrentPlayerResources(currentPlayer);

        },
        renderCurrentPlayerResources: function(currentPlayer) {
            $('.active-player-menu .res').each(function(){
                var res_quantity = currentPlayer.getResources($(this).data('name'));
                $(this).children('.quantity').text(res_quantity);
            });
        },
        displayPlayerResourcesForChange: function(player) {
            var k, value, prefix;
            for (k in player.attributes) {
                value = player.attributes[k];
                prefix = k.substring(0, 3);
                if (prefix === "res") {
                    this.$(".player-resources .res-" + k.substring(4) + " .quantity").text(value);
                }
            }
        },
        displayExchangeRate: function(player) {
            var j;
            for (j in player.attributes.exchangeRate) {
                this.$(".resources-for-change ." + j + " .rate").text("1 : " + player.attributes.exchangeRate[j]);
            }
        },
        showPopupControlBtns: function(btnConfirmText,btnRefuseText){
            if(btnConfirmText){
                this.$('.control-btns .confirm-btn').text(btnConfirmText).show();
            }
            if(btnRefuseText){
                this.$('.control-btns .cancel').text(btnRefuseText).show();
            }
        },
        hidePopupControlBtns: function(){
            this.$('.control-btns .confirm-btn, .control-btns .cancel').text("").off('click').hide();
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



