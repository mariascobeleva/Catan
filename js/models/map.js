define([
    'jquery',
    'underscore',
    'backbone',
    "models/const",
    "models/hex",
    "models/crossroad",
    "models/road"

], function($, _, Backbone, Const, Hex, Crossroad, Road) {
    var Map = Backbone.Model.extend({
        defaults: {
            "game":{},
            "hexes": [],
            "crossroads": [],
            "roads": []
        },
        initialize: function(options) {
            if (options.crossroads) {
                this.set('crossroads', options.crossroads);
            }
            if(options.roads){
                this.set('roads', options.roads);
            }
            if(options.game){
                this.set("game", options.game);
            }


            this.createHexes();
            this.createCrossroads();
            this.createRoads();
        },
        createHexes: function(){
            var resources = [];
            var numbersValue = this.fillNumbersValue();
            for (i = 0; i < Const.HEX_COUNT; i++) {
                if (i < 4) {
                    resources.push(Const.HEX_TYPE_WHEAT);
                }
                else if (i >= 4 && i < 8) {
                    resources.push(Const.HEX_TYPE_SHEEP);
                }
                else if (i >= 8 && i < 12) {
                    resources.push(Const.HEX_TYPE_WOOD);
                }
                else if (i >= 12 && i < 15) {
                    resources.push(Const.HEX_TYPE_ROCK);
                }
                else if (i >= 15 && i < 18) {
                    resources.push(Const.HEX_TYPE_BRICK);
                }
                else {
                    resources.push(Const.HEX_TYPE_DESERT);
                }
            }
            for (var i = 0; i < Const.HEX_COUNT; i++) {
                var hexType = this.randomChoice(resources);
                var value = this.randomChoice(numbersValue);

                this.get('hexes').push(new Hex({
                    type: hexType,
                    thief: hexType === Const.HEX_TYPE_DESERT,
                    value: hexType === Const.HEX_TYPE_DESERT ? "" : value,
                    coords: Const.staticCoords[i]
                }));
            }
        },
        getHex: function(q,r){
            for(var i=0;i<this.get("hexes").length;i++){
                var hex = this.get("hexes")[i];
                if(hex.get("coords").q === q && hex.get("coords").r === r){
                    return hex;
                }
            }
        },
        createCrossroads: function(){

            for (var i = 0; i < this.get("hexes").length; i++) {
                var hex = this.get("hexes")[i];
                for (var j = 0; j < Const.crossroadsCoords.length; j++) {
                    var crossroad_q = hex.get('coords').q + Const.crossroadsCoords[j].q;
                    var crossroad_r = hex.get('coords').r + Const.crossroadsCoords[j].r;

                    var crossroad = this.getCrossroad(crossroad_q, crossroad_r);

                    if (!crossroad) {
                        crossroad = new Crossroad({
                            "game": this.get("game"),
                            hexes: [hex],
                            coords: {q: crossroad_q, r: crossroad_r}
                        });
                        this.get("crossroads").push(crossroad);
                    }
                    else {
                        crossroad.get("hexes").push(hex);
                    }
                    hex.get("crossroads").push(crossroad);
                }
            }

            var that = this;
            var createPort = function(coords) {

                var harbor_type = that.randomChoice(Const.HARBOR_TYPES);
                var hex = that.getHex(coords.q,coords.r);
                var crossroad_1 = hex.get("crossroads")[coords.indexOfCrossroad];
                var crossroad_2 = hex.get("crossroads")[coords.indexOfCrossroad < 5 ? (coords.indexOfCrossroad + 1) : 0];
                crossroad_1.set("harborType", harbor_type);
                crossroad_2.set("harborType", harbor_type);
            };
            for(var l=0; l< Const.coordsOfHarbor.length; l++){
                createPort(Const.coordsOfHarbor[l]);
            }
        },
        createRoads: function(){
            for (var i = 0; i < this.get("hexes").length; i++) {
                var hex = this.get("hexes")[i];
                var CrossroadsQuantity = hex.get("crossroads").length;
                var road;
                for (var j = 0; j < CrossroadsQuantity; j++) {
                    var crossroad_from = hex.get('crossroads')[j];
                    var crossroad_from_coords = hex.get('crossroads')[j].get("coords");
                    var crossroad_to,crossroad_to_coords;
                    if (j === 0) {
                        crossroad_to = hex.get('crossroads')[CrossroadsQuantity - 1];
                        crossroad_to_coords = crossroad_to.get("coords");
                    }
                    else {
                        crossroad_to = hex.get('crossroads')[j - 1];
                        crossroad_to_coords = crossroad_to.get("coords");
                    }
                    var crossroad_q = hex.get('crossroads')[j].get("coords").q;
                    var crossroad_r = hex.get('crossroads')[j].get("coords").r;
                    road = this.getRoad(crossroad_from_coords, crossroad_to_coords);
                    if (!road) {
                        road = new Road({
                            "game":this.get("game"),
                            "road":false,
                            "from": crossroad_from_coords,
                            "to": crossroad_to_coords,
                            "coords": {q: crossroad_q, r: crossroad_r}
                        });
                        this.get("roads").push(road);
                    }
                    hex.get("roads").push(road);
                    crossroad_to.get("roads").push(road);
                    crossroad_from.get("roads").push(road);
                }
            }
        },
        getCrossroad: function(q, r) {
            for (var t = 0; t < this.get("crossroads").length; t++) {
                var crossroad_coord_q = this.get("crossroads")[t].get("coords").q;
                var crossroad_coord_r = this.get("crossroads")[t].get("coords").r;

                if (q.toFixed(2) === crossroad_coord_q.toFixed(2) && r.toFixed(2) === crossroad_coord_r.toFixed(2)) {
                    return this.get("crossroads")[t];
                }
            }
        },
        getRoad: function(from, to) {
            var compare = function(a, b) {
                return a.q === b.q && a.r === b.r;
            };

            for (var i = 0; i < this.get("roads").length; i++) {
                var from_c = this.get("roads")[i].get("from");
                var to_c = this.get("roads")[i].get("to");

                if ((compare(from, from_c) && compare(to, to_c)) || (compare(from, to_c) && compare(to, from_c))) {
                    return this.get("roads")[i];
                }
            }
        },
        randomChoice: function(array) {
            var result = array [Math.floor(Math.random() * array.length)];
            array.splice(array.indexOf(result), 1);
            return result;
        },
        fillNumbersValue: function() {
            var array = [];
            var value = 2;
            for (var i = 0; i < Const.HEX_COUNT; i++) {
                if (i === 0) {
                    array.push(value);
                }
                else {
                    if (i % 2 === 0) {
                        value = value + 1;
                        if (value === 7) {
                            value = value + 1;
                        }
                    }
                    array.push(value);
                }
            }
            return array;
        }
    });
    return Map;
})
;