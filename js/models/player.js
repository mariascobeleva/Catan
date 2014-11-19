define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {
    var playerModel = Backbone.Model.extend({
        defaults: {
            startTurn: true,
            secondTurn: true,
            name: "",
            color: "",
            victoryPoints: 0,
            army: 0,
            longestRoad: 0,

            "res_rock": 1,
            "res_tree": 4,
            "res_brick": 4,
            "res_sheep": 0,
            "res_wheat": 4,
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
        }
    });
    return playerModel;
});
