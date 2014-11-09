define([], function() {
    return {
        HEX_COUNT: 19,
        CROSSROAD_COUNT: 53,
        HEX_TYPE_WHEAT: "wheat",
        HEX_TYPE_SHEEP: "sheep",
        HEX_TYPE_WOOD: "tree",
        HEX_TYPE_ROCK: "rock",
        HEX_TYPE_BRICK: "brick",
        HEX_TYPE_DESERT: "desert",
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
});
