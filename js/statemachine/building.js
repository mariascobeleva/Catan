define([
    'jquery',
    "models/const"
], function($, Const) {
        return function(GameView) {
            var building = {
                states: {
                    building: {enter: ["buildingEnter"], leave: ["buildingLeave"]},
                    highwayBuilding: {enter: ["highwayBuildingEnter"], leave: ["highwayBuildingLeave"]},
                    settlementBuilding: {enter: ["settlementBuildingEnter"], leave: ["settlementBuildingLeave"]},
                    cityBuilding: {enter: ["cityBuildingEnter"], leave: ["cityBuildingLeave"]}
                },
                transitions: {
                    building: {
                        buildingObj: {
                            enterState: "mainGame"
                        },
                        buildHighway: {
                            enterState: "highwayBuilding"
                        },
                        buildSettlement: {
                            enterState: "settlementBuilding"
                        },
                        buildCity: {
                            enterState: "cityBuilding"
                        }
                    },
                    highwayBuilding: {
                        builtHighway: {
                            enterState: "mainGame"
                        }
                    },
                    settlementBuilding: {
                        builtSettlement: {
                            enterState: "mainGame"
                        },
                        builtAndWin : {
                            enterState: "endOfGame"
                        }
                    },
                    cityBuilding: {
                        builtCity: {
                            enterState: "mainGame"
                        },
                        builtAndWin : {
                            enterState: "endOfGame"
                        }
                    }
                },
                buildingEnter: function() {
                    var that = this;
                    var currentPlayer = this.model.getCurrentPlayer();
                    that.$("#overlay,.box").addClass("active");


                    if (this.model.checkPlayerResourcesForSettlement(currentPlayer) && this.model.get("map").findAvailableCrossroads(currentPlayer, true).length !== 0) {
                        that.$(".building-objects span.settlement").addClass("active");

                    }
                    if (this.model.checkPlayerResourcesForCity(currentPlayer)) {
                        that.$(".building-objects span.city").addClass("active");
                    }
                    if (this.model.checkPlayerResourcesForHighway(currentPlayer) && this.model.get("map").findAvailableRoads(currentPlayer).length !== 0) {
                        that.$(".building-objects span.highway").addClass("active");
                    }
                    that.$(".building-objects").show();

                    that.$(".building-objects span.settlement.active").on('click.building', null, function() {
                        var availableCrossroads = that.model.get("map").findAvailableCrossroads(currentPlayer, true);
                        that.trigger("buildSettlement", availableCrossroads);
                    });

                    that.$(".building-objects span.city.active").on('click.building', null, function() {
                        that.trigger("buildCity");
                    });
                    that.$(".building-objects span.highway.active").on('click.building', null, function() {
                        var availableRoads = that.model.get("map").findAvailableRoads(currentPlayer);
                        that.trigger("buildHighway", availableRoads);

                    });
                    that.$("#close").on('click.building', null, function() {
                        that.trigger('buildingObj');
                    });

                },
                buildingLeave: function() {
                    this.$(".building-objects span.settlement").off("click.building");
                    this.$(".building-objects span.highway").off("click.building");
                    this.$(".building-objects span.city").off("click.building");
                    this.$("#close").off("click.building");
                    this.$(".building-objects").hide();
                    this.$("#overlay, .box").removeClass("active");
                    this.$(".building-objects span").removeClass("active");
                },
                highwayBuildingEnter: function(roads) {
                    var that = this;
                    var currentPlayer = this.model.getCurrentPlayer();
                    var color = currentPlayer.get("color");

                    this.model.get("map").highlightRoads(roads);
                    that.$(".build").show().addClass("disabled");
                    that.$(".refuse-building").show();
                    that.$('.road.available').on('click.highwayBuilding', null, function() {
                        that.$(".build").removeClass("disabled");
                        that.$('.blinking.' + color + '.road').removeClass("blinking").removeClass(color);
                        $(this).addClass('blinking').addClass(color);
                    });
                    that.$(".build").on('click.highwayBuilding', null, function() {
                        if (!$(this).is(".disabled")) {
                            $(".road." + color + ".blinking").trigger("buildHighway");
                            that.trigger("builtHighway");
                        }
                    });
                    that.$(".refuse-building").on('click.highwayBuilding', null, function() {
                        that.trigger("builtHighway");
                    });
                },
                highwayBuildingLeave: function() {
                    var that = this;
                    that.$('.road').off("click.highwayBuilding");
                    that.$(".build").off("click.highwayBuilding");
                    that.$(".refuse-building").off("click.highwayBuilding");
                    that.$(".refuse-building").hide();
                    that.model.get("map").disableRoadHighlighting();
                    that.$(".build").addClass("disabled").hide();
                    if(that.$(".blinking").length){
                        that.$(".blinking").each(function(){
                            $(this).removeClass("blinking").css("background","#FAEBD7");
                        });
                    }
                },
                settlementBuildingEnter: function(crossroads) {
                    var that = this;
                    var currentPlayer = that.model.getCurrentPlayer();
                    var color = currentPlayer.get("color");
                    that.model.get("map").highlightAvailableCrossroads(crossroads);
                    that.$(".build").show().addClass("disabled");
                    that.$(".refuse-building").show();
                    that.$('.crossroad.available').on('click.settlementBuilding', null, function() {
                        that.$(".build").removeClass("disabled");
                        that.$(".crossroad.blinking").removeClass("blinking").removeClass(color);
                        $(this).addClass('blinking').addClass(color);
                    });
                    that.$(".build").on('click.settlementBuilding', null, function() {
                        if (!$(this).is(".disabled")) {
                            var view = that.$(".crossroad.blinking").data('view');
                            view.model.buildSettlement(currentPlayer);
                            if(currentPlayer.getVictoryPoints() !== Const.VICTORY_POINTS_FOR_WIN){
                                that.trigger("builtSettlement");
                            }
                            else {
                                that.trigger("builtAndWin");
                            }

                        }
                    });
                    that.$(".refuse-building").on('click.settlementBuilding', null, function() {
                        that.trigger("builtSettlement");
                    });
                },
                settlementBuildingLeave: function() {
                    var that = this;
                    that.$('.crossroad').off("click.settlementBuilding");
                    that.$(".build").off("click.settlementBuilding");
                    that.$(".refuse-building").off("click.settlementBuilding");
                    that.$(".refuse-building").hide();
                    that.model.get("map").disabledCrossroadHighlighting();
                    that.$(".build").addClass("disabled").hide();

                    if(that.$(".blinking").length){
                        that.$(".blinking").each(function(){
                            $(this).removeClass("blinking").css("background","#FAEBD7");
                        });
                    }

                },
                cityBuildingEnter: function() {
                    var that = this;
                    var currentPlayer = that.model.getCurrentPlayer();
                    var color = currentPlayer.get("color");
                    var availableCities = that.model.get("map").findAvailableCrossroadsForCity(currentPlayer);
                    that.model.get("map").highlightSettlementsForCityBuilding(availableCities);
                    that.$(".build").show().addClass("disabled");
                    that.$(".refuse-building").show();
                    that.$(".crossroad.available-for-city").on('click.cityBuilding', null, function() {
                        that.$(".build").removeClass("disabled");
                        that.$(".crossroad.available-for-city").removeClass("blinking city");
                        $(this).addClass('blinking city');
                    });
                    that.$(".build").on('click.cityBuilding', null, function() {
                        if (!$(this).is(".disabled")) {
                            var view = that.$(".crossroad.blinking").data('view');
                            view.model.buildSettlement(currentPlayer);
                            if(currentPlayer.getVictoryPoints() !== Const.VICTORY_POINTS_FOR_WIN){
                                that.trigger("builtCity");
                            }
                            else {
                                that.trigger("builtAndWin");
                            }
                        }
                    });
                    that.$(".refuse-building").on('click.cityBuilding', null, function() {
                        that.trigger("builtSettlement");
                    });
                },
                cityBuildingLeave: function() {
                    var that = this;
                    var currentPlayer = that.model.getCurrentPlayer();
                    var color = currentPlayer.get("color");

                    that.$(".build").off("click.cityBuilding");
                    that.$(".build").addClass("disabled").hide();

                    that.$(".crossroad.available-for-city").off("click.cityBuilding");
                    that.$(".refuse-building").off("click.cityBuilding");
                    that.$(".refuse-building").hide();

                    that.$(".crossroad.available-for-city").removeClass("available-for-city");
                    that.model.get("map").disabledCrossroadForCityHighlighting();
                    if(that.$(".blinking").length){
                        that.$(".blinking").each(function(){
                            $(this).removeClass("blinking");
                        });
                    }
                }
            };
            $.extend(true, GameView.prototype, building);
        };
    }

);
