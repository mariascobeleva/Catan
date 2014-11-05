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
            $(".crossroads .crossroad:nth-child(1)").click();
            $('.build-settlement').click();
            $(".roads .road:nth-child(2)").click();
            $('.build-settlement').click();
            $('.end-of-turn-for-start-turn').click();
            $(".crossroads .crossroad:nth-child(47)").click();
            $('.build-settlement').click();
            $(".roads .road:nth-child(58)").click();
            $('.build-settlement').click();
            $('.end-of-turn-for-start-turn').click();
            $(".crossroads .crossroad:nth-child(7)").click();
            $('.build-settlement').click();
            $(".roads .road:nth-child(7)").click();
            $('.build-settlement').click();
            $(".crossroads .crossroad:nth-child(5)").click();
            $('.build-settlement').click();
            $(".roads .road:nth-child(5)").click();
            $('.build-settlement').click();
            $('.end-turn').click();
            $(".crossroads .crossroad:nth-child(43)").click();
            $('.build-settlement').click();
            $(".roads .road:nth-child(53)").click();
            $('.build-settlement').click();
            $('.end-turn').click();
            $(".crossroads .crossroad:nth-child(45)").click();
            $('.build-settlement').click();
            $(".roads .road:nth-child(60)").click();
            $('.build-settlement').click();
            $('.end-turn').click();

            return true;
        }


    };
    Debug.init();
    return Debug;
});
