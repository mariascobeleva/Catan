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
            this.$el.css({'left': this.x, 'top': this.y});
            this.$el.addClass(this.model.get("type"));

            var value = this.model.get("value");
            if(value !== 0){
                this.$el.append('<div class="number">' + value + '</div>');
                if(value === 6 || value === 8){
                    this.$el.children('.number').addClass('popular');
                }
            }
            else {
                var harbor = "";
                var counter = 0;
                for (var i=0; i < this.model.get('crossroads').length ;i++) {

                    var ht1 = this.model.get('crossroads')[i].get('harborType');
                    var nextIndex = i === 5 ? 0 : (i + 1);
                    var ht2 = this.model.get('crossroads')[nextIndex].get('harborType');
                    if (ht1 && ht1 === ht2) {
                        this.$el.addClass("harbor-" + ht1);
                        break;
                    }

                    //var harborType = this.model.get('crossroads')[i].get('harborType');
                    //if(harbor === "" && harborType!== "") {
                    //    harbor = harborType;
                    //    counter = i;
                    //}
                    //else if (harbor !== "" && harborType!== "" && (i === (counter + 1) || ( i === 0 && counter === this.model.get('crossroads').length - 1) || (i === this.model.get('crossroads').length - 1)  && counter === 0)){
                    //    if(harbor === harborType){
                    //        this.$el.addClass("harbor-" + harborType);
                    //        break;
                    //    }
                    //}
                }
            }
            return this;
        }
    });
    return HexView;
});