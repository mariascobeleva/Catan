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
        events :{
            'click' : 'crossroadClick',
            'buildSettlement': 'buildSettlement'
        },

        initialize: function() {
            var SIZE = 60;
            var COLS = 5;
            var HEX_HEIGHT = Math.sqrt(Math.pow(SIZE, 2) - Math.pow(SIZE / 2, 2)) * 2;
            var FIELD_WIDTH = COLS * SIZE + (COLS + 1) * SIZE / 2; // 120
            var FIELD_HEIGHT = HEX_HEIGHT * COLS; // 104
            var CROSSROAD_HEIGHT = 20;

            this.x = SIZE * 3 / 2 * (this.model.get('coords').q);
            this.y = SIZE * Math.sqrt(3) * (this.model.get('coords').r + this.model.get('coords').q / 2);

            // Adjust for field centering.
            this.x = this.x + (FIELD_WIDTH);
            this.y = this.y + (FIELD_HEIGHT);

            this.x = this.x - (CROSSROAD_HEIGHT / 2);
            this.y = this.y - (CROSSROAD_HEIGHT / 2);

            this.x = Math.round(this.x);
            this.y = Math.round(this.y);

            this.addListeners();

        },
        render: function() {
            this.$el.css({'left': this.x, 'top': this.y});
            return this;
        },
        addListeners: function(){
            this.model.on("change:type", this.renderCrossroadWithSettlement, this);
        },
        buildSettlement: function() {
            var q, r, indexOfCurrentPlayer, currentPlayer;
            q = this.model.get("coords").q.toFixed(2);
            r = this.model.get("coords").r.toFixed(2);
            indexOfCurrentPlayer = this.model.get("game").get("currentPlayer");
            currentPlayer = this.model.get("game").get("players")[indexOfCurrentPlayer];
            this.setSettlement(q,r,currentPlayer);
            if(currentPlayer.get("startTurn") === false && currentPlayer.get("secondTurn") === false){
                currentPlayer.increaseResources("brick",-1);
                currentPlayer.increaseResources("tree",-1);
                currentPlayer.increaseResources("sheep",-1);
                currentPlayer.increaseResources("wheat",-1);
                this.model.get("game").get("bank").useResource("brick",1);
                this.model.get("game").get("bank").useResource("tree",1);
                this.model.get("game").get("bank").useResource("sheep",1);
                this.model.get("game").get("bank").useResource("wheat",1);
            }
        },
        setSettlement: function(q,r,currentPlayer) {
            if (this.model.get("type") === 0) {
                this.UnableNeighborCrossroads(q, r);
                this.model.set("type", 1);
            }
            else if(this.model.get("type") === 1){
                this.model.set("type", 2);
            }
            currentPlayer.get("settlements").push(this.model);
        },
        checkIfRoadIsBuilt: function(q, r, currentPlayer) {
            for (var i = 0; i < currentPlayer.get("roads").length; i++) {
                if ((currentPlayer.get("roads")[i].get("from").q.toFixed(2) === q && currentPlayer.get("roads")[i].get("from").r.toFixed(2) === r ) ||
                    (currentPlayer.get("roads")[i].get("to").q.toFixed(2) === q && currentPlayer.get("roads")[i].get("to").r.toFixed(2) === r)) {
                    return true;
                }
            }
            return false;
        },
        UnableNeighborCrossroads: function(q,r){
            var hex;
            for(var i=0; i<this.model.get("hexes").length; i++){
                hex = this.model.get("hexes")[i];
                for(var j=0;j<hex.get("crossroads").length; j++){
                    if(hex.get("crossroads")[j].get("coords").q.toFixed(2) === q &&
                        hex.get("crossroads")[j].get("coords").r.toFixed(2) === r ){
                        if(hex.get("crossroads")[j-1]){
                            if(hex.get("crossroads")[j-1].get("type") !== 3 || hex.get("crossroads")[j-1].get("type") !== 1){
                                hex.get("crossroads")[j-1].set("type",3);
                            }
                            else {
                                hex.get("crossroads")[j-1].set("type",0);
                            }
                        }
                        else {
                            if(hex.get("crossroads")[5].get("type") !== 3 || hex.get("crossroads")[5].get("type") !== 1){
                                hex.get("crossroads")[5].set("type",3);
                            }
                            else {
                                hex.get("crossroads")[5].set("type",0);
                            }
                        }
                        if(hex.get("crossroads")[j+1]){
                            if(hex.get("crossroads")[j+1].get("type") !== 3 || hex.get("crossroads")[j+1].get("type") !== 1){
                                hex.get("crossroads")[j+1].set("type",3);
                            }
                            else {
                                hex.get("crossroads")[j+1].set("type",0);
                            }
                        }
                        else {
                            if(hex.get("crossroads")[0].get("type") !== 3 || hex.get("crossroads")[0].get("type") !== 1){
                               hex.get("crossroads")[0].set("type",3);
                            }
                            else {
                                hex.get("crossroads")[0].set("type",0);
                            }
                        }
                    }
                }
            }
        },

        crossroadClick: function() {
            Debug.log('$(".crossroads .crossroad:nth-child(' + (this.$el.index() + 1) + ')").click();');

            var index, currentPlayer, color, q, r;
            index = this.model.get("game").get("currentPlayer");
            currentPlayer = this.model.get("game").get("players")[index];
            color = currentPlayer.get("color");
            q = this.model.get("coords").q.toFixed(2);
            r = this.model.get("coords").r.toFixed(2);


            if (this.model.get("game").get("roadClicked") === false) {

                if((currentPlayer.get("startTurn") === true && currentPlayer.get("settlements").length === 0) ||
                   (currentPlayer.get("startTurn") === false && currentPlayer.get("secondTurn") === true && currentPlayer.get("settlements").length === 1) ||
                   (currentPlayer.get("startTurn") === false && currentPlayer.get("secondTurn") === false && this.checkPlayerResourcesForSettlement(currentPlayer) && this.checkIfRoadIsBuilt(q,r,currentPlayer))){

                    this.doCrossroadBlinking(color);
                    this.model.get("game").set("crossroadClicked", true);

                }
            }
        },
        checkPlayerResourcesForSettlement: function(currentPlayer) {
            if (currentPlayer.getResources("tree") >= 1 &&
                currentPlayer.getResources("brick") >= 1 &&
                currentPlayer.getResources("sheep") >= 1 &&
                currentPlayer.getResources("wheat") >= 1) {
                return true;
            }
            return false;
        },
        doCrossroadBlinking: function(color){
            $(".road.blinking").css({"background": "#FAEBD7"}).removeClass("blinking");
            this.$el.css("background", color);
            this.$el.addClass("blinking");
        },
        renderCrossroadWithSettlement: function(){
                if(this.model.get("type") === 3){
                    this.$el.css("display","none");
                }
                else if(this.model.get("type") === 1){

                    var index = this.model.get("game").get("currentPlayer");
                    var currentPlayer = this.model.get("game").get("players")[index];
                    var color = currentPlayer.get("color");


                    this.$el.removeClass("blinking").css("background", color);
                }
                else if(this.model.get("type") === 0){
                    this.$el.css({"display":"block"});
                }


        }
    });
    return CrossroadView;
});
