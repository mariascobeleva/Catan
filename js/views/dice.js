define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/dice.html'

], function($, _, Backbone, DiceTemplate) {
    var DiceView = Backbone.View.extend({
        className: "dices",
        render : function(){
            var htmlTemplate = _.template(DiceTemplate);
            var $dice = $(htmlTemplate({
              'value_1': this.model.get('value_1'),
              'value_2': this.model.get('value_2')
        }));
            this.$el.append($dice);
            return this;
        },
        initialize: function(){
            this.model.on("change",this.renderDiceValue,this);
        },
        renderDiceValue: function(){
            this.$(".value-1").text(this.model.get("value_1"));
            this.$(".value-2").text(this.model.get("value_2"));
        }
    });
    return DiceView;
});
