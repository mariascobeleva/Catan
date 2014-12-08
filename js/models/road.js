define([
    'jquery',
    'underscore',
    'backbone',
], function($, _, Backbone) {
    var roadModel = Backbone.Model.extend({
        defaults: {
            "game":{},
            "road":false,
            "from":null,
            "to":null,
            "coords":{},
            "player":null,
            crossroads: {}
        },
        getRoadCoordsFrom: function(){
            return this.get("from").get("coords");
        },
        getRoadCoordsTo: function(){
            return this.get("to").get("coords");
        }
    });
    return roadModel;
});