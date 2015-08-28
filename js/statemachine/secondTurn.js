define([
    'jquery',
    "debug"
], function($, Debug) {
        return function(GameView) {
            var secondTurn = {
                states: {
                    ftSettlement: {enter: ['ftSettlementEnter'], leave: ['ftSettlementLeave']},
                    ftRoad: {enter: ['ftRoadEnter'], leave: ['ftRoadLeave']},
                    stSettlement: {enter: ["stSettlementEnter"], leave: ["stSettlementLeave"]},
                    stRoad: {enter: ["stRoadEnter"], leave: ["stRoadLeave"]}
                },
                transitions: {
                    stSettlement: {
                        stBuiltSettlement: {
                            enterState: "ftRoad"
                        },
                        stBuiltSettlementNextPlayer: {
                            enterState: "stRoad"
                        }
                    },
                    stRoad: {
                        stBuiltRoadNextPlayer: {
                            enterState: "stSettlement"
                        },
                        startGame: {
                            enterState: "rollDice"
                        }
                    }
                },
                stSettlementEnter: function() {
                    var that = this;
                    var currentPlayer = that.model.getCurrentPlayer();
                    var color = currentPlayer.get("color");
                    var availableCrossroads = this.model.get("map").findAvailableCrossroads(currentPlayer);
                    this.model.get("map").highlightAvailableCrossroads(availableCrossroads);
                    that.$(".build").show().addClass("disabled");
                    that.$('.available.crossroad').on('click.stSettlement', function() {
                        Debug.log('$(".crossroads .crossroad:nth-child(' + ($(this).index() + 1) + ')").click();');
                        that.$(".build").removeClass("disabled");
                        that.$(".crossroad.blinking").removeClass("blinking").removeClass(color);
                        $(this).addClass('blinking').addClass(color);
                    });
                    that.$(".build").on('click.stSettlement', function() {
                        if (!$(this).is(".disabled")) {
                            Debug.log("$('.build').click();");
                            var view = that.$(".crossroad.blinking").data('view');
                            view.model.setSettlement(view.model.q(), view.model.r(), currentPlayer);
                            that.model.grabResources(view.model);
                            that.trigger("stBuiltSettlementNextPlayer", view);
                        }
                    });
                },
                stSettlementLeave: function() {
                    this.$(".build").off("click.stSettlement");
                    this.$('.crossroad').off("click.stSettlement");
                    this.$('.crossroad.available').trigger("removeHighlighting");
                    this.$(".build").addClass("disabled").hide();
                },
                stRoadEnter: function(view) {
                    var that = this;
                    var currentPlayer = this.model.getCurrentPlayer();
                    var color = currentPlayer.get("color");

                    var availableRoads = that.model.get("map").findAvailableRoadsByCrossroad(currentPlayer, view);
                    this.model.get("map").highlightRoads(availableRoads);
                    that.$(".build").show().addClass("disabled");
                    that.$('.available.road').on('click.stRoad', function() {
                        Debug.log('$(".roads .road:nth-child(' + ($(this).index() + 1) + ')").click();');
                        that.$(".build").removeClass("disabled");
                        that.$('.blinking.' + color + '.road').removeClass("blinking").removeClass(color);
                        $(this).addClass('blinking').addClass(color);
                    });
                    that.$(".build").on('click.stRoad', function() {
                        if (!$(this).is(".disabled")) {
                            Debug.log("$('.build').click();");
                            $(".road.blinking").trigger("setRoad");
                            if (that.model.get("currentPlayer") !== 2) {
                                that.model.nextPlayer();
                                that.trigger("stBuiltRoadNextPlayer");
                            }
                            else {
                                that.model.nextPlayer();
                                that.trigger("startGame");
                            }
                        }
                    });
                },
                stRoadLeave: function() {
                    this.$(".build").off("click.stRoad");
                    this.$('.road').off("click.stRoad");
                    this.model.get("map").disableRoadHighlighting();
                    this.$(".build").addClass("disabled").hide();
                }
            };
            $.extend(true, GameView.prototype, secondTurn);
        };
    }

);
