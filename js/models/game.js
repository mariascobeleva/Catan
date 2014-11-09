define([
    'jquery',
    'underscore',
    'backbone',
    'models/player',
    "models/map",
    "models/bank",
    "models/dice",
], function($, _, Backbone, Player, Map, Bank, Dice) {
    var Game = Backbone.Model.extend({
        defaults: {
            players: [],
            map: null,
            bank: null,
            currentPlayer: false,
            dice: null,
            "crossroadClicked":false,
            "roadClicked":false,
            "counter":0
        },
        initialize: function(options){
            if (options.players) {
                this.set('players', options.players);
            }
            if(options.map){
                this.set('map', options.map);
            }
            if(options.bank){
                this.set('bank', options.bank);
            }
            if(options.dice){
                this.set('dice', options.dice);
            }


            var newMap = new Map ({
                "game":this
            });
            this.set("map", newMap);

            var newBank = new Bank ({});
            this.set("bank", newBank);

            var newDice = new Dice ({});
            this.set("dice", newDice);



            var p1 = new Player({name: "Masha", color: "red" });
            var p2 = new Player({name: "Sasha", color: "blue" });
            var p3 = new Player({name: "everest", color: "green" });

            this.set('players', [p1, p2, p3]);
        },
        getCurrentPlayer: function() {
            return this.get("players")[this.get("currentPlayer")];
        }

    });
    return Game;
});