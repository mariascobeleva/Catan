define([
    'jquery',
    'underscore',
    'backbone'

], function($, _, Backbone) {
    var HexView = Backbone.View.extend({
        className: 'hex',
        crossroadViews:[],
        initialize: function() {
            var SIZE = 60;
            var COLS = 5;
            var HEX_HEIGHT = Math.sqrt(Math.pow(SIZE, 2) - Math.pow(SIZE / 2, 2)) * 2;
            var HEX_WIDTH = SIZE * 2;
            var FIELD_WIDTH = COLS * SIZE + (COLS + 1) * SIZE / 2; // 120
            var FIELD_HEIGHT = HEX_HEIGHT * COLS; // 104

            // See flat top axis coords formula at: http://www.redblobgames.com/grids/hexagons/#hex-to-pixel
            this.x = SIZE * 3 / 2 * (this.model.get('coords').q);
            this.y = SIZE * Math.sqrt(3) * (this.model.get('coords').r + this.model.get('coords').q / 2);

            // Adjust for field centering.
            this.x = this.x + (FIELD_WIDTH);
            this.y = this.y + (FIELD_HEIGHT);

            // Adjust for hex centering.
            this.x = this.x - (HEX_WIDTH / 2);
            this.y = this.y - (HEX_HEIGHT / 2);

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