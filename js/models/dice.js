define([
    'jquery',
    'underscore',
    'backbone',
    "models/const"
], function($, _, Backbone, Const) {
    var diceModel = Backbone.Model.extend({
            defaults: {
                "value_1": 0,
                "value_2": 0
            },
        initialize: function(options){
            if (options.value_1) {
                this.set('value_1', options.value_1);
            }
            if (options.value_2) {
                this.set('value_2', options.value_2);
            }

        },
        getDiceValue: function() {
            var dice_value = Const.VALUES_OF_DICE[Math.floor(Math.random() * Const.VALUES_OF_DICE.length)];
            return dice_value;
        },
        setDiceValue: function() {
            this.set("value_1",this.getDiceValue());
            this.set("value_2",this.getDiceValue());
        }

    });
    return diceModel;
});