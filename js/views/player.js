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
        },
        render: function() {
            var htmlTemplate = _.template(PlayerTemplate);
            var $player = $(htmlTemplate({
                'color': this.model.get('color'),
                'name': this.model.get('name'),
                'vp': this.model.get('victoryPoints'),
                "tree": this.model.get("resources").tree,
                "sheep": this.model.get("resources").sheep,
                "brick": this.model.get("resources").brick,
                "rock": this.model.get("resources").rock,
                "wheat": this.model.get("resources").wheat
            }));
            this.$el.append($player);
            return this;
        },
        updatePlayerResources: function(model, value, options) {
            var attr = options.type;
            this.$(".resources ." + attr).text(value);
        }
    });
    return PlayerView;
});
