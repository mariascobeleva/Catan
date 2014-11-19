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
        },
        isAvailable: function(player,needRoad){
           if(this.get("type")===0) {
               if (needRoad) {
                   return this.checkIfRoadIsBuilt(player);
               }
               else {
                   return true;
               }
           }
        },
        q: function(){
            return this.get("coords").q.toFixed(2);
        },
        r: function(){
            return this.get("coords").r.toFixed(2);
        },
        checkIfRoadIsBuilt: function(currentPlayer) {
            for (var i = 0; i < currentPlayer.get("roads").length; i++) {
                if ((currentPlayer.get("roads")[i].get("from").q.toFixed(2) === this.q() && currentPlayer.get("roads")[i].get("from").r.toFixed(2) === this.r() ) ||
                    (currentPlayer.get("roads")[i].get("to").q.toFixed(2) === this.q() && currentPlayer.get("roads")[i].get("to").r.toFixed(2) === this.r())) {
                    return true;
                }
            }
            return false;
        }

    });
    return CrossRoad;
});
