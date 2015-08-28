define([
    'jquery',
    "models/const"
], function($, Const) {
        return function(GameView) {
            var endOfGame = {
                states: {
                    endOfGame: {enter: ["endOfGameEnter"], leave: ["endOfGameLeave"]}
                },
                transitions: {
                    endOfGame: {
                        builtSettlementAndFinish: {
                            enterState: "settlementBuilding"
                        },
                        builtCityAndFinish : {
                            enterState: "cityBuilding"
                        }
                    }
                },
                endOfGameEnter: function(){
                    var currentPlayer = this.model.getCurrentPlayer();
                    var that = this;
                    that.$("#overlay,.box").addClass("active");
                    that.$(".end-of-game").show();
                    that.$(".end-of-game span.winner").text(currentPlayer.get("name"));
                    that.$(".play-one-more-time").on("click.endOfGame",null, function(){
                        window.location = "";
                    });
                },
                endOfGameLeave: function() {
                    this.$(".end-of-game span.name").text();
                    this.$(".play-one-more-time.endOfGame").off("click.endOfGame");
                }
            };
            $.extend(true, GameView.prototype, endOfGame);
        };
    }

);

