define([
    'jquery',
    'underscore',
    'backbone',
    "debug",
    "models/const",
    'text!templates/game.html',
    'views/player',
    "views/map",
    "views/dice",
    'backbone_sm'
], function($, _, Backbone, Debug, Const, GameTemplate, PlayerView, MapView, DiceView) {
    var GameView = Backbone.StatefulView.extend({
        states: {
            init: {},
            ftSettlement: {enter: ['ftSettlementEnter'], leave: ['ftSettlementLeave']},
            ftRoad: {enter: ['ftRoadEnter'], leave: ['ftRoadLeave']},
            stSettlement: {enter: ["stSettlementEnter"], leave: ["stSettlementLeave"]},
            stRoad: {enter: ["stRoadEnter"], leave: ["stRoadLeave"]},
            rollDice: {enter: ["rollDiceEnter"], leave: ["rollDiceLeave"]},
            mainGame: {enter: ["mainGameEnter"], leave: ["mainGameLeave"]},
//            doRob:{enter:["doRobEnter"], leave:["doRobLeave"]}
            trading: {enter: ["tradingEnter"], leave: ["tradingLeave"]},
            building:{enter: ["buildingEnter"], leave: ["buildingLeave"]},
            roadBuilding:{enter: ["roadBuildingEnter"], leave: ["roadBuildingLeave"]},
            settlementBuilding:{enter: ["settlementBuildingEnter"], leave: ["settlementBuildingLeave"]},
            cityBuilding:{enter: ["cityBuildingEnter"], leave: ["cityBuildingLeave"]}

        },
        transitions: {
            init: {
                initialized: 'ftSettlement'
            },
            ftSettlement: {
                ftBuiltSettlement: {
                    enterState: 'ftRoad'
                }
            },
            ftRoad: {
                ftBuiltRoadNextPlayer: {
                    enterState: 'ftSettlement'
                },
                ftBuiltRoadAndSecondTurn: {
                    enterState: "stSettlement"
                }
            },
            stSettlement: {
                stBuiltSettlement: {
                    enterState: "ftRoad"
                },
                stBuiltSettlementNextPlayer: {
                    enterState: "stRoad"
                }
            },
            stRoad: {
                stBuiltRoadNextPlayer: {
                    enterState: "stSettlement"
                },
                startGame: {
                    enterState: "rollDice"
                }
            },
            rollDice: {
                rollDiceAndStartGame: {
                    enterState: "mainGame"
                },
                rollDiceAndDoRobbery: {
                    enterState: "doRob"
                }
            },
            mainGame: {
                startTurn: {
                    enterState: "rollDice"
                },
                startTrading: {
                    enterState: "trading"
                },
                startBuilding: {
                    enterState: "building"
                }
            },
            trading: {
                tradeWithBank: {
                    enterState: "mainGame"
                }
            },
            building : {
                buildingObj : {
                    enterState: "mainGame"
                },
                buildRoad : {
                    enterState: "roadBuilding"
                },
                buildSettlement: {
                    enterState: "settlementBuilding"
                },
                buildCity: {
                    enterState: "cityBuilding"
                }
            },
            roadBuilding:{
                builtRoad:{
                    enterState: "mainGame"
                }
            },
            settlementBuilding:{
                builtSettlement:{
                    enterState: "mainGame"
                }
            },
            cityBuilding:{
                builtCity:{
                    enterState: "mainGame"
                }
            }
        },
        ftSettlementEnter: function() {
            var that = this;
            var currentPlayer = this.model.getCurrentPlayer();
            this.model.get("map").findAvailableCrossroads(currentPlayer, false, true);
            this.$(".build").show().addClass("disabled");
            this.$('.available.crossroad').click(function() {
                Debug.log('$(".crossroads .crossroad:nth-child(' + ($(this).index() + 1) + ')").click();');
                var color = currentPlayer.get("color");
                that.$(".build").removeClass("disabled");
                that.$(".crossroad.blinking").removeClass("blinking").css("background", "rgba(255,255,255,0.5)");
                $(this).addClass('blinking').css({"background": color});
            });
            this.$(".build").click(function() {
                if (!$(this).is(".disabled")) {
                    Debug.log("$('.build').click();");
                    var view = that.$(".crossroad.blinking").data('view');
                    view.setSettlement(view.model.q(), view.model.r(), currentPlayer);
                    that.trigger("ftBuiltSettlement", view);
                }
            });
        },
        ftSettlementLeave: function() {
            this.model.get("map").disabledCrossroadHighlighting();
            this.$(".build").addClass("disabled").hide();
            this.$(".build").off("click");
        },
        ftRoadEnter: function(view) {
            var that = this;
            var currentPlayer = this.model.getCurrentPlayer();
            that.model.get("map").findAvailableRoads(currentPlayer,true,view);
            that.$(".build").show().addClass("disabled");
            that.$('.available.road').click(function() {
                Debug.log('$(".roads .road:nth-child(' + ($(this).index() + 1) + ')").click();');
                that.$(".build").removeClass("disabled");
                var color = currentPlayer.get("color");
                that.$('.blinking.road').removeClass("blinking");
                $(this).addClass('blinking').css({"background": color});
            });
            that.$(".build").click(function() {
                if (!$(this).is(".disabled")) {
                    Debug.log("$('.build').click();");
                    $(".road.blinking").trigger("setRoad");
                    if (that.model.get("currentPlayer") !== 0) {
                        that.model.prevPlayer();
                        that.trigger("ftBuiltRoadNextPlayer");
                    }
                    else {
                        that.trigger("ftBuiltRoadAndSecondTurn");
                    }
                }
            });
        },
        ftRoadLeave: function() {
            this.model.get("map").disabledRoadHighlighting();
            this.$(".build").addClass("disabled").hide();
            this.$(".build").off("click");
        },
        stSettlementEnter: function() {
            var that = this;
            var currentPlayer = that.model.getCurrentPlayer();
            that.model.get("map").findAvailableCrossroads(currentPlayer, false, true);
            that.$(".build").show().addClass("disabled");
            that.$('.available.crossroad').click(function() {
                Debug.log('$(".crossroads .crossroad:nth-child(' + ($(this).index() + 1) + ')").click();');
                var color = currentPlayer.get("color");
                that.$(".build").removeClass("disabled");
                that.$(".crossroad.blinking").removeClass("blinking");
                $(this).addClass('blinking').css({"background": color});
            });
            this.$(".build").click(function() {
                if (!$(this).is(".disabled")) {
                    Debug.log("$('.build').click();");
                    var view = that.$(".crossroad.blinking").data('view');
                    view.setSettlement(view.model.q(), view.model.r(), currentPlayer);
                    that.model.grabResources(view.model);
                    that.trigger("stBuiltSettlementNextPlayer", view);
                }
            });
        },
        stSettlementLeave: function() {
            this.model.get("map").disabledCrossroadHighlighting();
            this.$(".build").addClass("disabled").hide();
            this.$(".build").off("click");
        },
        stRoadEnter: function(view) {
            var that = this;
            var currentPlayer = this.model.getCurrentPlayer();
            that.model.get("map").findAvailableRoads(currentPlayer,true, view);
            that.$(".build").show().addClass("disabled");
            that.$('.available.road').click(function() {
                Debug.log('$(".roads .road:nth-child(' + ($(this).index() + 1) + ')").click();');
                that.$(".build").removeClass("disabled");
                var color = currentPlayer.get("color");
                that.$('.blinking.road').removeClass("blinking");
                $(this).addClass('blinking').css({"background": color});
            });
            that.$(".build").click(function() {
                if (!$(this).is(".disabled")) {
                    Debug.log("$('.build').click();");
                    $(".road.blinking").trigger("setRoad");
                    if (that.model.get("currentPlayer") !== 2) {
                        that.model.nextPlayer();
                        that.trigger("stBuiltRoadNextPlayer");
                    }
                    else {
                        that.model.nextPlayer();
                        that.trigger("startGame");
                    }
                }
            });
        },
        stRoadLeave: function() {
            this.model.get("map").disabledRoadHighlighting();
            this.$(".build").addClass("disabled").hide();
            this.$(".build").off("click");
        },
        rollDiceEnter: function() {
            alert("Finally the game was started!!!");
            // Show rolling dice;
            this.model.get("dice").setDiceValue();
            var diceAmount = this.model.getDiceAmount();
            if (diceAmount === 7) {
                this.trigger("rollDiceAndDoRobbery");
            }
            else {
                this.model.grabResourcesGlobal(diceAmount);
                this.trigger("rollDiceAndStartGame");
            }
        },
        rollDiceLeave: function() {
            // Hide dices.
        },
        mainGameEnter: function() {
            var that = this;
            alert("main game was started");
            that.$(".end-turn,.change-with-bank").addClass("active");
            that.$(".choose-for-building").show().addClass("active");

            that.$(".change-with-bank").click(function() {
                if ($(this).is(".active")) {
                    that.trigger("startTrading");
                }
            });

            that.$(".end-turn").click(function() {
                if ($(this).is(".active")) {
                    that.model.nextPlayer();
                    that.trigger("startTurn");
                }
            });
            that.$(".choose-for-building").click(function(){
                 that.trigger("startBuilding");
            });
        },
        mainGameLeave: function() {
            this.$(".end-turn,.change-with-bank").removeClass("active");
            this.$(".build").removeClass("disabled").hide();
        },
        tradingEnter: function() {
            var that = this;
            that.$("#overlay, .box,").addClass("active");
            that.$(".change-for-buildings").show();

            var currentPlayer = this.model.getCurrentPlayer();
            that.displayPlayerResourcesForChange(currentPlayer);
            that.displayExchangeRate(currentPlayer);

            that.$(".player-resources span").click(function() {
                $(".player-resources span").removeClass("active");
                $(this).addClass("active");
            });
            that.$(".resources-for-change span").click(function() {
                $(".resources-for-change span").removeClass("active");
                $(this).addClass("active");
            });

            that.$("#close").click(function() {
                that.trigger('tradeWithBank');
            });
            that.$(".change-resources #confirm").click(function(){
                that.changeResourceInBank();
            });
        },
        tradingLeave: function() {
            this.$("#overlay, .box").removeClass("active");
            this.$(".change-for-buildings").hide();
        },
        buildingEnter: function(){
            var that = this;
            var currentPlayer  = this.model.getCurrentPlayer();
            that.$("#overlay,.box").addClass("active");


            if(this.model.checkPlayerResourcesForSettlement() && this.model.get("map").findAvailableCrossroads(currentPlayer, true, false)){
                that.$(".building-objects span.settlement").addClass("active");
            }
            if(this.model.checkPlayerResourcesForCity()){
                that.$(".building-objects span.city").addClass("active");
            }
            if(this.model.checkPlayerResourcesForRoad() && this.model.get("map").findAvailableRoads(currentPlayer,false)){
                that.$(".building-objects span.road").addClass("active");
            }
            that.$(".building-objects").show();

            that.$(".building-objects span.settlement.active").click(function(){
                that.trigger("buildSettlement");
            });

            that.$(".building-objects span.city.active").click(function(){
                that.trigger("buildCity");
            });
            that.$(".building-objects span.road.active").click(function(){
                that.trigger("buildRoad");
            });
            that.$("#close").click(function() {
                that.trigger('buildingObj');
            });

        },
        buildingLeave: function(){
            this.$(".building-objects").hide();
            this.$("#overlay, .box").removeClass("active");
        },
        roadBuildingEnter: function(){
            var that = this;
            var currentPlayer = this.model.getCurrentPlayer();
            that.model.get("map").findAvailableRoads(currentPlayer,true);
            that.$(".build").show().addClass("disabled");
            that.$('.available.road').click(function() {
                that.$(".build").removeClass("disabled");
                var color = currentPlayer.get("color");
                that.$('.blinking.road').removeClass("blinking");
                $(this).addClass('blinking').css({"background": color});
            });
            that.$(".build").click(function() {
                if (!$(this).is(".disabled")) {
                    $(".road.blinking").trigger("setRoad");
                        that.trigger("buildRoad");
                    }
            });
        },
        roadBuildingLeave: function(){
            this.model.get("map").disabledRoadHighlighting();
            this.$(".build").addClass("disabled").hide();
            this.$(".build").off("click");
        },
        settlementBuildingEnter: function(){
            var that = this;
            var currentPlayer = that.model.getCurrentPlayer();
            that.model.get("map").findAvailableCrossroads(currentPlayer, true, true);
            that.$(".build").show().addClass("disabled");
            that.$('.available.crossroad').click(function() {
                var color = currentPlayer.get("color");
                that.$(".build").removeClass("disabled");
                that.$(".crossroad.blinking").removeClass("blinking");
                $(this).addClass('blinking').css({"background": color});
            });
            this.$(".build").click(function() {
                if (!$(this).is(".disabled")) {
                    var view = that.$(".crossroad.blinking").data('view');
                    view.setSettlement(view.model.q(), view.model.r(), currentPlayer);
                    that.trigger("builtSettlement");
                }
            });
        },
        settlementBuildingLeave: function(){
            this.model.get("map").disabledCrossroadHighlighting();
            this.$(".build").addClass("disabled").hide();
            this.$(".build").off("click");
        },
        cityBuildingEnter: function(){},
        cityBuildingLeave: function(){},




        startGame: function() {
            Debug.log("$('.start-game').click();");
            this.renderCurrentPlayer();
            this.trigger('initialized');
        },


        className: "game",
        playerViews: [],
        events: {
            "click .start-game": "startGame"
        },
        initialize: function() {
            this.addListeners();
        },
        render: function() {
            var htmlTemplate = _.template(GameTemplate);
            var $game = $(htmlTemplate({}));
            this.$el.append($game);
            this.renderPlayers();
            this.renderMap();
            this.renderDice();
            return this;
        },
        addListeners: function() {
            this.model.on("change:currentPlayer", this.renderCurrentPlayer, this);
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
        },
        renderDice: function() {
            var diceView = new DiceView({model: this.model.get("dice")});
            this.$el.append(diceView.render().el);
        },
        renderCurrentPlayer: function() {
            this.$(".players div .player").removeClass("active");
            this.$(".players div:nth-child(" + (this.model.get("currentPlayer") + 1) + ") .player").addClass("active");
        },
        displayPlayerResourcesForChange: function(player) {
            var k, value, prefix;
            for (k in player.attributes) {
                value = player.attributes[k];
                prefix = k.substring(0, 3);
                if (prefix === "res") {
                    this.$(".player-resources ." + k.substring(4)).text(value);
                }
            }
        },
        displayExchangeRate: function(player) {
            var j;
            for (j in player.attributes.exchangeRate) {
                this.$(".resources-for-change ." + j).text("1 : " + player.attributes.exchangeRate[j]);
            }
        },
        changeResourceInBank: function() {
            var playerResource, resourceToBuy, currentPlayer, rate;
            playerResource = this.$(".player-resources span.active").attr("name");
            resourceToBuy = this.$(".resources-for-change span.active").attr("name");
            currentPlayer = this.model.getCurrentPlayer();
            rate = currentPlayer.get("exchangeRate")[playerResource];

            if (currentPlayer.getResources(playerResource) >= rate) {
                var changedResources = {};
                changedResources[playerResource] = -rate;
                changedResources[resourceToBuy] = 1;
                currentPlayer.spendResource(changedResources);
                this.model.get("bank").spendResource(changedResources);
                this.displayPlayerResourcesForChange(currentPlayer);
            }
        }
    });
        return GameView;
});



