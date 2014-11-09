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
], function($, _, Backbone, Debug, Const, GameTemplate, PlayerView, MapView, DiceView) {
    var GameView = Backbone.View.extend({
        className: "game",
        playerViews: [],
        events: {
            "click .start-game": "startGame",
            "click .end-turn": "endOfTurn",
            'click .build-settlement': "build",
            "click .change-with-bank": "clickChangeResources",
            "click #close": "clickCloseButton",
            "click .player-resources span": "clickPlayerResourceForChange",
            "click .resources-for-change span": "clickResourceForChange",
            "click .change-resources #confirm": "changeResourceInBank"
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
            for (var i = 0; i < this.model.get("players").length; i++) {
                this.model.get("players")[i].on("change:startTurn", this.endOfTurnForStartTurn, this);
            }
            for (var j = 0; j < this.model.get("players").length; j++) {
                this.model.get("players")[j].on("change:secondTurn", this.endOfTurn, this);
            }

            this.model.on("change:counter", this.stopListeningStartTurn, this);
        },
        stopListeningStartTurn: function() {
            if (this.model.get("counter") === this.model.get("players").length) {
                for (var i = 0; i < this.model.get("players").length; i++) {
                    this.model.get("players")[i].off("change:startTurn");
                }
                this.model.set("counter", 0);
            }
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
        startGame: function() {
            Debug.log("$('.start-game').click();");
            this.assignCurrentPlayerForStartTurn();
        },
        assignCurrentPlayer: function() {
            if (this.model.get("currentPlayer") + 1 === this.model.get("players").length) {
                this.model.set("currentPlayer", 0);
            }
            else {
                this.model.set("currentPlayer", (this.model.get("currentPlayer") + 1));
            }
            this.renderCurrentPlayer();
        },
        assignCurrentPlayerForStartTurn: function() {
            var currentPlayer;
            if (this.model.get("currentPlayer") === false) {
                currentPlayer = this.model.get("players")[Math.floor(Math.random() * this.model.get("players").length)];
                this.model.set("currentPlayer", (this.model.get("players").indexOf(currentPlayer)));
            }
            else if (this.model.get("currentPlayer") - 1 < 0) {
                this.model.set("currentPlayer", 2);
            }
            else {
                this.model.set("currentPlayer", (this.model.get("currentPlayer") - 1));
            }
            this.renderCurrentPlayer();
        },
        removeBlinkingElements: function() {
            $(".blinking").removeClass("blinking");
        },
        endOfTurnForStartTurn: function() {
            Debug.log("$('.end-of-turn-for-start-turn').click();");
            this.model.set("crossroadClicked", false);
            this.model.set("roadClicked", false);
            this.removeBlinkingElements();
            this.assignCurrentPlayerForStartTurn();
        },
        renderCurrentPlayer: function() {
            this.$(".players div .player").removeClass("active");
            this.$(".players div:nth-child(" + (this.model.get("currentPlayer") + 1) + ") .player").addClass("active");
        },
        endOfTurn: function() {
            Debug.log("$('.end-turn').click();");
            this.model.set("crossroadClicked", false);
            this.model.set("roadClicked", false);
            this.assignCurrentPlayer();
            if (this.model.getCurrentPlayer().get("startTurn") === false &&
                this.model.getCurrentPlayer().get("secondTurn") === false) {
                this.doTurn();
            }
        },
        doTurn: function() {
            this.model.get("dice").setDiceValue();
            this.checkResources();

        },
        build: function() {
            Debug.log("$('.build-settlement').click();");

            if (this.$('.crossroad.blinking').length) {
                this.$('.crossroad.blinking').trigger('buildSettlement');
                this.model.set("crossroadClicked", false);
                if (this.model.getCurrentPlayer().get("startTurn") === false &&
                    this.model.getCurrentPlayer().get("secondTurn") === true) {
                    this.gatherResourcesFirstTime();
                }
            }
            else if (this.$('.crossroad.city-blinking').length) {
                this.$('.crossroad.city-blinking').trigger('buildSettlement');
                this.model.set("crossroadClicked", false);
            }
            else if (this.$('.road.blinking').length) {
                this.$('.road.blinking').trigger('buildRoad');
                this.model.set("roadClicked", false);
            }
            else {
                alert('Something wrong (e.g. is not your turn.)');
            }
        },
        gatherResourcesFirstTime: function() {
            var currentPlayer = this.model.getCurrentPlayer();
            var settlement = currentPlayer.get("settlements")[currentPlayer.get("settlements").length - 1];

            for (var k = 0; k < settlement.get("hexes").length; k++) {
                var hex = settlement.get("hexes")[k];
                this.gatherResources(settlement, currentPlayer, hex);
            }
        },
        getDiceAmount: function() {
            return this.model.get("dice").get("value_1") + this.model.get("dice").get("value_2");
        },
        checkResources: function() {
            var diceAmount = this.getDiceAmount();
            for (var i = 0; i < this.model.get("players").length; i++) {
                var player = this.model.get("players")[i];
                for (var j = 0; j < player.get("settlements").length; j++) {
                    var settlement = player.get("settlements")[j];
                    for (var k = 0; k < settlement.get("hexes").length; k++) {
                        var hex = settlement.get("hexes")[k];
                        if (hex.get("value") === diceAmount) {
                            this.gatherResources(settlement, player, hex);
                        }
                    }
                }
            }
        },
        gatherResources: function(settlement, currentPlayer, hex) {
            var resource = hex.get("type");
            var value = settlement.get("type");
            var changedResources = {};
            changedResources[resource] = value;
            currentPlayer.spendResource(changedResources);
            this.model.get("bank").spendResource(changedResources);
        },
        clickChangeResources: function() {
            this.$("#overlay, .exchange-field").addClass("active");

            var currentPlayer = this.model.getCurrentPlayer();
            this.displayPlayerResourcesForChange(currentPlayer);
            this.displayExchangeRate(currentPlayer);
        },
        displayPlayerResourcesForChange: function(player) {
            var k, value, prefix;
            for (k in player.attributes) {
                value = player.attributes[k];
                prefix = k.substring(0, 3);
                if (prefix === "res") {
                    this.$(".player-resources ." + k.substring(4)).text(value);
                }
            }
        },
        displayExchangeRate: function(player) {
            var j;
            for (j in player.attributes.exchangeRate) {
                this.$(".resources-for-change ." + j).text("1 : " + player.attributes.exchangeRate[j]);
            }
        },
        clickPlayerResourceForChange: function(event) {
            this.$(".player-resources span").removeClass("active");
            $(event.currentTarget).addClass("active");
        },
        clickResourceForChange: function(event) {
            this.$(".resources-for-change span").removeClass("active");
            $(event.currentTarget).addClass("active");
        },
        changeResourceInBank: function() {
            var playerResource, resourceToBuy, currentPlayer, rate;
            playerResource = this.$(".player-resources span.active").attr("name");
            resourceToBuy = this.$(".resources-for-change span.active").attr("name");
            currentPlayer = this.model.getCurrentPlayer();
            rate = currentPlayer.get("exchangeRate")[playerResource];

            if (currentPlayer.getResources(playerResource) >= rate) {
                var changedResources = {};
                changedResources[playerResource] = -rate;
                changedResources[resourceToBuy] = 1;
                currentPlayer.spendResource(changedResources);
                this.model.get("bank").spendResource(changedResources);
                this.displayPlayerResourcesForChange(currentPlayer);
            }
        },
        clickCloseButton: function() {
            this.$("#overlay, .exchange-field, .change-resources span").removeClass("active");
        }
    });

    return GameView;
});