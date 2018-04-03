/* jshint esversion: 6 */
const opt = require("./scrabble.language.options");

const validator = options => {
  let lang = options.lang;
  let langOptions = opt[lang];

  return {
    "validator": {
      "$jsonSchema": {
        "bsonType": "object",
        "required": ["_id", "name", "bag", "board", "players"],
        "properties": {
          "_id": {
            "bsonType": "string",
            "description": "must be a string and is required"
          },
          "name": {
            "bsonType": "string",
            "description": "must be a string and is required"
          },
          "bag": {
            "bsonType": "array",
            "description": "must be an array and is required",
            "items": {
              "bsonType": "object",
              "required": ["_id", "letter", "points"],
              "properties": {
                "id": {
                  "bsonType": "int",
                  "description": "id of tile",
                  "minimum": 0,
                  "maximum": 99
                },
                "letter": {
                  "bsonType": "string",
                  "maxLength": 1,
                  "description": "letter"
                },
                "points": {
                  "bsonType": "int",
                  "minimum": 0,
                  "maximum": 10,
                  "description": "points for the letter"
                },
              },
              "description": "tiles"
            },
            "maxItems": 100
          },
          "board": {
            "bsonType": "array",
            "items": {
              "bsonType": "object",
              "required": ["_id", "tile"],
              "properties": {
                "_id": {
                  "bsonType": "string",
                  "description": "letter for column and number for row"
                },
                "tile": {
                  "bsonType": "object",
                  "required": ["_id", "letter", "points"],
                  "properties": {
                    "id": {
                      "bsonType": "int",
                      "description": "id of tile"
                    },
                    "letter": {
                      "bsonType": "string",
                      "maxLength": 1,
                      "description": "letter"
                    },
                    "points": {
                      "bsonType": "int",
                      "minimum": 0,
                      "maximum": 10,
                      "description": "points for the letter"
                    },
                  },
                  "description": "scrable tile"
                }
              }
            },
            "description": "must be an array and is required"
          },
          "players": {
            "bsonType": "array",
            "items": {
              "bsonType": "object",
              "required": ["_id", "name", "points", "time", "tiles"],
              "properties": {
                "_id": {
                  "bsonType": "string",
                  "description": ""
                },
                "name": {
                  "bsonType": "string"
                },
                "points": {
                  "bsonType": "int"
                },
                "time": {
                  "bsonType": "int"
                },
                "tiles": {
                  "bsonType": "array",
                  "items": {
                    "bsonType": "object",
                    "required": ["_id", "letter", "points"],
                    "properties": {
                      "id": {
                        "bsonType": "int",
                        "description": "id of tile"
                      },
                      "letter": {
                        "bsonType": "string",
                        "maxLength": 1,
                        "description": "letter"
                      },
                      "points": {
                        "bsonType": "int",
                        "minimum": 0,
                        "maximum": 10,
                        "description": "points for the letter"
                      },
                    },
                    "minItems": 0,
                    "maxItems": 7,
                    "description": "scrable tile"
                  }
                }
              }
            },
            "minItems": 2,
            "maxItems": 4,
            "description": "must be an array and is required"
          }
        }
      }
    }
  };
};

module.sxports = validator;
