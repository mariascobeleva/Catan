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
                    that.$('.box .title-main').text("Строительство");
                    that.$("#overlay,.box").addClass("active");
                    that.$('.box-container').addClass('building');
                    that.showPopupControlBtns(false,'Отменить');

                    if (this.model.checkPlayerResourcesForSettlement(currentPlayer) && this.model.get("map").findAvailableCrossroads(currentPlayer, true).length !== 0) {
                        that.$(".building-objects .object.settlement").addClass("active");
                    }
                    if (this.model.checkPlayerResourcesForCity(currentPlayer)) {
                        that.$(".building-objects .object.city").addClass("active");
                    }
                    if (this.model.checkPlayerResourcesForHighway(currentPlayer) && this.model.get("map").findAvailableRoads(currentPlayer).length !== 0) {
                        that.$(".building-objects .object.highway").addClass("active");
                    }


                    that.$(".building-objects .object.settlement.active").on('click.building', null, function() {
                        var availableCrossroads = that.model.get("map").findAvailableCrossroads(currentPlayer, true);
                        that.trigger("buildSettlement", availableCrossroads);
                    });

                    that.$(".building-objects .object.city.active").on('click.building', null, function() {
                        that.trigger("buildCity");
                    });
                    that.$(".building-objects .object.highway.active").on('click.building', null, function() {
                        var availableRoads = that.model.get("map").findAvailableRoads(currentPlayer);
                        that.trigger("buildHighway", availableRoads);
                    });
                    that.$(".cancel").on('click.building', null, function() {
                        that.trigger('buildingObj');
                    });

                },
                buildingLeave: function() {
                    this.$(".building-objects .object.city.active").off("click.building");
                    this.$(".building-objects .object.highway.active").off("click.building");
                    this.$(".building-objects .object.settlement.active").off("click.building");
                    this.$(".building-objects .object.active").removeClass('active');
                    this.$("#overlay, .box").removeClass("active");
                    this.$('.box-container').removeClass('building');
                    this.$('.box .title-main').text("");
                    this.$(".building-objects span").removeClass("active");
                    this.$(".building-objects span").removeClass("active");

                    this.hidePopupControlBtns();
                },
                highwayBuildingEnter: function(roads) {
                    var that = this;
                    var currentPlayer = this.model.getCurrentPlayer();
                    var color = currentPlayer.get("color");

                    this.model.get("map").highlightRoads(roads);
                    that.$(".confirm").show().addClass("disabled");
                    that.$(".refuse").show();
                    that.$('.road.available').on('click.highwayBuilding', null, function() {
                        that.$(".confirm").removeClass("disabled");
                        that.$('.blinking.' + color + '.road').removeClass("blinking").removeClass(color);
                        $(this).addClass('blinking').addClass(color);
                    });
                    that.$(".confirm").on('click.highwayBuilding', null, function() {
                        if (!$(this).is(".disabled")) {
                            $(".road." + color + ".blinking").trigger("buildHighway");
                            that.trigger("builtHighway");
                        }
                    });
                    that.$(".refuse").on('click.highwayBuilding', null, function() {
                        that.trigger("builtHighway");
                    });
                },
                highwayBuildingLeave: function() {
                    var that = this;
                    var color = this.model.getCurrentPlayer().get("color");
                    that.$('.road').off("click.highwayBuilding");
                    that.$(".confirm").off("click.highwayBuilding");
                    that.$(".refuse").off("click.highwayBuilding");
                    that.$(".refuse").hide();
                    that.model.get("map").disableRoadHighlighting();
                    that.$(".confirm").addClass("disabled").hide();
                    if(that.$(".blinking").length){
                        that.$(".blinking").each(function(){
                            $(this).removeClass("blinking").removeClass(color);
                        });
                    }
                },
                settlementBuildingEnter: function(crossroads) {
                    var that = this;
                    var currentPlayer = that.model.getCurrentPlayer();
                    var color = currentPlayer.get("color");
                    that.model.get("map").highlightAvailableCrossroads(crossroads);
                    that.$(".confirm").show().addClass("disabled");
                    that.$(".refuse").show();
                    that.$('.crossroad.available').on('click.settlementBuilding', null, function() {
                        that.$(".confirm").removeClass("disabled");
                        that.$(".crossroad.blinking").removeClass("blinking").removeClass(color);
                        $(this).addClass('blinking').addClass(color);
                    });
                    that.$(".confirm").on('click.settlementBuilding', null, function() {
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
                    that.$(".refuse").on('click.settlementBuilding', null, function() {
                        that.trigger("builtSettlement");
                    });
                },
                settlementBuildingLeave: function() {
                    var that = this;
                    that.$('.crossroad').off("click.settlementBuilding");
                    that.$(".confirm").off("click.settlementBuilding");
                    that.$(".refuse").off("click.settlementBuilding");
                    that.$(".refuse").hide();
                    that.model.get("map").disabledCrossroadHighlighting();
                    that.$(".confirm").addClass("disabled").hide();

                    if(that.$(".blinking").length){
                        that.$(".blinking").each(function(){
                            $(this).removeClass("blinking");
                        });
                    }

                },
                cityBuildingEnter: function() {
                    var that = this;
                    var currentPlayer = that.model.getCurrentPlayer();
                    var color = currentPlayer.get("color");
                    var availableCities = that.model.get("map").findAvailableCrossroadsForCity(currentPlayer);
                    that.model.get("map").highlightSettlementsForCityBuilding(availableCities);
                    that.$(".confirm").show().addClass("disabled");
                    that.$(".refuse").show();
                    that.$(".crossroad.available-for-city").on('click.cityBuilding', null, function() {
                        that.$(".confirm").removeClass("disabled");
                        that.$(".crossroad.available-for-city").removeClass("blinking city");
                        $(this).addClass('blinking city');
                    });
                    that.$(".confirm").on('click.cityBuilding', null, function() {
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
                    that.$(".refuse").on('click.cityBuilding', null, function() {
                        that.trigger("builtCity");
                    });
                },
                cityBuildingLeave: function() {
                    console.log(123);
                    var that = this;
                    var currentPlayer = that.model.getCurrentPlayer();
                    var color = currentPlayer.get("color");

                    that.$(".confirm").off("click.cityBuilding");
                    that.$(".confirm").addClass("disabled").hide();

                    that.$(".crossroad.available-for-city").off("click.cityBuilding");
                    that.$(".refuse").off("click.cityBuilding");
                    that.$(".refuse").hide();

                    that.$(".crossroad.available-for-city").removeClass("available-for-city");
                    that.model.get("map").disabledCrossroadForCityHighlighting();
                    if(that.$(".blinking").length){
                        that.$(".blinking").each(function(){
                            $(this).removeClass("blinking available-for-city city");
                        });
                    }
                }
            };
            $.extend(true, GameView.prototype, building);
        };
    }

);
