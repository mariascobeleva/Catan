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
            robbery: {enter: ["robberyEnter"], leave: ["robberyLeave"]},
            robberChooseVictim: {enter: ["robberChooseVictimEnter"], leave: ["robberChooseVictimLeave"]},
            robAll:{enter: ["robAllEnter"], leave: ["robAllLeave"]},
            robberMove:{enter: ["robberMoveEnter"], leave: ["robberMoveLeave"]},
            trading: {enter: ["tradingEnter"], leave: ["tradingLeave"]},
            building: {enter: ["buildingEnter"], leave: ["buildingLeave"]},
            roadBuilding: {enter: ["roadBuildingEnter"], leave: ["roadBuildingLeave"]},
            settlementBuilding: {enter: ["settlementBuildingEnter"], leave: ["settlementBuildingLeave"]},
            cityBuilding: {enter: ["cityBuildingEnter"], leave: ["cityBuildingLeave"]}
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
                    enterState: "robbery"
                }
            },
            robbery: {
                robRichPlayers: {
                    enterState: "robAll"
                },
                robberMove: {
                    enterState: "robberMove"
                }
            },
            robAll: {
                robNextPlayer: {
                    enterState: "robAll"
                },
                playersRobed: {
                    enterState: "robberMove"
                }
            },
            robberMove:{
                robberMoveOnHexWithFewPl: {
                    enterState: "robberChooseVictim"
                },
                robberMoveAndRob : {
                    enterState: "mainGame"
                }
            },
            robberChooseVictim: {
                playerRobed: {
                    enterState: "mainGame"
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
            building: {
                buildingObj: {
                    enterState: "mainGame"
                },
                buildRoad: {
                    enterState: "roadBuilding"
                },
                buildSettlement: {
                    enterState: "settlementBuilding"
                },
                buildCity: {
                    enterState: "cityBuilding"
                }
            },
            roadBuilding: {
                builtRoad: {
                    enterState: "mainGame"
                }
            },
            settlementBuilding: {
                builtSettlement: {
                    enterState: "mainGame"
                }
            },
            cityBuilding: {
                builtCity: {
                    enterState: "mainGame"
                }
            }
        },
        ftSettlementEnter: function() {
            var that = this;
            var currentPlayer = this.model.getCurrentPlayer();
            var availableCrossroads = this.model.get("map").findAvailableCrossroads(currentPlayer, false);
            this.model.get("map").highlightAvailableCrossroads(availableCrossroads);
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
            this.$('.available.crossroad').off("click");

        },
        ftRoadEnter: function(view) {
            var that = this;
            var currentPlayer = this.model.getCurrentPlayer();
            var availableRoads = that.model.get("map").findAvailableRoadsByCrossroad(currentPlayer, view);
            this.model.get("map").highlightRoads(availableRoads);
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
            this.$('.available.road').off("click");

        },
        stSettlementEnter: function() {
            var that = this;
            var currentPlayer = that.model.getCurrentPlayer();
            var availableCrossroads = this.model.get("map").findAvailableCrossroads(currentPlayer);
            this.model.get("map").highlightAvailableCrossroads(availableCrossroads);
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
            this.$('.available.crossroad').off("click");
        },
        stRoadEnter: function(view) {
            var that = this;
            var currentPlayer = this.model.getCurrentPlayer();
            var availableRoads = that.model.get("map").findAvailableRoadsByCrossroad(currentPlayer, view);
            this.model.get("map").highlightRoads(availableRoads);
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
            this.$('.available.road').off("click");
        },
        rollDiceEnter: function() {
            // Show rolling dice;
            this.model.get("dice").setDiceValue();
            var diceAmount = 7;

//            var diceAmount = this.model.getDiceAmount();
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
            that.$(".choose-for-building").click(function() {
                that.trigger("startBuilding");
            });
        },
        mainGameLeave: function() {
            this.$(".end-turn,.change-with-bank").removeClass("active");
            this.$(".build").removeClass("disabled").hide();
            this.$(".change-with-bank").off("click");
            this.$(".end-turn").off("click");
            this.$(".choose-for-building").off("click");
        },
        robberyEnter: function() {
            var that = this;
            var richPlayers = that.getPlayersWithMoreThanSevenResources();
            if(richPlayers.length>0){
                var i=0;
                that.trigger("robRichPlayers",richPlayers,i);
            }
            else {
                that.trigger("robberMove");
            }
        },
        robberyLeave: function() {
        },
        robberMoveEnter: function(){
            var that = this;
            var currentPlayer = this.model.getCurrentPlayer();
            that.$(".thief").addClass("active").draggable({
                containment: ".field"
            });
            that.$(".thief.active").on("dragstop", function() {
                var $thief = $(this);
                var thiefCoords = that.getThiefCoords($thief);
                var robedHex = that.getHexByCoords(thiefCoords);
                that.changeRobedHex(robedHex);

                var playersRb = that.getPlayersWhichBuiltOnHex(robedHex, currentPlayer);
                var choosenPlayer = playersRb[0];
                if (playersRb.length > 1) {
                    that.trigger("robberMoveOnHexWithFewPl",playersRb);
                }
                else {
                    that.stealResource(choosenPlayer, currentPlayer);
                    that.trigger("robberMoveAndRob");
                }
            });
        },
        robberMoveLeave: function(){
            this.$(".thief.active").off("dragstop");
            this.$(".thief").removeClass("active");
            this.$(".thief").draggable("destroy");
        },
        robberChooseVictimEnter: function(playersRb){
            var that = this;
            var currentPlayer = this.model.getCurrentPlayer();
            var choosenPlayer;
            for (var i = 0; i < playersRb.length; i++) {
                that.$(".choose-player-for-robber span.player" + (i + 1)).text(playersRb[i].get("name"));
            }
            that.$("#overlay, .box").addClass("active");
            that.$(".choose-player-for-robber").show();

            that.$(".choose-player-for-robber span").click(function() {
                var numberOfPlayer = $(this).index();
                choosenPlayer = playersRb[numberOfPlayer];
                that.stealResource(choosenPlayer, currentPlayer);
                that.trigger("playerRobed");
            });
        },
        robberChooseVictimLeave: function(){
            this.$(".choose-player-for-robber span").off("click");
            this.$("#overlay, .box").removeClass("active");
            this.$(".choose-player-for-robber").hide();
        },
        robAllEnter: function(richPlayers,i){
            var that = this;
            that.displayPlayerResourcesForChange(richPlayers[i]);
            var robResAmount = Math.floor(that.getTotalAmountOfPlayerRes(richPlayers[i])/2);

            that.$(".choose-res-for-rob .name").text(richPlayers[i].get("name"));
            that.$(".choose-res-for-rob .amount").text(robResAmount);
            that.$("#overlay, .box").addClass("active");
            that.$(".choose-res-for-rob").show();

            that.$(".ctrl.add").click(function(){
                var $amountForRob = $(this).siblings(".value");
                var $res = $(this).parent(".controls").siblings("span");

                if(parseInt($res.text())!==0) {
                    $res.text(parseInt($res.text()) - 1);
                    $amountForRob.text(parseInt($amountForRob.text()) + 1);
                }
                else {
                    return;
                }
            });

            that.$(".ctrl.decrease").click(function(){
                var $amountForRob = $(this).siblings(".value");
                var $res = $(this).parent(".controls").siblings("span");

                if(parseInt($amountForRob.text())!== 0){
                    $res.text(parseInt($res.text()) + 1);
                    $amountForRob.text(parseInt($amountForRob.text()) - 1);
                }
                else {
                    return;
                }
            });

            that.$(".confirm").click(function(){
                var choosenResAmount = 0;
                var robedRes = {};
                that.$(".controls .value").each(function(){
                    var res = $(this).parent(".controls").siblings("span").attr("name");
                    var amount = parseInt($(this).text());
                    robedRes[res] = - amount;
                    choosenResAmount = choosenResAmount + parseInt($(this).text());
                });
                if(robResAmount === choosenResAmount){
                    richPlayers[i].spendResource(robedRes);
                    this.model.get("bank").spendResource((robedRes));
                    if(richPlayers[i+1]){
                        alert("Передайте устройство игроку " + richPlayers[i+1].get("name"));
                        i++;
                        that.trigger("robNextPlayer",richPlayers,i);
                    }
                    else {
                        that.trigger("playersRobed");
                    }

                }
                else{
                    alert("You gave to rob wrong amount of resources!");
                    robedRes = {};
                }
            });

        },
        robAllLeave: function(){
            this.$(".ctrl.add").off("click");
            this.$(".ctrl.decrease").off("click");
            this.$(".confirm").off("click");
            this.$("#overlay, .box").removeClass("active");
            this.$(".choose-res-for-rob").hide();
        },
        tradingEnter: function() {
            var that = this;
            that.$("#overlay, .box").addClass("active");
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
            that.$(".change-resources .confirm").click(function() {
                that.changeResourceInBank();
            });
        },
        tradingLeave: function() {
            this.$("#overlay, .box").removeClass("active");
            this.$(".change-for-buildings").hide();
            this.$(".player-resources span").off("click");
            this.$(".resources-for-change span").off("click");
            this.$("#close").off("click");
            this.$(".change-resources .confirm").off("click");
        },
        buildingEnter: function() {
            var that = this;
            var currentPlayer = this.model.getCurrentPlayer();
            that.$("#overlay,.box").addClass("active");


            if (this.model.checkPlayerResourcesForSettlement(currentPlayer) && this.model.get("map").findAvailableCrossroads(currentPlayer, true).length !== 0) {
                that.$(".building-objects span.settlement").addClass("active");

            }
            if (this.model.checkPlayerResourcesForCity(currentPlayer)) {
                that.$(".building-objects span.city").addClass("active");
            }
            if (this.model.checkPlayerResourcesForRoad(currentPlayer) && this.model.get("map").findAvailableRoads(currentPlayer).length !== 0) {
                that.$(".building-objects span.road").addClass("active");
            }
            that.$(".building-objects").show();

            that.$(".building-objects span.settlement.active").click(function() {
                var availableCrossroads = that.model.get("map").findAvailableCrossroads(currentPlayer, true);
                that.trigger("buildSettlement", availableCrossroads);
            });

            that.$(".building-objects span.city.active").click(function() {
                that.trigger("buildCity");
            });
            that.$(".building-objects span.road.active").click(function() {
                var availableRoads = that.model.get("map").findAvailableRoads(currentPlayer);
                that.trigger("buildRoad", availableRoads);

            });
            that.$("#close").click(function() {
                that.trigger('buildingObj');
            });

        },
        buildingLeave: function() {
            this.$(".building-objects span.settlement.active").off("click");
            this.$(".building-objects span.road.active").off("click");
            this.$(".building-objects span.city.active").off("click");
            this.$("#close").off("click");
            this.$(".building-objects").hide();
            this.$("#overlay, .box").removeClass("active");
            this.$(".building-objects span").removeClass("active");
        },
        roadBuildingEnter: function(roads) {
            var that = this;
            var currentPlayer = this.model.getCurrentPlayer();
            this.model.get("map").highlightRoads(roads);
            that.$(".build").show().addClass("disabled");
            that.$('.available.road').click(function() {
                that.$(".build").removeClass("disabled");
                var color = currentPlayer.get("color");
                that.$('.blinking.road').removeClass("blinking");
                $(this).addClass('blinking').css({"background": color});
            });
            that.$(".build").click(function() {
                if (!$(this).is(".disabled")) {
                    $(".road.blinking").trigger("buildRoad");
                    that.trigger("builtRoad");
                }
            });
        },
        roadBuildingLeave: function() {
            this.model.get("map").disabledRoadHighlighting();
            this.$(".build").addClass("disabled").hide();
            this.$(".build").off("click");
            this.$('.available.road').off("click");
        },
        settlementBuildingEnter: function(crossroads) {
            var that = this;
            var currentPlayer = that.model.getCurrentPlayer();
            that.model.get("map").highlightAvailableCrossroads(crossroads);
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
                    view.buildSettlement(currentPlayer);
                    that.trigger("builtSettlement");
                }
            });
        },
        settlementBuildingLeave: function() {
            this.model.get("map").disabledCrossroadHighlighting();
            this.$(".build").addClass("disabled").hide();
            this.$(".build").off("click");
            this.$('.available.crossroad').off("click");
        },
        cityBuildingEnter: function() {
            var that = this;
            var currentPlayer = that.model.getCurrentPlayer();
            var availableCities = that.model.get("map").findAvailableCrossroadsForCity(currentPlayer);
            that.model.get("map").highlightSettlementsForCityBuilding(availableCities);
            that.$(".build").show().addClass("disabled");
            that.$(".crossroad.available-for-city").click(function() {
                var color = currentPlayer.get("color");
                that.$(".build").removeClass("disabled");
                that.$(".crossroad.available-for-city").removeClass("blinking").css("background", color);
                $(this).addClass('blinking');
            });
            that.$(".build").click(function() {
                if (!$(this).is(".disabled")) {
                    var view = that.$(".crossroad.blinking").data('view');
                    view.buildSettlement(currentPlayer);
                    that.trigger("builtCity");
                }
            });
        },
        cityBuildingLeave: function() {
            this.$(".crossroad.available-for-city").removeClass("available-for-city");
            this.model.get("map").disabledCrossroadForCityHighlighting();
            this.$(".build").addClass("disabled").hide();
            this.$(".build").off("click");
            this.$(".crossroad.available-for-city").off("click");
            this.$(".build").off("click");
        },
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
                    this.$(".player-resources .res-" + k.substring(4)).text(value);
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
        },
        getTotalAmountOfPlayerRes: function(player){
            var resourcesAmount = 0;
            for(var i=0; i<Const.resourcesTypes.length;i++){
                resourcesAmount = resourcesAmount + player.getResources(Const.resourcesTypes[i]);
            }
            return resourcesAmount;

            },
        getPlayersWithMoreThanSevenResources: function() {
            var richPlayers =[];
            var players = this.model.get("players");
            for(var i=0;i<players.length;i++){
                var player = this.model.get("players")[i];
                if (this.getTotalAmountOfPlayerRes(player) > 7) {
                    richPlayers.push(player);
                }
            }
            return richPlayers;
        },
        getThiefCoords: function($thief) {
            var top = $thief.offset().top - $thief.parents('.field').offset().top;
            var left = $thief.offset().left - $thief.parents('.field').offset().left;
            var size = 60;
            var cols = 5;
            var THIEF_HEIGHT = 30;
            var HEX_HEIGHT = Math.sqrt(Math.pow(size, 2) - Math.pow(size / 2, 2)) * 2;
            var FIELD_WIDTH = cols * size + (cols + 1) * size / 2; // 120
            var FIELD_HEIGHT = HEX_HEIGHT * cols; // 104
            left = left - FIELD_WIDTH;
            top = top - FIELD_HEIGHT;
            left = left + (THIEF_HEIGHT / 2);
            top = top + (THIEF_HEIGHT / 2);
            var q = 2 / 3 * left / size;
            var r = (-1 / 3 * left + 1 / 3 * Math.sqrt(3) * top) / size;
            q = Math.round(q);
            r = Math.round(r);
            var thiefCoords = {"q": q, "r": r};
            return thiefCoords;
        },
        getHexByCoords: function(coords) {
            for (var i = 0; i < this.model.get("map").get("hexes").length; i++) {
                var hex = this.model.get("map").get("hexes")[i];
                if (hex.get("coords").q === coords.q && hex.get("coords").r === coords.r) {
                    return hex;
                }
            }
        },
        changeRobedHex: function(hex) {
            if (this.model.get("robedHex")) {
                this.model.get("robedHex").set("thief", false);
            }
            hex.set("thief", true);
            this.model.set("robedHex", hex);
        },
        getPlayersWhichBuiltOnHex: function(hex, currentPlayer) {
            var playersRb = [];
            var playerNotInArray = true;
            for (var i = 0; i < hex.get("crossroads").length; i++) {
                var crossroad = hex.get("crossroads")[i];
                if (crossroad.get("player")) {
                    for (var j = 0; j < playersRb.length; j++) {
                        if (crossroad.get("player") === playersRb[j]) {
                            playerNotInArray = false;
                        }
                    }
                    if (playerNotInArray && crossroad.get("player") !== currentPlayer ) {
                        playersRb.push(crossroad.get("player"));
                    }
                }
            }
            return playersRb;
        },
        stealResource: function(robedPlayer, currentPlayer) {
            var stolenResources = {};
            var resourcesForRobber = {};
            var stolenResource = Const.resourcesTypes[Math.floor(Math.random() * Const.resourcesTypes.length)];
            if (robedPlayer.getResources(stolenResource) > 0) {
                stolenResources[stolenResource] = -1;
                resourcesForRobber[stolenResource] = 1;
                robedPlayer.spendResource(stolenResources);
                currentPlayer.spendResource(resourcesForRobber);
            }
            else {
                this.stealResource(robedPlayer, currentPlayer);
            }
        }
    });
    return GameView;
});



