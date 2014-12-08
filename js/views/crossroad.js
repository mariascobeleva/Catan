define([
    'jquery',
    'underscore',
    'backbone',
    'debug',
    "models/const"

], function($, _, Backbone, Debug, Const) {
    var CrossroadView = Backbone.View.extend({
        className: 'crossroad',
        hexViews: [],
        events: {
        },

        initialize: function() {

            this.x = Const.HEX_EDGE_SIZE * 3 / 2 * (this.model.get('coords').q);
            this.y = Const.HEX_EDGE_SIZE * Math.sqrt(3) * (this.model.get('coords').r + this.model.get('coords').q / 2);

            // Adjust for field centering.
            this.x = this.x + (Const.FIELD_WIDTH);
            this.y = this.y + (Const.FIELD_HEIGHT);

            this.x = this.x - (Const.CROSSROAD_HEIGHT / 2);
            this.y = this.y - (Const.CROSSROAD_HEIGHT / 2);

            this.x = Math.round(this.x);
            this.y = Math.round(this.y);

            this.addListeners();
            this.$el.data('view', this);
        },
        render: function() {
            this.$el.css({'left': this.x, 'top': this.y});
            return this;
        },
        addListeners: function() {
            this.model.on("change:type", this.renderCrossroadWithSettlement, this);
            this.model.on("highlight", this.doHighlight, this);
            this.model.on("highlightAsCity", this.doHighlightAsCity, this);
            this.model.on("removeHighlighting", this.removeHighlighting, this);
            this.model.on("removeHighlightingAsCity", this.removeHighlightingAsCity, this);
        },
        doHighlight: function(){
           this.$el.addClass("available");
        },
        doHighlightAsCity: function(){
            this.$el.addClass("available-for-city");
        },
        removeHighlighting: function(){
            this.$el.removeClass("available");
        },
        removeHighlightingAsCity: function(){
            this.$el.removeClass("available-for-city");
        },
        renderCrossroadWithSettlement: function() {
            if (this.model.get("type") === 3) {
                this.$el.css("display", "none");
            }
            else if (this.model.get("type") === 1) {

                var index = this.model.get("game").get("currentPlayer");
                var currentPlayer = this.model.get("game").get("players")[index];
                var color = currentPlayer.get("color");
                this.$el.removeClass("blinking").css("background", color);
            }
            else if(this.model.get("type") === 2){
                this.$el.removeClass("blinking").addClass("city");
            }
            else if (this.model.get("type") === 0) {
                this.$el.css({"display": "block"});
            }


        }
    });
    return CrossroadView;
});
