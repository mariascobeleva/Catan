define([], function() {
    var Const = {
        HEX_COUNT: 19,
        HEX_SEA_COUNT: 18,
        HEX_EDGE_SIZE:85,
        HEX_EDGE_COLS:5,
        CROSSROAD_COUNT: 53,
        CROSSROAD_HEIGHT:60,
        ROAD_HEIGHT:7,
        VICTORY_POINTS_FOR_WIN:5,
        HEX_TYPE_WHEAT: "wheat",
        HEX_TYPE_SHEEP: "sheep",
        HEX_TYPE_WOOD: "tree",
        HEX_TYPE_ROCK: "rock",
        HEX_TYPE_BRICK: "brick",
        HEX_TYPE_DESERT: "desert",
        HEX_TYPE_SEA: "sea",
        resourcesTypes:["wheat","sheep","tree","rock","brick"],
        VALUES_OF_DICE: [1, 2, 3, 4, 5, 6],
        HARBOR_TYPES: ["tree", "wheat", "rock", "brick", "sheep", "general-harbor", "general-harbor", "general-harbor", "general-harbor"],
        neighborCoords: [
            {q: -1, r: 0},
            {q: 0, r: -1},
            {q: 1, r: -1},
            {q: 1, r: 0},
            {q: 0, r: 1},
            {q: -1, r: 1}
        ],
        crossroadsCoords: [
            {q: -1 / 3, r: -1 / 3},
            {q: 1 / 3, r: -2 / 3},
            {q: 2 / 3, r: -1 / 3},
            {q: 1 / 3, r: 1 / 3},
            {q: -1 / 3, r: 2 / 3},
            {q: -2 / 3, r: 1 / 3}

        ],
        staticCoords: [
            {q: 0, r: -2},
            {q: 1, r: -2},
            {q: 2, r: -2},
            {q: 2, r: -1},
            {q: 2, r: 0},
            {q: 1, r: 1},
            {q: 0, r: 2},
            {q: -1, r: 2},
            {q: -2, r: 2},
            {q: -2, r: 1},
            {q: -2, r: 0},
            {q: -1, r: -1},
            {q: 0, r: -1},
            {q: 1, r: -1},
            {q: 1, r: 0},
            {q: 0, r: 1},
            {q: -1, r: 1},
            {q: -1, r: 0},
            {q: 0, r: 0}
        ],
        coordsForSeaHexes: [
            {q: 0, r: -3},
            {q: 1, r: -3},
            {q: 2, r: -3},
            {q: 3, r: -3},
            {q: 3, r: -2},
            {q: 3, r: -1},
            {q: 3, r: 0},
            {q: 2, r: 1},
            {q: 1, r: 2},
            {q: 0, r: 3},
            {q: -1, r: 3},
            {q: -2, r: 3},
            {q: -3, r: 3},
            {q: -3, r: 2},
            {q: -3, r: 1},
            {q: -3, r: 0},
            {q: -2, r: -1},
            {q: -1, r: -2}
        ],
        coordsOfHarbor: [
            {q: 0, r: -2, indexOfCrossroad: 0},
            {q: 1, r: -2, indexOfCrossroad: 1},
            {q: 2, r: -1, indexOfCrossroad: 1},
            {q: 2, r: 0, indexOfCrossroad: 2},
            {q: 0, r: 2, indexOfCrossroad: 2},
            {q: -1, r: 2, indexOfCrossroad: 3},
            {q: -2, r: 2, indexOfCrossroad: 4},
            {q: -2, r: 1, indexOfCrossroad: 5},
            {q: -1, r: -1, indexOfCrossroad: 5}
        ]
    };
    Const.HEX_WIDTH = Const.HEX_EDGE_SIZE * 2;
    Const.HEX_HEIGHT = Math.sqrt(Math.pow(Const.HEX_EDGE_SIZE, 2) - Math.pow(Const.HEX_EDGE_SIZE / 2, 2)) * 2;
    Const.FIELD_WIDTH = Const.HEX_EDGE_COLS *  Const.HEX_EDGE_SIZE + (Const.HEX_EDGE_COLS + 1) *  Const.HEX_EDGE_SIZE / 2; // 120
    Const.FIELD_HEIGHT= Const.HEX_HEIGHT * Const.HEX_EDGE_COLS;
    return Const;
});
