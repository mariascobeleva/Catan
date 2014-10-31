 define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {
    var bankModel = Backbone.Model.extend({
        defaults: {
            resources: {
                "wheat": 19,
                "tree": 19,
                "sheep": 19,
                "rock": 19,
                "brick": 19
            },
            devCards: {
                "monopoly": 2,
                "knight": 14,
                "victoryPoint": 5,
                "roadBonus": 2,
                "resourcesBonus": 2
            }
        },
        initialize: function(options){
            if (options.resources) {
                this.set('resources', options.resources);
            }
            else {
                this.set('resources', { "wheat": 19,
                    "tree": 19,
                    "sheep": 19,
                    "rock": 19,
                    "brick": 19});
            }
            if (options.devCards) {
                this.set('devCards', options.devCards);
            }
            else {
                this.set('devCards', {
                    "monopoly": 2,
                    "knight": 14,
                    "victoryPoint": 5,
                    "roadBonus": 2,
                    "resourcesBonus": 2
                });
            }
        }
    });
    return bankModel;
});
