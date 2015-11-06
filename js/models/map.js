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
            "game": {},
            "hexes": [],
            "seaHexes":[],
            "crossroads": [],
            "roads": []
        },
        initialize: function(options) {
            if (options.crossroads) {
                this.set('crossroads', options.crossroads);
            }
            if (options.roads) {
                this.set('roads', options.roads);
            }
            if (options.game) {
                this.set("game", options.game);
            }
            this.createHexes();
            this.createSeaHexes();
            this.createCrossroads();
            this.createRoads();
        },
        createHexes: function() {
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
                //else if(i >= 18 && i <36){
                //    resources.push(Const.HEX_TYPE_SEA);
                //}
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
        createSeaHexes: function() {
            for (var i=0; i<= Const.HEX_SEA_COUNT; i++){
                this.get('hexes').push(new Hex({
                    type: "seaHex",
                    thief: false,
                    coords: Const.coordsForSeaHexes[i]
                }));
            }
        },
        getHex: function(q, r) {
            for (var i = 0; i < this.get("hexes").length; i++) {
                var hex = this.get("hexes")[i];
                if (hex.get("coords").q === q && hex.get("coords").r === r) {
                    return hex;
                }
            }
        },
        getHexByCoords: function(coords) {
            return this.getHex(coords.q,coords.r);
        },
        createCrossroads: function() {
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
                var hex = that.getHex(coords.q, coords.r);
                var crossroad_1 = hex.get("crossroads")[coords.indexOfCrossroad];
                var crossroad_2 = hex.get("crossroads")[coords.indexOfCrossroad < 5 ? (coords.indexOfCrossroad + 1) : 0];
                crossroad_1.set("harborType", harbor_type);
                crossroad_2.set("harborType", harbor_type);
            };
            for (var k = 0; k < Const.coordsOfHarbor.length; k++) {
                createPort(Const.coordsOfHarbor[k]);
            }
        },
        createRoads: function() {
            var isRoadPushed = function(crossroad,road){
                var roadIsNotThere = true;
                for(var z = 0; z < crossroad.get("roads").length;z++){
                    if(crossroad.get("roads")[z] === road){
                        roadIsNotThere = false;
                        break;
                    }
                }
                return roadIsNotThere;
            };

            for (var i = 0; i < this.get("hexes").length; i++) {
                var hex = this.get("hexes")[i];
                var CrossroadsQuantity = hex.get("crossroads").length;
                var road;
                for (var j = 0; j < CrossroadsQuantity; j++) {
                    var crossroad_from = hex.get('crossroads')[j];
                    var crossroad_from_coords = hex.get('crossroads')[j].get("coords");
                    var crossroad_to, crossroad_to_coords;
                    if (j === 0) {
                        crossroad_to = hex.get('crossroads')[CrossroadsQuantity - 1];
                    }
                    else {
                        crossroad_to = hex.get('crossroads')[j - 1];
                    }
                    crossroad_to_coords = crossroad_to.get("coords");
                    var crossroad_q = hex.get('crossroads')[j].get("coords").q;
                    var crossroad_r = hex.get('crossroads')[j].get("coords").r;
                    road = this.getRoad(crossroad_from_coords, crossroad_to_coords);
                    if (!road) {
                        road = new Road({
                            "game": this.get("game"),
                            "highway": false,
                            "from": crossroad_from,
                            "to": crossroad_to,
                            "coords": {q: crossroad_q, r: crossroad_r},
                            "seaRoad": hex.get('type') === "seaHex"
                        });
                        this.get("roads").push(road);
                    }
                    hex.get("roads").push(road);
                    if(isRoadPushed(crossroad_from,road)){
                        crossroad_from.get("roads").push(road);
                    }
                    if(isRoadPushed(crossroad_to, road)){
                        crossroad_to.get("roads").push(road);
                    }
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
                var from_c = this.get("roads")[i].getRoadCoordsFrom();
                var to_c = this.get("roads")[i].getRoadCoordsTo();
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
        },
        findAvailableCrossroads: function(player, needRoad) {
            var availableCrossroads = [];
            for (var i = 0; i < this.get("crossroads").length; i++) {
                var crossroad = this.get("crossroads")[i];
                if (crossroad.isAvailable(player, needRoad)) {
                    availableCrossroads.push(crossroad);
                }
            }
            return availableCrossroads;
        },
        highlightAvailableCrossroads: function(availableCrossroads){
            for(var i=0;i<availableCrossroads.length;i++){
               availableCrossroads[i].trigger("highlight");
            }
        },
        disabledCrossroadHighlighting: function() {
            for (var i = 0; i < this.get("crossroads").length; i++) {
                this.get("crossroads")[i].trigger("removeHighlighting");
            }
        },

        findAvailableRoadsByCrossroad: function(player, crossroadView) {
            var availableRoads = [];
            var visitedRoads = [];
            var crossroad = crossroadView.model;
            this.visitCrossroad(crossroad, player, availableRoads, visitedRoads);
            return availableRoads;
        },

        findAvailableRoads: function(player) {
            var availableRoads = [];
            var visitedRoads = [];
            for (var i = 0; i < player.get("settlements").length; i++) {
                var settlement = player.get("settlements")[i];
                this.visitCrossroad(settlement, player, availableRoads, visitedRoads);
            }
            return availableRoads;
        },
        visitCrossroad: function(crossroad, player, availableRoads, visitedRoads) {

            if ((crossroad.get("type") === 1 && crossroad.get("type") === 2) &&
                (crossroad.get("player") !== player)) {
                return;
            }
            outer:
            for (var i = 0; i < crossroad.get("roads").length; i++) {
                var road = crossroad.get("roads")[i];
                for (var j = 0; j < visitedRoads.length; j++) {
                    if (road === visitedRoads[j]) {
                        continue outer;
                    }
                }
                for (var k = 0; k < availableRoads.length; k++) {
                    if (road === availableRoads[k]) {
                        continue outer;
                    }
                }
                if (road.get("player") && road.get("player") !== player) {
                    continue outer;
                }
                else if (road.get("player") === player) {
                    visitedRoads.push(road);

                    var newCrossroad;
                    if (crossroad.get("coords").q === road.getRoadCoordsFrom().q && crossroad.get("coords").r === road.getRoadCoordsFrom().r) {
                        newCrossroad = road.get("to");
                    }
                    else {
                        newCrossroad = road.get("from");
                    }
                    this.visitCrossroad(newCrossroad, player, availableRoads, visitedRoads);
                }
                else {
                    availableRoads.push(road);
                }
            }
        },

        highlightRoads: function(availableRoads) {
            for (var i = 0; i < availableRoads.length; i++) {
                availableRoads[i].trigger("highlight");
            }
        },
        disableRoadHighlighting: function() {
            for (var i = 0; i < this.get("roads").length; i++) {
                this.get("roads")[i].trigger("removeHighlighting");
            }
        },
        findAvailableCrossroadsForCity: function(player){
            var availableCrossroadsForCity = [];
            for (var i=0;i<player.get("settlements").length;i++){
                if(player.get("settlements")[i].get("type") === 1){
                    availableCrossroadsForCity.push(player.get("settlements")[i]);
                }
            }
            return availableCrossroadsForCity;
        },
        highlightSettlementsForCityBuilding:function(settlements){
            for(var i=0;i<settlements.length;i++){
                settlements[i].trigger("highlightAsCity");
            }
        },
        disabledCrossroadForCityHighlighting : function(){
            for (var i = 0; i < this.get("crossroads").length; i++) {
                this.get("crossroads")[i].trigger("removeHighlightingAsCity");
            }
        },

    });
    return Map;
})
;