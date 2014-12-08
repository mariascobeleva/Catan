define([
    'jquery'
], function($) {
        return function (GameView) {
            var robber = {
                states: {
                    robAll: {enter: ["robAllEnter"], leave: ["robAllLeave"]},
                    robberMove: {enter: ["robberMoveEnter"], leave: ["robberMoveLeave"]},
                    robberChooseVictim: {enter: ["robberChooseVictimEnter"], leave: ["robberChooseVictimLeave"]}
                },
                transitions: {
                    rollDice: {
                        rollDiceAndDoRobbery: {
                            enterState: "robAll"
                        }
                    },
                    robAll: {
                        robNextPlayer: {
                            enterState: "robAll"
                        },
                        playersRobed: {
                            enterState: "robberMove"
                        }
                    },
                    robberMove: {
                        robberMoveOnHexWithFewPl: {
                            enterState: "robberChooseVictim"
                        },
                        robberMoveAndRob: {
                            enterState: "mainGame"
                        }
                    },
                    robberChooseVictim: {
                        playerRobed: {
                            enterState: "mainGame"
                        }
                    }
                },
                robberCheck: function() {
                    if (this.model.get("dice").getDiceAmount() === 7) {
                        this.trigger("rollDiceAndDoRobbery");
                    }
                },
                robAllEnter: function() {
                    var that = this;
                    if (!this.richPlayers) {
                        this.richPlayers = this.model.getPlayersWithMoreThanSevenResources();
                    }
                    if (that.richPlayers.length === 0) {
                        that.trigger("playersRobed");
                        delete this.richPlayers;
                        return;
                    }
                    var player = that.richPlayers.pop();

                    that.displayPlayerResourcesForChange(player);
                    var robResAmount = Math.floor(player.getTotalAmountOfPlayerRes() / 2);

                    that.$(".choose-res-for-rob .name").text(player.get("name"));
                    that.$(".choose-res-for-rob .amount").text(robResAmount);
                    that.$("#overlay, .box").addClass("active");
                    that.$("#close").hide();
                    that.$(".choose-res-for-rob").show();

                    that.$(".ctrl.add").on('click.robAll', null, function() {
                        var $amountForRob = $(this).siblings(".value");
                        var $res = $(this).parent(".controls").siblings("span");

                        if (parseInt($res.text()) !== 0) {
                            $res.text(parseInt($res.text()) - 1);
                            $amountForRob.text(parseInt($amountForRob.text()) + 1);
                        }
                    });

                    that.$(".ctrl.decrease").on('click.robAll', null, function() {
                        var $amountForRob = $(this).siblings(".value");
                        var $res = $(this).parent(".controls").siblings("span");

                        if (parseInt($amountForRob.text()) !== 0) {
                            $res.text(parseInt($res.text()) + 1);
                            $amountForRob.text(parseInt($amountForRob.text()) - 1);
                        }
                    });

                    that.$(".confirm").on('click.robAll', null, function() {
                        var choosenResAmount = 0;
                        var robedRes = {};
                        that.$(".controls .value").each(function() {
                            var res = $(this).parent(".controls").siblings("span").attr("name");
                            var amount = parseInt($(this).text());
                            robedRes[res] = -amount;
                            choosenResAmount = choosenResAmount + parseInt($(this).text());
                        });
                        if (robResAmount === choosenResAmount) {
                            player.spendResource(robedRes);
                            that.model.get("bank").spendResource((robedRes));
                            if (that.richPlayers.length >= 1) {
                                alert("Передайте устройство игроку " + that.richPlayers[that.richPlayers.length - 1].get("name"));
                                that.trigger("robNextPlayer");
                            }
                            else {
                                that.trigger("playersRobed");
                            }

                        }
                        else {
                            alert("You gave to rob wrong amount of resources!");
                            robedRes = {};
                        }
                    });

                },
                robAllLeave: function() {
                    this.$(".ctrl.add").off("click.robAll");
                    this.$(".ctrl.decrease").off("click.robAll");
                    this.$(".confirm").off("click.robAll");
                    this.$("#overlay, .box").removeClass("active");
                    this.$(".choose-res-for-rob").hide();
                    this.$("#close").show();

                    this.$(".controls .value").each(function(){
                         $(this).text("0");
                    });

                },
                robberMoveEnter: function() {
                    var that = this;
                    var currentPlayer = this.model.getCurrentPlayer();
                    that.$(".thief").addClass("active").draggable({
                        containment: ".field"
                    });
                    that.$(".do-rob").show();
                    that.$(".do-rob").click(function() {
                        var $thief = that.$(".thief");
                        var thiefCoords = that.model.getThiefCoords($thief);
                        var robedHex = that.model.get("map").getHexByCoords(thiefCoords);
                        that.model.setRobedHex(robedHex);

                        var playersRb = robedHex.getPlayersWhichBuiltOnHex(currentPlayer);
                        var choosenPlayer = playersRb[0];
                        if (playersRb.length > 1) {
                            that.trigger("robberMoveOnHexWithFewPl", playersRb);
                        }
                        else {
                            if (playersRb.length && choosenPlayer.checkIfPlayerHaveResources()){
                                currentPlayer.stealResource(choosenPlayer);
                            }
                            that.trigger("robberMoveAndRob");
                        }
                    });
                },
                robberMoveLeave: function() {
                    this.$(".do-rob").off("click");
                    this.$(".do-rob").hide();
                    this.$(".thief").removeClass("active");
                    this.$(".thief").draggable("destroy");
                },
                robberChooseVictimEnter: function(playersRb) {
                    var that = this;
                    var currentPlayer = this.model.getCurrentPlayer();
                    var choosenPlayer;
                    for (var i = 0; i < playersRb.length; i++) {
                        that.$(".choose-player-for-robber span.player" + (i + 1)).text(playersRb[i].get("name"));
                    }
                    that.$("#overlay, .box").addClass("active");
                    that.$(".choose-player-for-robber").show();

                    that.$(".choose-player-for-robber span").on('click.robberChoose', null, function() {
                        var numberOfPlayer = $(this).index();
                        choosenPlayer = playersRb[numberOfPlayer];
                        if(choosenPlayer.checkIfPlayerHaveResources()){
                            currentPlayer.stealResource(choosenPlayer);
                        }
                        that.trigger("playerRobed");
                    });
                },
                robberChooseVictimLeave: function() {
                    this.$(".choose-player-for-robber span").off("click.robberChoose");
                    this.$("#overlay, .box").removeClass("active");
                    this.$(".choose-player-for-robber").hide();
                }
            };

            $.extend(true, GameView.prototype, robber);
            GameView.prototype.states.rollDice.enter.push("robberCheck");

        };
    }
);