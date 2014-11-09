define([
    'jquery',
    'underscore',
    'backbone',
    'debug'
], function($, _, Backbone, Debug) {
    var RoadView = Backbone.View.extend({
        className: 'road',
        crossroadViews:[],
        events: {
            click: "roadClick",
            "buildRoad": "buildRoad"
        },
        initialize: function() {
            var SIZE = 60;
            var COLS = 5;
            var HEX_HEIGHT = Math.sqrt(Math.pow(SIZE, 2) - Math.pow(SIZE / 2, 2)) * 2;
            var FIELD_WIDTH = COLS * SIZE + (COLS + 1) * SIZE / 2; // 120
            var FIELD_HEIGHT = HEX_HEIGHT * COLS; // 104
            var ROAD_HEIGHT = 10;
            this.corner = 0;

            this.x = SIZE * 3 / 2 * (this.model.get('coords').q);
            this.y = SIZE * Math.sqrt(3) * (this.model.get('coords').r + this.model.get('coords').q / 2);

            // Adjust for field centering.
            this.x = this.x + (FIELD_WIDTH);
            this.y = this.y + (FIELD_HEIGHT);

            this.x = Math.round(this.x);
            this.y = Math.round(this.y);

            var to_coords_q = this.model.get("to").q;
            var to_coords_r = this.model.get("to").r;

            var x_to = SIZE * 3 / 2 * (to_coords_q);
            var y_to = SIZE * Math.sqrt(3) * (to_coords_r + to_coords_q / 2);

            // Make values similar to each other for comparing.
            x_to = x_to + (FIELD_WIDTH);
            y_to = y_to + (FIELD_HEIGHT);

            x_to = Math.round(x_to);
            y_to = Math.round(y_to);



            if(this.y < y_to && this.x > x_to ) {
                this.corner = 120;
            }
            else if (this.y < y_to && this.x < x_to){
                this.corner = 60;
            }
            else if (this.y === y_to && this.x > x_to){
                this.corner = 180;
            }
            else if (this.y === y_to && this.x < x_to){
                this.corner = 0;
            }
            else if (this.y > y_to && this.x < x_to){
                this.corner = -60;
            }
            else if (this.y > y_to && this.x > x_to){
                this.corner = -120;
            }
            this.y = this.y - (ROAD_HEIGHT / 2);


            this.addListeners();
        },
        render: function(){
            this.$el.css({'left': this.x, 'top': this.y, "transform": "rotate("+ this.corner + "deg)"});
            return this;
        },
        addListeners: function(){
            this.model.on("change:road", this.renderBuiltRoad, this);
        },
        buildRoad: function(){
            if(this.model.get("road") === false){
                var indexOfCurrentPlayer = this.model.get("game").get("currentPlayer");
                var currentPlayer = this.model.get("game").get("players")[indexOfCurrentPlayer];
                this.model.set("road", true);
                currentPlayer.get("roads").push(this.model);
                if(currentPlayer.get("startTurn")){
                    this.countTurn(currentPlayer, "startTurn");
                }
                else if(currentPlayer.get("secondTurn")){
                    this.countTurn(currentPlayer,"secondTurn");
                }
                else {
                    currentPlayer.spendResource({"brick":-1,"tree":-1});
                    this.model.get("game").get("bank").spendResource({"brick":-1,"tree":-1});
                }
            }
        },
        countTurn: function(currentPlayer,turn){
            if(this.model.get("game").get("counter") !== this.model.get("game").get("players").length){
                if(this.model.get("game").get("counter")=== 0){
                   this.model.get("game").set("counter",1);
                }
                else {
                    this.model.get("game").set("counter",( this.model.get("game").get("counter")+1));
                }
                currentPlayer.set(turn,false);
            }

        },
        checkIfSettlementIsBuild: function(currentPlayer, from, to, k) {
            var q,r;
            var compare = function(coords_1,coords_2,q,r){
                if ((coords_1.q.toFixed(2) === q && coords_1.r.toFixed(2) === r) ||
                    coords_2.q.toFixed(2) === q && coords_2.r.toFixed(2) === r) {
                    return true;
                }
            };

            if(k) {
                q = currentPlayer.get("settlements")[k].get("coords").q.toFixed(2);
                r = currentPlayer.get("settlements")[k].get("coords").r.toFixed(2);
                return compare(from,to,q,r);
            }
            else {
                for (var i = 0; i < currentPlayer.get("settlements").length; i++) {
                    q = currentPlayer.get("settlements")[i].get("coords").q.toFixed(2);
                    r = currentPlayer.get("settlements")[i].get("coords").r.toFixed(2);
                    if(compare(from,to,q,r)){
                        return true;
                    }
                }
            }
            return false;
        },
        checkIfRoadIsBuilt: function(currentPlayer, from, to) {
            var compare = function(a, b) {
                return a.q.toFixed(2) === b.q.toFixed(2) && a.r.toFixed(2) === b.r.toFixed(2);
            };
            var road_from, road_to;
            for (var i = 0; i < currentPlayer.get("roads").length; i++) {

                road_from = currentPlayer.get("roads")[i].get("from");
                road_to = currentPlayer.get("roads")[i].get("to");

                if (compare(from, road_from) || compare(to, road_to) ||
                    compare(from, road_to) || compare(to, road_from)) {
                    return true;
                }
            }
            return false;
        },
        roadClick: function() {
            Debug.log('$(".roads .road:nth-child(' + (this.$el.index() + 1) + ')").click();');

            var index, currentPlayer, color, from, to;
            index = this.model.get("game").get("currentPlayer");
            currentPlayer = this.model.get("game").get("players")[index];
            from = this.model.get("from");
            to = this.model.get("to");
            color = currentPlayer.get("color");


            if (this.model.get("game").get("crossroadClicked") === false) {
                if ((currentPlayer.get("startTurn") === true && currentPlayer.get("roads").length === 0) ||
                    (currentPlayer.get("startTurn") === false && currentPlayer.get("secondTurn") === false && this.checkPlayerResources(currentPlayer))) {
                    if (this.checkIfSettlementIsBuild(currentPlayer, from, to) || this.checkIfRoadIsBuilt(currentPlayer, from, to)) {
                        this.doRoadBlinking(color);
                        this.model.get("game").set("roadClicked", true);
                    }
                }
                else if (currentPlayer.get("secondTurn") === true && currentPlayer.get("roads").length === 1 && currentPlayer.get("settlements").length === 2) {
                    if(this.checkIfSettlementIsBuild(currentPlayer, from, to, 1)){
                        this.doRoadBlinking(color);
                        this.model.get("game").set("roadClicked", true);
                    }
                }
            }
            else {
                alert("You don't have resources!");
            }
        },
        doRoadBlinking: function (color){
            $(".road.blinking").css({"background": "#FAEBD7"}).removeClass("blinking");
            this.$el.css("background", color);
            this.$el.addClass("blinking");

        },
        renderBuiltRoad: function(){

            this.$el.removeClass("blinking");

            var index = this.model.get("game").get("currentPlayer");
            var currentPlayer = this.model.get("game").get("players")[index];
            var color = currentPlayer.get("color");

            this.$el.css("background", color);

        },
        checkPlayerResources: function(currentPlayer){
            if(currentPlayer.getResources("tree") >=1 && currentPlayer.getResources("brick") >= 1){
                return true;
            }
            return false;
        }
    });
    return RoadView;
});