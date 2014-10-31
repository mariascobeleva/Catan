define([
    'jquery',
    'underscore',
    'backbone',
    "models/const",
    'text!templates/dice.html'

], function($, _, Backbone, Const, DiceTemplate) {
    var DiceView = Backbone.View.extend({
        className: "dice",
        render : function(){
            var htmlTemplate = _.template(DiceTemplate);
            var $dice = $(htmlTemplate({}));
            this.$el.append($dice);

            this.renderDiceValue();
            return this;
        },
        rollTheDice: function() {
            var dice_value = Const.VALUES_OF_DICE[Math.floor(Math.random() * Const.VALUES_OF_DICE.length)];
            return dice_value;
        },
        renderDiceValue: function (){
            this.$(".value-1").text(this.model.get("value_1"));
            this.$(".value-2").text(this.model.get("value_2"));
        },
        setDiceValue: function() {
            var dice_value_1 = this.rollTheDice();
            var dice_value_2 = this.rollTheDice();
            this.model.set("value_1",dice_value_1);
            this.model.set("value_2",dice_value_2);

            this.renderDiceValue();
        }
    });
    return DiceView;
});
