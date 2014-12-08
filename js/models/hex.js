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
        },
        getPlayersWhichBuiltOnHex: function(currentPlayer) {
            var playersRb = [];
            var playerNotInArray = true;
            for (var i = 0; i < this.get("crossroads").length; i++) {
                var crossroad = this.get("crossroads")[i];
                if (crossroad.get("player")) {
                    for (var j = 0; j < playersRb.length; j++) {
                        if (crossroad.get("player") === playersRb[j]) {
                            playerNotInArray = false;
                        }
                    }
                    if (playerNotInArray && crossroad.get("player") !== currentPlayer) {
                        playersRb.push(crossroad.get("player"));
                    }
                }
            }
            return playersRb;
        }
      });
    return hexModel;
});