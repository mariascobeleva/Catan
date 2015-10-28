define([
    'jquery'
], function($) {
        return function(GameView) {
            var mainGame = {
                states: {
                    mainGame: {enter: ["mainGameEnter"], leave: ["mainGameLeave"]}
                },
                transitions: {
                    mainGame: {
                        startTurn: {
                            enterState: 'rollDice'
                        },
                        startTrading: {
                            enterState: "trading"
                        },
                        startBuilding: {
                            enterState: "building"
                        }
                    }
                },
                mainGameEnter: function() {
                    var that = this;
                    var curPlayer = that.model.getCurrentPlayer();
                    that.renderCurrentPlayerResources(curPlayer);
                    that.$(".end-turn,.change-with-bank").addClass("active");
                    that.$(".choose-for-building").addClass("active");

                    that.$(".change-with-bank").on("click.mainGame",null, function(){
                        if ($(this).is(".active")) {
                            that.trigger("startTrading");
                        }
                    });

                    that.$(".end-turn").on("click.mainGame",null, function(){
                        if ($(this).is(".active")) {
                            that.model.nextPlayer();
                            that.trigger("startTurn");
                        }
                    });
                    that.$(".choose-for-building").on("click.mainGame",null, function(){
                        that.trigger("startBuilding");
                    });
                },
                mainGameLeave: function() {
                    this.$(".end-turn,.change-with-bank,.choose-for-building").removeClass("active");

                    this.$(".build").removeClass("disabled").hide();
                    this.$(".change-with-bank").off("click.mainGame");
                    this.$(".end-turn").off("click.mainGame");
                    this.$(".choose-for-building").off("click.mainGame");
                }

            };
            $.extend(true, GameView.prototype, mainGame);
        };
    }

);
