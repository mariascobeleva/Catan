define([
    'jquery',
    'underscore',
    'backbone',
    'models/const'
], function($, _, Backbone,Const) {
    var playerModel = Backbone.Model.extend({
        defaults: {
            startTurn: true,
            secondTurn: true,
            name: "",
            color: "",
            victoryPoints: 0,
            army: 0,
            longestRoad: 0,

            "res_rock": 9,
            "res_tree": 4,
            "res_brick": 4,
            "res_sheep": 4,
            "res_wheat": 8,
            devCards: {
                "monopoly": 0,
                "knight": 0,
                "victoryPoint": 0,
                "roadBonus": 0,
                "resourcesBonus": 0
            },
            exchangeRate: {
                "tree": 4,
                "rock": 4,
                "brick": 4,
                "sheep": 4,
                "wheat": 4
            },
            roads: [],
            settlements: []
        },
        initialize: function(options) {

            if (options.roads) {
                this.set('roads', options.roads);
            }
            else {
                this.set('roads', []);
            }

            if (options.devCards) {
                this.set('devCards', options.devCards);
            }
            else {
                this.set('devCards', {
                        "monopoly": 0,
                        "knight": 0,
                        "victoryPoint": 0,
                        "roadBonus": 0,
                        "resourcesBonus": 0
                    }
                );
            }

            if (options.exchangeRate) {
                this.set('exchangeRate', options.exchangeRate);
            }
            else {
                this.set('exchangeRate', {
                        "tree": 4,
                        "rock": 4,
                        "brick": 4,
                        "sheep": 4,
                        "wheat": 4
                    }
                );
            }

            if (options.settlements) {
                this.set('settlements', options.settlements);
            }
            else {
                this.set('settlements', []);
            }
        },
        getResources: function(resource) {
            return this.get("res_" + resource);
        },
        setResources: function(resource, number) {
            this.set("res_" + resource, number, {type: resource});
        },
        spendResource: function(resources) {
            var k, newValue;
            for (k in resources) {
                newValue = this.getResources(k) + resources[k];
                this.setResources(k, newValue);
            }
        },
        getTotalAmountOfPlayerRes: function() {
            var resourcesAmount = 0;
            for (var i = 0; i < Const.resourcesTypes.length; i++) {
                resourcesAmount = resourcesAmount + this.getResources(Const.resourcesTypes[i]);
            }
            return resourcesAmount;
        },
        getExchangeRate: function(resource){
            return this.get("exchangeRate")[resource];

        },
        checkIfPlayerHaveResources: function(){
            var playerHaveRes = false;
            for (var i=0; i<Const.resourcesTypes.length; i++){
                if(this.getResources(Const.resourcesTypes[i]) !== 0){
                    playerHaveRes = true;
                    break;
                }
            }
            return playerHaveRes;
        },
        stealResource: function(robedPlayer) {
            var stolenResources = {};
            var resourcesForRobber = {};
            var stolenResource = Const.resourcesTypes[Math.floor(Math.random() * Const.resourcesTypes.length)];
            if (robedPlayer.getResources(stolenResource) > 0) {
                stolenResources[stolenResource] = -1;
                resourcesForRobber[stolenResource] = 1;
                robedPlayer.spendResource(stolenResources);
                this.spendResource(resourcesForRobber);
            }
            else {
                this.stealResource(robedPlayer);
            }
        },
        getVictoryPoints: function(){
            return this.get("victoryPoints");
        },
        setVictoryPoints: function(value){
            this.set("victoryPoints",value);
        },
        updateVictoryPoints: function(value){
            var currentVal = this.getVictoryPoints();
            var newVal = currentVal + value;
            this.setVictoryPoints(newVal);
        }
    });
    return playerModel;
});
