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
            $(".crossroads .crossroad:nth-child(48)").click();
            $('.build').click();
            $(".roads .road:nth-child(73)").click();
            $('.build').click();
            $(".crossroads .crossroad:nth-child(4)").click();
            $('.build').click();
            $(".roads .road:nth-child(75)").click();
            $('.build').click();
            $(".crossroads .crossroad:nth-child(9)").click();
            $('.build').click();
            $(".roads .road:nth-child(80)").click();
            $('.build').click();
            $(".crossroads .crossroad:nth-child(51)").click();
            $('.build').click();
            $(".roads .road:nth-child(111)").click();
            $('.build').click();
            $(".crossroads .crossroad:nth-child(54)").click();
            $('.build').click();
            $(".roads .road:nth-child(109)").click();
            $('.build').click();
            $(".crossroads .crossroad:nth-child(40)").click();
            $('.build').click();
            $(".roads .road:nth-child(103)").click();
            $('.build').click();
            return true;
        }


    };
    Debug.init();
    return Debug;
});
