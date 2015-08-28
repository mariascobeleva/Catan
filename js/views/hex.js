define([
    'jquery',
    'underscore',
    'backbone',
    'models/const'

], function($, _, Backbone, Const) {
    var HexView = Backbone.View.extend({
        className: 'hex',
        crossroadViews:[],
        initialize: function() {

            // See flat top axis coords formula at: http://www.redblobgames.com/grids/hexagons/#hex-to-pixel
            this.x = Const.HEX_EDGE_SIZE * 3 / 2 * (this.model.get('coords').q);
            this.y = Const.HEX_EDGE_SIZE * Math.sqrt(3) * (this.model.get('coords').r + this.model.get('coords').q / 2);

            // Adjust for field centering.
            this.x = this.x + (Const.FIELD_WIDTH/2);
            this.y = this.y + (Const.FIELD_HEIGHT/2);
//
            // Adjust for hex centering.
            this.x = this.x - (Const.HEX_WIDTH / 2);
            this.y = this.y - (Const.HEX_HEIGHT / 2);

            this.x = Math.round(this.x);
            this.y = Math.round(this.y);

        },
        render: function() {
            var value = this.model.get("value");
            this.$el.css({'left': this.x, 'top': this.y});
            this.$el.addClass(this.model.get("type")).text(value);
            return this;
        }
    });
    return HexView;
});