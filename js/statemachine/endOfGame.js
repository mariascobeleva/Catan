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
                    that.$('.box-container').addClass('end-of-game');
                    var title = '<p>Игра окончена!В этот раз победу одержал <span class="winner"></span>!</p>';
                    that.$('.title-main').append(title);
                    that.$(".end-of-game").show();
                    that.$(".title-main span.winner").text(currentPlayer.get("name"));
                    that.$(".confirm-btn").on("click.endOfGame",null, function(){
                        window.location = "";
                    });
                    that.showPopupControlBtns("Новая Игра");
                },
                endOfGameLeave: function() {
                    this.$(".title-main").empty();
                    this.$("..confirm-btn").off("click.endOfGame");
                    this.$('box-container').removeClass('end-of-game');
                    this.hidePopupControlBtns();
                }
            };
            $.extend(true, GameView.prototype, endOfGame);
        };
    }

);

