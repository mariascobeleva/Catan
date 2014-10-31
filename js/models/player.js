define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {
    var playerModel = Backbone.Model.extend({
        defaults: {
            startTurn: true,
            secondTurn:true,
            name: "",
            color: "",
            victoryPoints: 0,
            army: 0,
            longestRoad: 0,

            "res_rock": 0,
            "res_tree": 0,
            "res_brick": 0,
            "res_sheep": 0,
            "res_wheat": 0,
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
        initialize: function(options){
            if (options.resources) {
                this.set('resources', options.resources);
            }
            else {
                this.set('resources',  {
                    "rock": 0,
                    "tree": 0,
                    "brick": 0,
                    "sheep": 0,
                    "wheat": 0
                });
            }

            if(options.roads){
                this.set('roads', options.roads);
            }
            else {
                this.set('roads', []);
            }

            if( options.devCards){
                this.set('devCards', options.devCards);
            }
            else {
                this.set('devCards', {});
            }

            if( options.exchangeRate){
                this.set('exchangeRate', options.exchangeRate);
            }
            else {
                this.set('exchangeRate', {});
            }

            if(options.settlements){
                this.set('settlements', options.settlements);
            }
            else {
                this.set('settlements', []);
            }
        },
        getResources: function(resource){
            return this.get("res_" + resource);
        },
        increaseResources: function(resource,number) {
            var newValue = this.getResources(resource) + number;
            this.setResources(resource,newValue);
        },
        setResources:function(resource,number){
            this.set("res_" + resource, number, {type: resource});
        }

    });
    return playerModel;
});
