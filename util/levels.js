const fs = require("fs");
const {join} = require("patch");

    const msg = (message) => {
        if (fs.existsSync(join(__dirname, "../database", "levels", message.author.id + ".json"))) {
            var db = require(join(__dirname, "../database", "levels", message.author.id + ".json"));
            db.points += Math.ceil(Math.random() * 10);
            fs.writeFileSync(join(__dirname, "../database", "levels", message.author.id + ".json"), JSON.stringify(db));
        }
        else {
            var db = {
                points: 0
            };
            fs.writeFileSync(join(__dirname, "../database", "levels", message.author.id + ".json"), JSON.stringify(db));
        }
    }
    const getLevel = (id) => {
        var db = require(join(__dirname, "../database", "levels", id + ".json"));
        return Math.floor(db.points);
    }
    const getPoints = (id) => {
        if (!fs.existsSync(join(__dirname, "../database", "levels", message.author.id + ".json"))) return "N/A";
        var db = require(join(__dirname, "../database", "levels", id + ".json"));
        return db.points;
    }
    exports.msg = msg;
    exports.getLevel = getLevel;
    exports.getPoints = getPoints;