 define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {
    var bankModel = Backbone.Model.extend({
        defaults: {
            "res_wheat": 19,
            "res_tree": 19,
            "res_sheep": 19,
            "res_rock": 19,
            "res_brick": 19,
            "devCard_monopoly": 2,
            "devCard_knight": 14,
            "devCard_victoryPoint": 5,
            "devCard_roadBonus": 2,
            "devCard_resourcesBonus": 2
        },
        initialize: function(options){
            if (options.resources) {
                this.set('resources', options.resources);
            }
            if (options.devCards) {
                this.set('devCards', options.devCards);
            }
        },
        getResource: function(resource){
            return this.get("res_" + resource);
        },
        setResource: function(resource,value){
            this.set("res_" + resource, value);
        },
        useResource: function(resource, quantity){
            var newValue = this.getResource(resource) + quantity;
            this.setResource(resource,newValue);
        }
    });
    return bankModel;
});
