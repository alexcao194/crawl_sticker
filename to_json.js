const fs = require("fs");
var dir = "images";
var files = fs.readdirSync(dir);
var json = [];
files.forEach(file => {
    json.push({
        "src": `assets/sticker/${file}`,
        "slug": ""
    });
});

fs.writeFile("sticker.json", JSON.stringify(json), (error) => {
    if (error) {
        console.error(error);
    }
    console.log("JSON file saved");
});