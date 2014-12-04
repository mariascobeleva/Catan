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
        },
        compare: function(coords_1, coords_2, q, r) {
            if ((coords_1.q.toFixed(2) === q && coords_1.r.toFixed(2) === r) ||
                (coords_2.q.toFixed(2) === q && coords_2.r.toFixed(2) === r)) {
                return true;
            }
        },
        checkIfSettlementIsBuild: function(currentPlayer, from, to, cur_q, cur_r) {
            var q, r;
            if (cur_q && cur_r) {
                return this.compare(from,to,cur_q,cur_r);
            }
            else {
                for (var i = 0; i < currentPlayer.get("settlements").length; i++) {
                    q = currentPlayer.get("settlements")[i].get("coords").q.toFixed(2);
                    r = currentPlayer.get("settlements")[i].get("coords").r.toFixed(2);
                    if (this.compare(from, to, q, r)){
                        return true;
                    }
                }
            }
            return false;
        }

    });
    return roadModel;
});