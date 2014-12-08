define([
    'jquery',
    "debug"
], function($, Debug) {
        return function(GameView) {
            var firstTurns = {
                states: {
                    ftSettlement: {enter: ['ftSettlementEnter'], leave: ['ftSettlementLeave']},
                    ftRoad: {enter: ['ftRoadEnter'], leave: ['ftRoadLeave']},
                    stSettlement: {enter: ["stSettlementEnter"], leave: ["stSettlementLeave"]},
                    stRoad: {enter: ["stRoadEnter"], leave: ["stRoadLeave"]}
                },
                transitions: {
                ftSettlement: {
                    ftBuiltSettlement: {
                        enterState: 'ftRoad'
                    }
                },
                ftRoad: {
                    ftBuiltRoadNextPlayer: {
                        enterState: 'ftSettlement'
                    },
                    ftBuiltRoadAndSecondTurn: {
                        enterState: "stSettlement"
                    }
                }
            },
                ftSettlementEnter: function() {
                    var that = this;
                    var currentPlayer = this.model.getCurrentPlayer();
                    var availableCrossroads = this.model.get("map").findAvailableCrossroads(currentPlayer, false);
                    that.model.get("map").highlightAvailableCrossroads(availableCrossroads);
                    that.$(".build").show().addClass("disabled");
                    this.$('.available.crossroad').on('click.ftSettlement', null, function() {
                        Debug.log('$(".crossroads .crossroad:nth-child(' + ($(this).index() + 1) + ')").click();');
                        var color = currentPlayer.get("color");
                        that.$(".build").removeClass("disabled");
                        that.$(".crossroad.blinking").removeClass("blinking").css("background", "rgba(255,255,255,0.5)");
                        $(this).addClass('blinking').css({"background": color});
                    });
                    that.$(".build").on('click.ftSettlement', null, function() {
                        if (!$(this).is(".disabled")) {
                            Debug.log("$('.build').click();");
                            var view = that.$(".crossroad.blinking").data('view');
                            view.model.setSettlement(view.model.q(), view.model.r(), currentPlayer);
                            that.trigger("ftBuiltSettlement", view);
                        }
                    });
                },
                ftSettlementLeave: function() {
                    this.$(".build").off("click.ftSettlement");
                    this.$('.crossroad').off("click.ftSettlement");
                    this.model.get("map").disabledCrossroadHighlighting();
                    this.$(".build").addClass("disabled").hide();
                },
                ftRoadEnter: function(view) {
                    var that = this;
                    var currentPlayer = this.model.getCurrentPlayer();
                    var availableRoads = that.model.get("map").findAvailableRoadsByCrossroad(currentPlayer, view);
                    this.model.get("map").highlightRoads(availableRoads);
                    that.$(".build").show().addClass("disabled");
                    that.$('.available.road').on('click.ftRoad', null, function() {
                        Debug.log('$(".roads .road:nth-child(' + ($(this).index() + 1) + ')").click();');
                        that.$(".build").removeClass("disabled");
                        var color = currentPlayer.get("color");
                        that.$('.blinking.road').removeClass("blinking");
                        $(this).addClass('blinking').css({"background": color});
                    });
                    that.$(".build").on('click.ftRoad', null, function() {
                        if (!$(this).is(".disabled")) {
                            Debug.log("$('.build').click();");
                            $(".road.blinking").trigger("setRoad");
                            if (that.model.get("currentPlayer") !== 0) {
                                that.model.prevPlayer();
                                that.trigger("ftBuiltRoadNextPlayer");
                            }
                            else {
                                that.trigger("ftBuiltRoadAndSecondTurn");
                            }
                        }
                    });
                },
                ftRoadLeave: function() {
                    this.$(".build").off("click.ftRoad");
                    this.$('.road').off("click.ftRoad");
                    this.model.get("map").disabledRoadHighlighting();
                    this.$(".build").addClass("disabled").hide();

                }
            };
            $.extend(true, GameView.prototype, firstTurns);

        };
    }

);
