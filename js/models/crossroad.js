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
            else {
                this.set('crossroads', []);
            }
            if(options.hexes){
                this.set('hexes', options.hexes);
            }
            else {
                this.set('hexes', []);
            }
            if(options.roads){
                this.set('roads', options.roads);
            }
            else {
                this.set('roads', []);
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
                if ((currentPlayer.get("roads")[i].getRoadCoordsFrom().q.toFixed(2) === this.q() && currentPlayer.get("roads")[i].getRoadCoordsFrom().r.toFixed(2) === this.r() ) ||
                    (currentPlayer.get("roads")[i].getRoadCoordsTo().q.toFixed(2) === this.q() && currentPlayer.get("roads")[i].getRoadCoordsTo().r.toFixed(2) === this.r())) {
                    return true;
                }
            }
            return false;
        },
        buildSettlement: function(player) {
            var q, r, bank;
            q = this.get("coords").q.toFixed(2);
            r = this.get("coords").r.toFixed(2);
            bank = this.get("game").get("bank");
            this.setSettlement(q, r, player);
            if(this.get("type") === 1) {
                player.spendResource({"brick": -1, "tree": -1, "wheat": -1, "sheep": -1});
                bank.spendResource({"brick":-1, "tree":-1, "sheep":-1, "wheat":-1});
            }
            else {
                player.spendResource({"rock": -3, "wheat": -2});
                bank.spendResource({"rock": -3, "wheat": -2});
            }
        },
        setSettlement: function(q, r, currentPlayer) {
            if (this.get("type") === 0) {
                this.UnableNeighborCrossroads(q, r);
                this.set("type", 1);
                if (this.get("harborType") !== "") {
                    this.changeExchangeRate(currentPlayer);
                }
                this.set("player",currentPlayer);
                currentPlayer.get("settlements").push(this);
            }
            else if (this.get("type") === 1) {
                this.set("type", 2);
            }
            currentPlayer.updateVictoryPoints(1);
        },
        UnableNeighborCrossroads: function(q, r) {
            var hex;
            for (var i = 0; i < this.get("hexes").length; i++) {
                hex = this.get("hexes")[i];
                for (var j = 0; j < hex.get("crossroads").length; j++) {
                    if (hex.get("crossroads")[j].get("coords").q.toFixed(2) === q &&
                        hex.get("crossroads")[j].get("coords").r.toFixed(2) === r) {
                        if (hex.get("crossroads")[j - 1]) {
                            if (hex.get("crossroads")[j - 1].get("type") !== 3 || hex.get("crossroads")[j - 1].get("type") !== 1) {
                                hex.get("crossroads")[j - 1].set("type", 3);
                            }
                            else {
                                hex.get("crossroads")[j - 1].set("type", 0);
                            }
                        }
                        else {
                            if (hex.get("crossroads")[5].get("type") !== 3 || hex.get("crossroads")[5].get("type") !== 1) {
                                hex.get("crossroads")[5].set("type", 3);
                            }
                            else {
                                hex.get("crossroads")[5].set("type", 0);
                            }
                        }
                        if (hex.get("crossroads")[j + 1]) {
                            if (hex.get("crossroads")[j + 1].get("type") !== 3 || hex.get("crossroads")[j + 1].get("type") !== 1) {
                                hex.get("crossroads")[j + 1].set("type", 3);
                            }
                            else {
                                hex.get("crossroads")[j + 1].set("type", 0);
                            }
                        }
                        else {
                            if (hex.get("crossroads")[0].get("type") !== 3 || hex.get("crossroads")[0].get("type") !== 1) {
                                hex.get("crossroads")[0].set("type", 3);
                            }
                            else {
                                hex.get("crossroads")[0].set("type", 0);
                            }
                        }
                    }
                }
            }
        },
        changeExchangeRate: function(player) {
            var harborType = this.get("harborType");
            if (harborType === "general-harbor") {
                var k;
                for (k in player.get("exchangeRate")) {
                    player.get("exchangeRate")[k] = 3;
                }
            }
            else {
                player.get("exchangeRate")[harborType] = 2;
            }
        }
    });
    return CrossRoad;
});
