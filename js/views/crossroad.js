define([
    'jquery',
    'underscore',
    'backbone',
    'debug',
    "models/const"

], function($, _, Backbone, Debug, Const) {
    var CrossroadView = Backbone.View.extend({
        className: 'crossroad',
        hexViews: [],
        events: {
        },

        initialize: function() {

            this.x = Const.HEX_EDGE_SIZE * 3 / 2 * (this.model.get('coords').q);
            this.y = Const.HEX_EDGE_SIZE * Math.sqrt(3) * (this.model.get('coords').r + this.model.get('coords').q / 2);

            // Adjust for field centering.
            this.x = this.x + (Const.FIELD_WIDTH);
            this.y = this.y + (Const.FIELD_HEIGHT);

            this.x = this.x - (Const.CROSSROAD_HEIGHT / 2);
            this.y = this.y - (Const.CROSSROAD_HEIGHT / 2);

            this.x = Math.round(this.x);
            this.y = Math.round(this.y);

            this.addListeners();
            this.$el.data('view', this);
        },
        render: function() {
            this.$el.css({'left': this.x, 'top': this.y});
            return this;
        },
        addListeners: function() {
            this.model.on("change:type", this.renderCrossroadWithSettlement, this);
            this.model.on("highlight", this.doHighlight, this);
            this.model.on("highlightAsCity", this.doHighlightAsCity, this);
            this.model.on("removeHighlighting", this.removeHighlighting, this);
            this.model.on("removeHighlightingAsCity", this.removeHighlightingAsCity, this);
        },
        doHighlight: function(){
           this.$el.addClass("available");
        },
        doHighlightAsCity: function(){
            this.$el.addClass("available-for-city");
        },
        removeHighlighting: function(){
            this.$el.removeClass("available");
        },
        removeHighlightingAsCity: function(){
            this.$el.removeClass("available-for-city");
        },
        buildSettlement: function(player) {
            var q, r, bank;
            q = this.model.get("coords").q.toFixed(2);
            r = this.model.get("coords").r.toFixed(2);
            bank = this.model.get("game").get("bank");
            this.setSettlement(q, r, player);
                if(this.model.get("type") === 1) {
                    player.spendResource({"brick": -1, "tree": -1, "wheat": -1, "sheep": -1});
                    bank.spendResource({"brick":-1, "tree":-1, "sheep":-1, "wheat":-1});
                }
                else {
                    player.spendResource({"rock": -3, "wheat": -2});
                    bank.spendResource({"rock": -3, "wheat": -2});
                }
        },
        setSettlement: function(q, r, currentPlayer) {
            if (this.model.get("type") === 0) {
                this.UnableNeighborCrossroads(q, r);
                this.model.set("type", 1);
                if (this.model.get("harborType") !== "") {
                    this.changeExchangeRate(currentPlayer);
                }
                this.model.set("player",currentPlayer);
                currentPlayer.get("settlements").push(this.model);
            }
            else if (this.model.get("type") === 1) {
                this.model.set("type", 2);
            }
        },
        changeExchangeRate: function(player) {
            var harborType = this.model.get("harborType");
            if (harborType === "general-harbor") {
                var k;
                for (k in player.get("exchangeRate")) {
                    player.get("exchangeRate")[k] = 3;
                }
            }
            else {
                player.get("exchangeRate")[harborType] = 2;
            }
        },

        UnableNeighborCrossroads: function(q, r) {
            var hex;
            for (var i = 0; i < this.model.get("hexes").length; i++) {
                hex = this.model.get("hexes")[i];
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
        checkBelongingOfSettlement: function(player,q,r){
            var settlement, cur_q, cur_r;
            for(var i=0; i< player.get("settlements").length; i++){
                settlement = player.get("settlements")[i];
                cur_q = settlement.get("coords").q.toFixed(2);
                cur_r = settlement.get("coords").r.toFixed(2);
                if(cur_q === q && cur_r === r){
                    return true;
                }
            }
            return false;
        },
        renderCrossroadWithSettlement: function() {
            if (this.model.get("type") === 3) {
                this.$el.css("display", "none");
            }
            else if (this.model.get("type") === 1) {

                var index = this.model.get("game").get("currentPlayer");
                var currentPlayer = this.model.get("game").get("players")[index];
                var color = currentPlayer.get("color");
                this.$el.removeClass("blinking").css("background", color);
            }
            else if(this.model.get("type") === 2){
                this.$el.removeClass("blinking").addClass("city");
            }
            else if (this.model.get("type") === 0) {
                this.$el.css({"display": "block"});
            }


        }
    });
    return CrossroadView;
});
