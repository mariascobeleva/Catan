define([
    'jquery',
    'models/const'
], function($, Const) {
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
                    that.$('.box-container').addClass('choose-res-for-rob');
                    that.$(".choose-res-for-rob .name").text(player.get("name"));
                    that.$(".choose-res-for-rob .amount").text(robResAmount);
                    that.$(".box .title-main").text('Ограбление!');
                    that.$("#overlay, .box").addClass("active");


                    that.$(".choose-res-for-rob .player-resources .res").draggable({
                        helper: "clone",
                        cursor: "move",
                        containment: ".box.active",
                        start: function(){
                            if(parseInt($(this).find('.quantity').text()) <= 0){
                                return false;
                            }
                        }
                    });

                    that.$(".player-resources .res").droppable({
                        accept: ".resources-to-bank .res",
                        activeClass: "ui-state-highlight",
                        drop: function(event, ui) {
                            var res = $(this).attr('name');
                            if (ui.draggable.attr('name') !== res) {
                                return false;
                            }
                            else {
                                var curResQuantity = parseInt($(this).find(' .quantity').text());
                                var $resToBank = $('.choose-res-for-rob .resources-to-bank .resources > .res.' + res).first();
                                var quantity = parseInt($resToBank.find('.quantity').text()) - 1;
                                if (quantity === 0) {
                                    $resToBank.addClass('empty').find('.clone').remove();
                                    $resToBank.find('.quantity').text("");
                                    $resToBank.draggable('disable');
                                }
                                else {
                                    $resToBank.find('.quantity').empty().text(quantity);
                                }
                                $(this).find('.quantity').text(curResQuantity + 1);
                            }
                        }
                    });


                    that.$(".resources-to-bank .res").droppable({
                        accept: ".player-resources .res",
                        activeClass: "ui-state-highlight",

                        drop: function(event, ui) {
                            var res = $(this).attr('name');
                            if (ui.draggable.attr('name') !== res) {
                                return false;
                            }
                            else {
                                var $curRes = $('.choose-res-for-rob .player-resources .res.' + res).not('.ui-draggable-dragging').first();
                                var curResQuantity = parseInt($curRes.find(' .quantity').text());
                                var quantity = ($(this).hasClass('empty')) ? 1 : parseInt($(this).find('.quantity').text()) + 1;
                                var $item = ui.draggable.clone();
                                $('.choose-res-for-rob .player-resources .res-' + res + ' .quantity').empty().text(curResQuantity - 1);
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

                    that.showPopupControlBtns('Отдать ресурсы');
                    that.$(".control-btns .confirm-btn").on('click.robAll', null, function() {
                        var choosenResAmount = 0;
                        var robedRes = {};
                        that.$('.choose-res-for-rob .resources-to-bank .resources > .res').each(function(){
                            var res = $(this).attr("name");
                            var amount = ($(this).find('.quantity').text() === "") ? 0 : parseInt($(this).find('.quantity').text());
                            robedRes[res] = -amount;
                            choosenResAmount = choosenResAmount + amount;
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
                            alert("Вора не проведешь!Отдайте запрашиваемое количество ресурсов!");
                            robedRes = {};
                            return false;
                        }
                    });

                },
                robAllLeave: function() {
                    this.hidePopupControlBtns();
                    this.$("#overlay, .box").removeClass("active");
                    this.$(".choose-res-for-rob .name").text("");
                    this.$(".choose-res-for-rob .amount").text("");
                    this.$(".box .title-main").text('');
                    this.$(".choose-res-for-rob .resources-to-bank .resources > .res").each(function(){
                        $(this).find('.clone').remove();
                        $(this).addClass('empty').find(".quantity").text("");
                    });
                    this.$('.box-container').removeClass('choose-res-for-rob');

                },
                robberMoveEnter: function() {
                    var that = this;
                    var currentPlayer = this.model.getCurrentPlayer();

                    that.$(".thief").addClass("active").draggable({
                        containment: ".field",
                        create: function(){$(this).data('position',$(this).position());}
                    });
                    that.$('.menu .confirm').show();
                    that.$('.hex').droppable({
                        accept:'.thief',
                        drop: function( event, ui ) {
                            var fieldX = event.pageX - that.$('.field').offset().left;
                            var fieldY = event.pageY - that.$('.field').offset().top;

                            var coordsQR = Const.getQRByXY(fieldX, fieldY);
                            console.log(coordsQR);
                            ui.draggable.data('q',coordsQR.q);
                            ui.draggable.data('r',coordsQR.r);
                            var coordsXY = Const.getXYByQR(coordsQR);

                            var left = coordsXY.x + Const.HEX_WIDTH/2 - Const.THIEF_WIDTH/2;
                            var top = coordsXY.y + Const.HEX_HEIGHT/2 - Const.THIEF_HEIGHT/2;
                            ui.draggable.animate({top:top,left:left},{duration:200,easing:'linear'});
                        }
                    });
                    that.$(".confirm").click(function() {
                        var $thief = that.$(".thief");
                        var thiefCoords = that.model.getThiefCoords($thief);
                        var robedHex = that.model.get("map").getHexByCoords(thiefCoords);
                        if(robedHex && robedHex.get('type') !== 'seaHex'){
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
                        }
                        else {
                            alert("Вор должен находится на игровом поле!");
                        }
                    });
                },
                robberMoveLeave: function() {
                    this.$(".confirm").off("click");
                    this.$(".confirm").hide();
                    this.$(".thief").removeClass("active");
                    this.$(".thief").draggable("destroy");
                },
                robberChooseVictimEnter: function(playersRb) {
                    var that = this;
                    that.$('.box-container').addClass('choose-player-for-robber');
                    that.$('.box .title-main').text('Ограбление');

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
                    this.$('.box-container').removeClass('choose-player-for-robber');
                }
            };

            $.extend(true, GameView.prototype, robber);
            GameView.prototype.states.rollDice.enter.push("robberCheck");

        };
    }
);