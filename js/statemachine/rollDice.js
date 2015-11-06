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
                    this.model.get("dice").setDiceValue();
                    // Activate Rob for test //TODO: delete it after popup for rob will be complete
                    //this.model.get("dice").set("value_1",3);
                    //this.model.get("dice").set("value_2",4);

                    var diceAmount = this.model.get("dice").getDiceAmount();
                    if (diceAmount !== 7) {
                        this.model.grabResourcesGlobal(diceAmount);
                        this.trigger("rollDiceAndStartGame");
                    }
                },
                rollDiceLeave: function() {
                    // Hide dices.
                }

            };
            $.extend(true, GameView.prototype, rollDice);
        };
    }

);
