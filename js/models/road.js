define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {
    var roadModel = Backbone.Model.extend({
        "game":{},
        "road":false,
        "from":null,
        "to":null,
        "coords":{}
    });
    return roadModel;
});