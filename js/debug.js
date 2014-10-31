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
            $(".crossroads .crossroad:nth-child(41)").click();
            $('.build-settlement').click();
            $(".roads .road:nth-child(70)").click();
            $('.build-settlement').click();
            $(".crossroads .crossroad:nth-child(48)").click();
            $('.build-settlement').click();
            $(".roads .road:nth-child(63)").click();
            $('.build-settlement').click();
            $(".crossroads .crossroad:nth-child(4)").click();
            $('.build-settlement').click();
            $(".roads .road:nth-child(11)").click();
            $('.build-settlement').click();
            $(".crossroads .crossroad:nth-child(46)").click();
            $('.build-settlement').click();
            $(".roads .road:nth-child(52)").click();
            $('.build-settlement').click();
            $('.end-turn').click();
            $(".crossroads .crossroad:nth-child(47)").click();
            $('.build-settlement').click();
            $(".roads .road:nth-child(58)").click();
            $('.build-settlement').click();
            $('.end-turn').click();
            $(".crossroads .crossroad:nth-child(11)").click();
            $('.build-settlement').click();
            $(".roads .road:nth-child(12)").click();
            $('.build-settlement').click();
            $('.end-turn').click();
        }


    };
    Debug.init();
    return Debug;
});
