define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {
    var hexModel = Backbone.Model.extend({
        defaults: {
            "value":0,
            "type":0,
            "crossroads":[],
            "roads":[],
            "thief": "false",
            "neighbourHexes":[],
            "coords":{q:0,r:0}
        },
        initialize: function(options) {
            if (options.crossroads) {
                this.set('crossroads', options.crossroads);
            }
            else {
                this.set('crossroads', []);
            }
            if(options.roads){
                this.set('roads', options.roads);
            }
            else {
                this.set('roads', []);
            }
            if( options.neighbourHexes){
                this.set('neighbourHexes', options.neighbourHexes);
            }
            else {
                this.set('neighbourHexes', []);
            }
        }

    });
    return hexModel;
});