define([
    'jquery',
    'underscore',
    'backbone',
    "debug",
    "models/const",
    'views/player',
    "views/map",
    "views/dice",
], function($, _, Backbone, Debug, Const, PlayerView, MapView, DiceView) {
    var GameView = Backbone.View.extend({
        className: "game",
        playerViews: [],
        events: {
            "click .start-game": "startGame",
            "click .end-turn": "endOfTurn",
            'click .build-settlement': "build"
        },
        initialize: function(){
            this.addListeners();
        },
        render: function() {
            this.renderPlayers();
            this.renderMap();
            this.renderDice();
            return this;
        },
        addListeners: function(){

            for(var i=0; i< this.model.get("players").length; i++){
                   this.model.get("players")[i].on("change:startTurn",this.endOfTurnForStartTurn, this);
            }
            for(var j=0; j< this.model.get("players").length; j++){
                this.model.get("players")[j].on("change:secondTurn",this.endOfTurn, this);
            }

            this.model.on("change:counter", this.stopListeningStartTurn,this);
        },
        stopListeningStartTurn: function(){
           if(this.model.get("counter") === this.model.get("players").length){
               for(var i=0; i< this.model.get("players").length; i++){
                   this.model.get("players")[i].off("change:startTurn");
               }
               this.model.set("counter",0);
           }
        },
        renderPlayers: function() {
            var players = this.model.get('players');
            var $players = $('<div class="players"></div>');
            for (var i = 0; i < players.length; i++) {
                var p = new PlayerView({model: players[i]});
                $players.append(p.render().el);
                this.playerViews.push(p);
            }
            this.$el.append($players);
        },
        renderMap: function() {
            var mapView = new MapView({model: this.model.get("map")});
            this.$el.append(mapView.render().el);
            this.$el.append("<div class='start-game'></div>");
            this.$el.append("<div class='end-turn'></div>");
            this.$el.append("<div class='build-settlement'></div>");
        },
        renderDice: function() {
            var diceView = new DiceView({model: this.model.get("diceAmount")});
            this.$el.append(diceView.render().el);
        },
        startGame: function(){
            Debug.log("$('.start-game').click();");
            this.assignCurrentPlayer();
        },
        assignCurrentPlayer: function(){
            var currentPlayer;
            if (this.model.get("currentPlayer") + 1 === this.model.get("players").length){
                this.model.set("currentPlayer",0);
            }
            else {
                this.model.set("currentPlayer",(this.model.get("currentPlayer") + 1));
            }
        },
        assignCurrentPlayerForStartTurn: function(){
            var currentPlayer;
            if(this.model.get("currentPlayer") === false){
                currentPlayer = this.model.get("players")[Math.floor(Math.random() * this.model.get("players").length)];
                this.model.set("currentPlayer",(this.model.get("players").indexOf(currentPlayer)));
            }
            else if (this.model.get("currentPlayer") - 1 < 0){
                this.model.set("currentPlayer",2);
            }
            else {
                this.model.set("currentPlayer",(this.model.get("currentPlayer") - 1));
            }
        },
        endOfTurnForStartTurn: function(){
            this.model.set("crossroadClicked", false);
            this.model.set("roadClicked", false);
            this.assignCurrentPlayerForStartTurn();
        },
        renderCurrentPlayer: function(){
            this.$(".players div .player").removeClass("active");
            this.$(".players div:nth-child(" + (this.model.get("currentPlayer")+1) + ") .player").addClass("active");
        },
        endOfTurn: function() {
            Debug.log("$('.end-turn').click();");
            this.model.set("crossroadClicked", false);
            this.model.set("roadClicked", false);
            this.assignCurrentPlayer();
        },
        build: function() {
            Debug.log("$('.build-settlement').click();");

            if (this.$('.crossroad.blinking').length) {
                this.$('.crossroad.blinking').trigger('buildSettlement');
                this.model.set("crossroadClicked", false);
                if(this.model.get("players")[this.model.get("currentPlayer")].get("startTurn") === false &&
                    this.model.get("players")[this.model.get("currentPlayer")].get("secondTurn") === true){
                    this.gatherResourcesFirstTime();
                }
            }
            else if(this.$('.road.blinking').length){
                this.$('.road.blinking').trigger('buildRoad');
                this.model.set("roadClicked", false);
            }
            else {
                alert('Something wrong (e.g. is not your turn.)');
            }
        },
        gatherResourcesFirstTime: function(){
            var currentPlayer = this.model.get("players")[this.model.get("currentPlayer")];
            var settlement = currentPlayer.get("settlements")[currentPlayer.get("settlements").length - 1];

            for( var k=0; k < settlement.get("hexes").length; k++){
                var hex = settlement.get("hexes")[k];
                this.gatherResources(settlement,currentPlayer,hex);
             }
        },
        checkResources: function(){
            var diceAmount = this.model.get("diceAmount").value_1 + this.model.get("diceAmount").value_2;
            var currentPlayer = this.model.get("players")[this.model.get("currentPlayer")];
            for(var i=0;i<this.model.get("players").length; i++){
                var player = this.model.get("players")[i];
                for(var j=0; j < player.get("settlements").length; j++){
                    var settlement = player.get("settlements")[j];
                    for( var k=0; k < settlement.get("hexes").length; k++){
                        var hex = settlement.get("hexes")[k];
                        if  (hex.get("value") === diceAmount){
                            this.gatherResources(settlement,currentPlayer,hex);
                        }
                    }
                }
            }
        },
        gatherResources: function(settlement,currentPlayer,hex){
            var resource = hex.get("type");
            var value = settlement.get("type");
            currentPlayer.increaseResources(resource,value);
            this.model.get("bank").get("resources")[resource] -= settlement.get("type");
//            this.$(".players div:nth-child(" + (this.model.get("currentPlayer") + 1) + ") .player ." + resource).text(currentPlayer.get("resources")[resource]);
        }
    });

    return GameView;
});