define([
    'jquery',
    'underscore',
    'backbone',
    'models/player',
    "models/map",
    "models/bank",
    "models/dice",
    "models/const"
], function($, _, Backbone, Player, Map, Bank, Dice, Const) {
    var Game = Backbone.Model.extend({
        defaults: {
            "players": [],
            "map": null,
            "bank": null,
            "currentPlayer": 2,
            "dice": null,
            "robedHex": null,
        },
        initialize: function(options) {
            if (options.players) {
                this.set('players', options.players);
            }
            if (options.map) {
                this.set('map', options.map);
            }
            if (options.bank) {
                this.set('bank', options.bank);
            }
            if (options.dice) {
                this.set('dice', options.dice);
            }
            if (options.robedHex) {
                this.set('dice', options.robedHex);
            }


            var newMap = new Map({
                "game": this
            });
            this.set("map", newMap);

            var newBank = new Bank({});
            this.set("bank", newBank);

            var newDice = new Dice({});
            this.set("dice", newDice);


            var p1 = new Player({name: "Игрок 1", color: "red" });
            var p2 = new Player({name: "Игрок 2", color: "blue" });
            var p3 = new Player({name: "Игрок 3", color: "violet" });

            // TODO: Shuffle players;

            this.set('players', [p1, p2, p3]);

        },
        getCurrentPlayer: function() {
            return this.get("players")[this.get("currentPlayer")];
        },
        nextPlayer: function() {
            var currentPlayer = this.get("currentPlayer");
            if (currentPlayer === (this.get("players").length - 1)) {
                this.set("currentPlayer", 0);
            }
            else {
                this.set("currentPlayer", (currentPlayer + 1));
            }
        },
        prevPlayer: function() {
            var currentPlayer = this.get("currentPlayer");
            if (currentPlayer === 0) {
                this.set("currentPlayer", (this.get("players").length - 1));
            }
            else {
                this.set("currentPlayer", (currentPlayer - 1));
            }
        },


        doGrabResource: function(settlement, hex) {
            var resource = hex.get("type");
            var value = settlement.get("type");
            var changedResources = {};
            changedResources[resource] = value;
            settlement.get('player').spendResource(changedResources);
            this.get("bank").spendResource(changedResources);
        },
        grabResources: function(settlement, dice_value) {
            if (!settlement.get("type")) {
                console.error('WTF!! Someone is trying to count empty crossroad as resources.');
                return;
            }
            for (var k = 0; k < settlement.get("hexes").length; k++) {
                var hex = settlement.get("hexes")[k];
                if ((dice_value && hex.get("value") === dice_value) || !dice_value) {
                    this.doGrabResource(settlement, hex);
                }
            }
        },
        grabResourcesGlobal: function(diceAmount) {
            for (var i = 0; i < this.get("players").length; i++) {
                var player = this.get("players")[i];
                for (var j = 0; j < player.get("settlements").length; j++) {
                    var settlement = player.get("settlements")[j];
                    this.grabResources(settlement, diceAmount);
                }
            }
        },
        checkPlayerResourcesForSettlement: function(player) {
            if (player.getResources("tree") >= 1 &&
                player.getResources("brick") >= 1 &&
                player.getResources("sheep") >= 1 &&
                player.getResources("wheat") >= 1) {
                return true;
            }
            return false;
        },
        checkPlayerResourcesForCity: function(player) {
            if (player.getResources("wheat") >= 2 &&
                player.getResources("rock") >= 3) {
                return true;
            }
            return false;
        },
        checkPlayersAvailableSettlements: function(player){
            for(var i=0; i < player.get('settlements').length; i++){
                if(player.get('settlements')[i].get('type') === 1){
                    return true;
                }
            }
            return false;
        },
        checkPlayerResourcesForHighway: function(player) {
            if (player.getResources("tree") >= 1 && player.getResources("brick") >= 1) {
                return true;
            }
            return false;
        },
        getThiefCoords: function($thief) {
            var thiefCoords = {};
            thiefCoords.q = $thief.data('q');
            thiefCoords.r = $thief.data('r');
            return thiefCoords;
        },
        setRobedHex: function(hex) {
            if (this.get("robedHex")) {
                this.get("robedHex").set("thief", false);
            }
            hex.set("thief", true);
            this.set("robedHex", hex);
        },
        getPlayersWithMoreThanSevenResources: function() {
            var richPlayers = [];
            var players = this.get("players");
            for (var i = 0; i < players.length; i++) {
                var player = this.get("players")[i];
                if (player.getTotalAmountOfPlayerRes() > 7) {
                    richPlayers.push(player);
                }
            }
            return richPlayers;
        }
    });
    return Game;
})
;