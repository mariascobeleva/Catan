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
                    that.$("#overlay, .box").addClass("active");
                    that.$('.box-container').addClass("change-resources");
                    that.$('.title-main').text('Торговля с банком');
                    that.showPopupControlBtns('Обменять','Отменить');
                    var currentPlayer = this.model.getCurrentPlayer();
                    that.displayPlayerResourcesForChange(currentPlayer);
                    that.displayExchangeRate(currentPlayer);

                    that.$(".player-resources .res").draggable({
                        helper: "clone",
                        cursor: "move",
                        containment: ".box.active",
                        start: function(){
                            if(parseInt($(this).find('.quantity').text()) <= 0){
                                return false;
                            }
                        }
                    });

                    that.$(".resources-to-bank .res, .resources-from-bank .res").droppable({
                        accept: ".player-resources .res",
                        activeClass: "ui-state-highlight",
                        drop: function(event, ui) {
                            var res = $(this).attr('name');
                            var $parent = $(this).closest('.resources').parent();
                            var $oppositeOfParent = ($parent.hasClass('give')) ? $('.resources-from-bank') : $('.resources-to-bank');
                            var resIsInTrade = ($oppositeOfParent.find('.' + res + ' .quantity').text() !== "");
                            if (ui.draggable.attr('name') !== res || resIsInTrade) {
                                return false;
                            }
                            else {
                                // clone item to retain in original "list"
                                var $curRes = $('.change-resources .player-resources .res.' + res).not('.ui-draggable-dragging').first();
                                var curResQuantity = parseInt($curRes.find(' .quantity').text());
                                var updatedResQuantity = ($parent.hasClass('give')) ? (curResQuantity - 1) : (curResQuantity + 1);
                                $('.change-resources .player-resources .res-' + res + ' .quantity').empty().text(updatedResQuantity);
                                var quantity = ($(this).hasClass('empty')) ? 1 : parseInt($(this).find('.quantity').text()) + 1;
                                var $item = ui.draggable.clone();
                                $item.addClass('clone');
                                $(this).removeClass('empty').html($item).find('.quantity').text(quantity);
                                $(this).draggable({
                                    helper: "clone",
                                    cursor: "move",
                                    containment: ".box.active"
                                });
                                $(this).draggable('enable');
                            }

                        }
                    });

                    that.$(".player-resources .res").droppable({
                        accept: ".resources-to-bank .res, .resources-from-bank .res",
                        activeClass: "ui-state-highlight",
                        drop: function(event, ui) {
                            var res = $(this).attr('name');
                            if (ui.draggable.attr('name') !== res){
                                return false;
                            }
                            else {
                                // clone item to retain in original "list"
                                var $acceptedSection = ui.draggable.closest('.resources').parent();
                                var curResQuantity = parseInt($(this).find(' .quantity').text());
                                var $resToBank = $acceptedSection.find(' .resources > .res.' + res).first();
                                var quantity = ($resToBank.hasClass('empty')) ? 1 : parseInt($resToBank.find('.quantity').text()) - 1;
                                if (quantity === 0) {
                                    $resToBank.addClass('empty').find('.clone').remove();
                                    $resToBank.find('.quantity').text("");
                                }
                                else {
                                    $resToBank.find('.quantity').empty().text(quantity);
                                }
                                var updatedResQuantity = ($acceptedSection.hasClass('give')) ? (curResQuantity + 1) : (curResQuantity - 1);
                                $(this).find('.quantity').text(updatedResQuantity);
                            }
                        }
                    });


                    that.$(".control-btns .confirm-btn").on("click.trading",null, function(){

                        var allowableAmount = 0;
                        var amountResFromBank = 0;
                        var resForDeal = {};

                        that.$('.resources-to-bank .resources > .res').each(function(){
                            if($(this).find('.quantity').text() !== "" ){
                                var res = $(this).attr('name');
                                var amount = parseInt($(this).find('.quantity').text());
                                var rate = currentPlayer.getExchangeRate(res);
                                if (amount >= rate && ((amount / rate) % 1 === 0)) {
                                    allowableAmount = allowableAmount + amount / rate;
                                    resForDeal[res] = -amount;
                                }
                                else if (amount !== 0) {
                                    alert("Вы не можете обменять " + amount  + " " + res + ". Ваш обменный курс для этого ресурса 1:" + rate);
                                    allowableAmount = 0;
                                    return false;
                                }
                            }
                        });
                        if (allowableAmount !== 0) {
                            that.$('.resources-from-bank .resources > .res').each(function(){
                                var res = $(this).attr('name');
                                var amount = ($(this).find('.quantity').text() === "") ? 0 : parseInt($(this).find('.quantity').text());
                                if (amount !== 0) {
                                    resForDeal[res] = amount;
                                    amountResFromBank = amountResFromBank + amount;

                                }
                            });
                            if (allowableAmount !== amountResFromBank && allowableAmount !== 0) {
                                alert("Вы запрашиваете неправильное количество ресурсов!");
                                return false;
                            }
                            currentPlayer.spendResource(resForDeal);
                            that.displayPlayerResourcesForChange(currentPlayer);
                            that.$(".resources-to-bank .res, .resources-from-bank .res").each(function() {
                                $(this).addClass('empty').find(".quantity").text("");
                            });
                        }
                        else {
                            alert('Выберите ресурсы для обмена.');
                        }
                    });

                    that.$(".control-btns .cancel").on("click.trading",null, function(){
                        that.displayPlayerResourcesForChange(currentPlayer);
                        that.$(".resources-to-bank .res, .resources-from-bank .res").each(function() {
                            $(this).addClass('empty').find(".quantity").text("");
                        });
                        that.trigger('tradeWithBank');
                    });

                },
                tradingLeave: function() {
                    this.$("#overlay, .box, .change-resources").removeClass("active");
                    this.$('.box-container').removeClass('change-resources');
                    //this.$(".player-resources .res.ui-draggable").draggable('destroy');
                    //this.$(".player-resources .res.ui-droppable").droppable('destroy');
                    //this.$(".resources-to-bank .res.ui-droppable, .resources-from-bank .res.ui-droppable").droppable('destroy');
                    this.hidePopupControlBtns();
                }
            };
            $.extend(true, GameView.prototype, trading);
        };
    }

);
