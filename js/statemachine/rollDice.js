define([
    'jquery'
], function($) {
        return function(GameView) {
            var rollDice = {
                states: {
                    rollDice: {enter: ["rollDiceEnter"], leave: ["rollDiceLeave"]}
                },
                transitions: {
                    rollDice: {
                        rollDiceAndStartGame: {
                            enterState: "mainGame"
                        }
                    }
                },
                rollDiceEnter: function() {
                    // Show rolling dice;
                    var that = this;
                    var value_1 = that.model.get("dice").get("value_1");
                    var value_2 = that.model.get("dice").get("value_2");
                    this.$('.first .dice').removeClass('value-' + value_1);
                    this.$('.second .dice').removeClass('value-' + value_2);
                    that.model.get("dice").setDiceValue();

                    // Activate Rob for test //TODO: delete it after popup for rob will be complete
                    //this.model.get("dice").set("value_1",3);
                    //this.model.get("dice").set("value_2",4);

                    that.$('.dice').addClass('animated');
                    var diceAmount = that.model.get("dice").getDiceAmount();
                    if (diceAmount !== 7) {
                        that.model.grabResourcesGlobal(diceAmount);
                    }
                    setTimeout(function(){that.trigger('rollDiceAndStartGame');},2000);
                },
                rollDiceLeave: function() {
                    // Hide dices.
                    var value_1 = this.model.get("dice").get("value_1");
                    var value_2 = this.model.get("dice").get("value_2");
                    this.$('.dice').removeClass('animated');
                    this.$('.first .dice').addClass('value-' + value_1);
                    this.$('.second .dice').addClass('value-' + value_2);

                }

            };
            $.extend(true, GameView.prototype, rollDice);
        };
    }

);
