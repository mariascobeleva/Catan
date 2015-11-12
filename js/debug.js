define([
    'jquery',
    'underscore'
], function($, _) {
    var Debug = {
        id: "debug",
        tagName: "textarea",
        init: function(){
            if (!this.initialized) {
                this.$el = $('<' + this.tagName+ ' id="' + this.id + '"></' + this.tagName+ '>');
                this.el = this.$el[0];
                $('body').append(this.el);
                this.initialized = true;
            }
        },
        log: function(value) {
            this.$el.val(this.$el.val() + "\n" + value);
        },
        doFirstTurns: function() {
            //$('.confirm-btn').click();
            //$(".crossroads .crossroad:nth-child(48)").click();
            //$('.confirm').click();
            //$(".roads .road:nth-child(73)").click();
            //$('.confirm').click();
            //$(".crossroads .crossroad:nth-child(4)").click();
            //$('.confirm').click();
            //$(".roads .road:nth-child(75)").click();
            //$('.confirm').click();
            //$(".crossroads .crossroad:nth-child(9)").click();
            //$('.confirm').click();
            //$(".roads .road:nth-child(80)").click();
            //$('.confirm').click();
            //$(".crossroads .crossroad:nth-child(51)").click();
            //$('.confirm').click();
            //$(".roads .road:nth-child(111)").click();
            //$('.confirm').click();
            //$(".crossroads .crossroad:nth-child(54)").click();
            //$('.confirm').click();
            //$(".roads .road:nth-child(109)").click();
            //$('.confirm').click();
            //$(".crossroads .crossroad:nth-child(40)").click();
            //$('.confirm').click();
            //$(".roads .road:nth-child(103)").click();
            //$('.confirm').click();
            return true;
        }
    };
    Debug.init();
    return Debug;
});
