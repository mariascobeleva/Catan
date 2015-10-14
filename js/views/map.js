define([
    'jquery',
    'underscore',
    'backbone',
    "views/hex",
    "views/crossroad",
    "views/road",
    'text!templates/map.html'

], function($, _, Backbone, HexView, CrossroadView,RoadView, MapTemplate) {
    var MapView = Backbone.View.extend({
        className: "map",
        seaHexView:[],
        hexViews:[],
        crossroadsViews:[],
        roadsViews:[],
        getCrossroadView: function(q, r) {
                for(var i=0; i<this.crossroadsViews.length; i++){
                    var crossroad_q = this.crossroadsViews[i].model.get("coords").q;
                    var crossroad_r = this.crossroadsViews[i].model.get("coords").r;

                    if(q === crossroad_q && r === crossroad_r ){
                        return this.crossroadsViews[i];
                    }
                }
        },
        getRoadView: function(from,to){
            var compare = function(a, b) {
                return a.q === b.q && a.r === b.r;
            };

            for (var i = 0; i < this.roadsViews.length; i++) {
                var from_c = this.roadsViews[i].model.get("from");
                var to_c = this.roadsViews[i].model.get("to");

                if ((compare(from, from_c) && compare(to, to_c)) || (compare(from, to_c) && compare(to, from_c))) {
                    return this.roadsViews[i];
                }
            }
        },
        renderHexes: function() {
            for (var i = 0; i < this.model.get('hexes').length; i++) {
                var hexView = new HexView({model: this.model.get('hexes')[i]});
                this.hexViews.push(hexView);
                this.$(".field .hexes").append(hexView.render().el);
            }
        },
        renderThief: function(){
            var left = parseFloat(this.$(".hex.desert").css("left"));
            var top = parseFloat(this.$(".hex.desert").css("top"));
            var hexSize = 60;
            var thiefSize = 30;
            this.$(".thief").css({'left':(left + hexSize/2 + thiefSize/2),'top':(top + hexSize/2)});
        },
        renderCrossroads: function() {
            for (var i = 0; i < this.model.get('hexes').length; i++) {
                for (var j = 0; j < this.model.get("hexes")[i].get("crossroads").length; j++) {
                    var crossroad_q = this.model.get("hexes")[i].get("crossroads")[j].get("coords").q;
                    var crossroad_r = this.model.get("hexes")[i].get("crossroads")[j].get("coords").r;

                    var crossroadView = this.getCrossroadView(crossroad_q, crossroad_r);

                    if (!crossroadView) {
                        crossroadView = new CrossroadView({model: this.model.get("hexes")[i].get("crossroads")[j]});

                        //if (this.model.get('hexes')[i] === 2 && crossroad_q === 0.333 && crossroad_r === -0.66) {
                        //    this.model.get("hexes")[i].get("crossroads")[j].set("harborType", "1");
                        //}

                        this.crossroadsViews.push(crossroadView);

                        var harbor_type = this.model.get("hexes")[i].get("crossroads")[j].get("harborType");
                        if(harbor_type !== ""){
                            $(crossroadView.render().el).addClass("harbor "  + harbor_type);
                        }
                        this.$(".field .crossroads").append(crossroadView.render().el);
                    }
//                    hexView.crossroadViews.push(crossroadView);
//                    crossroadView.hexViews.push(hexView);
                }
            }
        },
        renderRoads: function() {
            var hexes = this.model.get('hexes');
            for (var i = 0; i < hexes.length; i++) {
                for (var k = 0; k < hexes[i].get("roads").length; k++) {
                    var road_from = hexes[i].get("roads")[k].get("from").get("coords");
                    var road_to = hexes[i].get("roads")[k].get("to").get("coords");

                    var roadView = this.getRoadView(road_from, road_to);
                    if (!roadView) {
                        roadView = new RoadView({model: hexes[i].get("roads")[k]});
                        this.roadsViews.push(roadView);
                        this.$(".field .roads").append(roadView.render().el);
                    }
                }
            }
        },
        render: function() {
            var htmlTemplate = _.template(MapTemplate);
            var $map = $(htmlTemplate({}));
            this.$el.append($map);

            this.renderHexes();
            this.renderCrossroads();
            this.renderRoads();
            this.renderThief();
            return this;
        }
    });
    return MapView;
});
