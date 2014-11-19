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
            $('.start-game').click();
            $(".crossroads .crossroad:nth-child(5)").click();
            $('.build').click();
            $(".roads .road:nth-child(6)").click();
            $('.build').click();
            $(".crossroads .crossroad:nth-child(45)").click();
            $('.build').click();
            $(".roads .road:nth-child(60)").click();
            $('.build').click();
            $(".crossroads .crossroad:nth-child(10)").click();
            $('.build').click();
            $(".roads .road:nth-child(10)").click();
            $('.build').click();
            $(".crossroads .crossroad:nth-child(14)").click();
            $('.build').click();
            $(".roads .road:nth-child(16)").click();
            $('.build').click();
            $(".crossroads .crossroad:nth-child(12)").click();
            $('.build').click();
            $(".roads .road:nth-child(14)").click();
            $('.build').click();
            $(".crossroads .crossroad:nth-child(15)").click();
            $('.build').click();
            $(".roads .road:nth-child(19)").click();
            $('.build').click();
            return true;
        }


    };
    Debug.init();
    return Debug;
});
