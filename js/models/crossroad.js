define([
    'jquery',
    'underscore',
    'backbone',
    "models/road",
    "models/hex"
], function($, _, Backbone, Road, Hex) {
    var CrossRoad = Backbone.Model.extend({
        defaults:{
            "game":{},
            "neighbourPoints": [],
            "hexes": [],
            "type": 0,
            "roads":[],
            "harborType":"",
            "player":"",
            "coords":{q:0,r:0}
        },
        initialize: function(options){
            if (options.crossroads) {
                this.set('crossroads', options.crossroads);
            }
            if(options.hexes){
                this.set('hexes', options.hexes);
            }
            if( options.neighbourPoints){
                this.set('neighbourPoints', options.neighbourPoints);
            }
            if(options.game){
                this.set("game", options.game);
            }
        }
    });
    return CrossRoad;
});
