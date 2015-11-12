define([
    'jquery',
    'underscore',
    'backbone',
    'debug',
    "models/const"
], function($, _, Backbone, Debug, Const) {
    var RoadView = Backbone.View.extend({
        className: 'road',
        crossroadViews:[],
        events: {
            "buildHighway": "buildHighway",
            "setRoad": "setRoad"
        },
        initialize: function() {
            this.corner = 0;

            this.x = Const.HEX_EDGE_SIZE * 3 / 2 * (this.model.get('coords').q);
            this.y = Const.HEX_EDGE_SIZE * Math.sqrt(3) * (this.model.getRoadCoordsFrom().r + this.model.getRoadCoordsFrom().q / 2);

            // Adjust for field centering.
            this.x = this.x + (Const.FIELD_WIDTH/2);
            this.y = this.y + (Const.FIELD_HEIGHT/2);

            this.x = Math.round(this.x);
            this.y = Math.round(this.y);

            var to_coords_q = this.model.getRoadCoordsTo().q;
            var to_coords_r = this.model.getRoadCoordsTo().r;

            var x_to = Const.HEX_EDGE_SIZE * 3 / 2 * (to_coords_q);
            var y_to = Const.HEX_EDGE_SIZE * Math.sqrt(3) * (to_coords_r + to_coords_q / 2);

            // Make values similar to each other for comparing.
            x_to = x_to + (Const.FIELD_WIDTH/2);
            y_to = y_to + (Const.FIELD_HEIGHT/2);

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
            this.y = this.y - (Const.ROAD_HEIGHT / 2);


            this.addListeners();
        },
        render: function(){
            this.$el.css({'left': this.x, 'top': this.y, "transform": "rotate("+ this.corner + "deg)"});
            if(this.model.get('from').get('harborType') !== "" && this.model.get('to').get('harborType') !== ""){
                this.$el.addClass('harbor-road');
            }
            if(this.model.get('seaRoad')){
                this.$el.addClass('seaRoad');
            }
            return this;
        },
        addListeners: function(){
            this.model.on("change:highway", this.renderBuiltRoad, this);
            this.model.on("highlight", this.doHighlight, this);
            this.model.on("removeHighlighting", this.removeHighlight,this);
        },
        doHighlight: function(){
            this.$el.addClass("available");
        },
        removeHighlight: function(){
            this.$el.removeClass("available");
        },
        setRoad: function(){
            var currentPlayer = this.model.get("game").getCurrentPlayer();
            this.model.set("highway", true);
            this.model.set("player",currentPlayer);
            currentPlayer.get("roads").push(this.model);

        },
        buildHighway: function(){
            if(this.model.get("highway") === false){
                var currentPlayer = this.model.get("game").getCurrentPlayer();
                this.setRoad();
                currentPlayer.spendResource({"brick":-1,"tree":-1});
                this.model.get("game").get("bank").spendResource({"brick":-1,"tree":-1});
                //this.checkIfTheLongestRoad();
            }
        },
        checkIfTheLongestRoad: function(road) {
            var currentPlayer = this.model.get("game").getCurrentPlayer();
            var crossroads = road.get('crossroads');
            var visitedRoads = [], visitedCrossroads = [];
            var counter = 0;
            var r = function(crossroads, counter) {
                outerForCrossroads:
                for (var i = 0; i < crossroads.length; i++) {
                    for (var z = 0; z <= visitedCrossroads.length; z++) {
                        if (crossroads[i] === visitedCrossroads[z]) {
                            continue outerForCrossroads;
                        }
                    }
                    var roads = crossroads[i].get('roads');
                    visitedCrossroads.push(crossroads[i]);
                    outerForRoads:
                    for (var j = 0; j < roads.length; j++) {
                        for (var k = 0; k <= visitedRoads.length; k++) {
                            if (crossroads[i] === visitedRoads[k]) {
                                continue outerForRoads;
                            }
                        }
                        visitedRoads.push(roads[j]);
                        if (roads[j].get('highway') === true && roads[j].get('player') === currentPlayer) {
                            counter ++;
                            r(road[j].get('crossroads'));
                        }
                    }
                }
            };
        },
        //checkIfTheLongestRoad: function(){
        //    var currentRoadFrom = this.model.getRoadCoordsFrom();
        //    var currentRoadTo = this.model.getRoadCoordsTo();
        //    var counter = 0;
        //    var roads = this.model.get('player').get('roads');
        //    for (var i=0; i<roads.length; i++){
        //        var road = roads[i];
        //        var from = road.getRoadCoordsFrom();
        //        var to = road.getRoadCoordsFrom();
        //
        //        var compare = function(road){
        //            var curRoad = road;
        //            if(from === currentRoadTo || to === currentRoadFrom || from === currentRoadFrom || to === currentRoadTo){
        //                currentRoadTo = from;
        //                currentRoadFrom = to;
        //                counter ++;
        //
        //            }
        //        }
        //    }
        //},
        checkIfRoadIsBuilt: function(currentPlayer, from, to) {
            var compare = function(a, b) {
                return a.q.toFixed(2) === b.q.toFixed(2) && a.r.toFixed(2) === b.r.toFixed(2);
            };
            var road_from, road_to;
            for (var i = 0; i < currentPlayer.get("roads").length; i++) {

                road_from = currentPlayer.get("roads")[i].getRoadCoordsFrom();
                road_to = currentPlayer.get("roads")[i].getRoadCoordsTo();

                if (compare(from, road_from) || compare(to, road_to) ||
                    compare(from, road_to) || compare(to, road_from)) {
                    return true;
                }
            }
            return false;
        },
        renderBuiltRoad: function(){
            var color = this.model.get("game").getCurrentPlayer().get("color");
            this.$el.removeClass("available blinking").addClass("highway").addClass(color);
        }
    });
    return RoadView;
});