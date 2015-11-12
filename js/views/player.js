define([
    'jquery',
    'underscore',
    'backbone',
    'models/player',
    'text!templates/player.html'
], function($, _, Backbone, Player, PlayerTemplate) {
    var PlayerView = Backbone.View.extend({
        initialize: function() {
            this.model.on("change:res_tree", this.updatePlayerResources, this);
            this.model.on("change:res_wheat", this.updatePlayerResources, this);
            this.model.on("change:res_brick", this.updatePlayerResources, this);
            this.model.on("change:res_sheep", this.updatePlayerResources, this);
            this.model.on("change:res_rock", this.updatePlayerResources, this);
            this.model.on("change:victoryPoints", this.renderVictoryPoints, this);

        },
        render: function() {
            var htmlTemplate = _.template(PlayerTemplate);
            var $player = $(htmlTemplate({
                'color': this.model.get('color'),
                'name': this.model.get('name'),
                'vp': this.model.get('victoryPoints'),
                "tree": this.model.get("res_tree"),
                "sheep": this.model.get("res_sheep"),
                "brick": this.model.get("res_brick"),
                "rock": this.model.get("res_rock"),
                "wheat": this.model.get("res_wheat")
            }));
            this.$el.append($player);
            return this;
        },
        updatePlayerResources: function(model, value, options) {
            var attr = options.type;
            this.$(".resources .res." + attr + " .quantity").text(value);
            this.$('.resources span').text(this.model.getTotalAmountOfPlayerRes());
        },
        renderVictoryPoints: function(){
            this.$(".vp").text(this.model.getVictoryPoints());
        }
    });
    return PlayerView;
});
