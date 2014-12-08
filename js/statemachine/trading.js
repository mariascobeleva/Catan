define([
    'jquery'
], function($) {
        return function(GameView) {
            var trading = {
                states: {
                    trading: {enter: ["tradingEnter"], leave: ["tradingLeave"]},
                },
                transitions: {
                    trading: {
                        tradeWithBank: {
                            enterState: "mainGame"
                        }
                    }
                },
                tradingEnter: function() {
                    var that = this;
                    that.$("#overlay, .box, .change-resources").addClass("active");


                    var currentPlayer = this.model.getCurrentPlayer();
                    that.displayPlayerResourcesForChange(currentPlayer);
                    that.displayExchangeRate(currentPlayer);
                    that.$(".change-resources.active .value").each(function() {
                        $(this).text("0");
                    });
                    that.$(".player-resources .controls .add").on("click.trading",null, function(){
                        var $amount = $(this).siblings(".value");
                        var $res = $(this).parent(".controls").siblings("span");

                        if (parseInt($res.text()) !== 0) {
                            $res.text(parseInt($res.text()) - 1);
                            $amount.text(parseInt($amount.text()) + 1);
                        }

                    });
                    that.$(".player-resources .controls .decrease").on("click.trading",null, function(){
                        var $amount = $(this).siblings(".value");
                        var $res = $(this).parent(".controls").siblings("span");

                        if (parseInt($amount.text()) !== 0) {
                            $res.text(parseInt($res.text()) + 1);
                            $amount.text(parseInt($amount.text()) - 1);
                        }
                    });

                    that.$(".resources-for-change .controls .add").on("click.trading",null, function(){
                        var $amount = $(this).siblings(".value");
                        $amount.text(parseInt($amount.text()) + 1);
                    });
                    that.$(".resources-for-change .controls .decrease").on("click.trading",null, function(){
                        var $amount = $(this).siblings(".value");
                            if (parseInt($amount.text()) !== 0) {
                                $amount.text(parseInt($amount.text()) - 1);
                            }
                    });


                    that.$(".change-resources .confirm").on("click.trading",null, function(){
                        var allowableAmount = 0;
                        var amountResFromBank = 0;
                        var resForDeal = {};

                        that.$(".change-resources .player-resources .controls .value").each(function() {
                            var res = $(this).parents(".controls").siblings("span").attr("name");
                            var amount = parseInt($(this).text());
                            var rate = currentPlayer.getExchangeRate(res);
                            if (amount >= rate && ((amount / rate) % 1 === 0)) {
                                allowableAmount = allowableAmount + amount / rate;
                                resForDeal[res] = -amount;
                            }
                            else if (amount !== 0) {
                                alert("Вы не можете обменять " + amount + res + ". Ваш обменный курс для этого ресурса 1:" + rate);
                                allowableAmount = 0;
                                return false;
                            }
                        });

                        if (allowableAmount !== 0) {
                            that.$(".resources-for-change .controls .value").each(function() {
                                var res = $(this).parents(".controls").siblings("span").attr("name");
                                var amount = parseInt($(this).text());
                                amountResFromBank = amountResFromBank + amount;
                                if (amount !== 0) {
                                    resForDeal[res] = amount;
                                }
                            });

                            if (allowableAmount !== amountResFromBank && allowableAmount !== 0) {
                                alert("Вы запрашиваете неправильное количество ресурсов!");
                                return false;
                            }
                            currentPlayer.spendResource(resForDeal);
                            that.displayPlayerResourcesForChange(currentPlayer);
                            that.$(".change-resources.active .value").each(function() {
                                $(this).text("0");
                            });
                        }
                    });
                    that.$("#close").on("click.trading",null, function(){
                        that.trigger('tradeWithBank');
                    });

                },
                tradingLeave: function() {
                    this.$("#overlay, .box, .change-resources").removeClass("active");
                    this.$(".player-resources .controls .add").off("click.trading");
                    this.$(".resources-for-change .controls .add").off("click.trading");
                    this.$(".resources-for-change .controls .decrease").off("click.trading");
                    this.$(".player-resources .controls .decrease").off("click.trading");
                    this.$("#close").off("click.trading");
                    this.$(".change-resources .confirm").off("click.trading");
                }
            };
            $.extend(true, GameView.prototype, trading);
        };
    }

);
