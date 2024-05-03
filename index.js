const puppeteer = require("puppeteer");
const axios = require("axios");
const fs = require("fs");

async function init () {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    return page;
}

async function save (url, page) {
    page.on('response', async response => {
        if (response.url().includes(".png") || response.url().includes(".webp")) {
            var fileType = response.url().includes(".png") ? "png" : "webp";
            console.log(response.url());
            const buffer = await response.buffer();
            fs.writeFile(`images/${Date.now()}.${fileType}`, buffer, (error) => {
                if (error) {
                    console.error(error);
                }
                console.log("Image saved");
            });
        }
    });
    await page.goto(url);
    await page.setViewport({ width: 1080, height: 1024 });
}

async function get (query, page) {
    try {
        console.log(`Preparing to fetch data from query: ${query} ...`);
        const response = await axios.get(`https://api.mojilala.com/v1/stickers/search?q=${query}&api_key=dc6zaTOxFJmzC`);
        const data = await response.data.data.map((item) => item.images.fixed_height.url);
        console.log(data);
        for (let i = 0; i < data.length; i++) {
            await save(data[i], page);
        }
    } catch (error) {
        console.error(error);
    }
}

async function main () {
    try {
        const page = await init();
        const list = ["happy", "sad", "angry", "love", "funny", "cute", "confused", "excited", "scared", "shocked", "cat", "dog", "person", "bird", "ship", "car", "game", "movie", "music", "food", "drink", "sport", "animal", "nature", "city", "building", "sky", "sea", "beach", "mountain", "forest", "desert", "space", "moon", "sun", "star", "cloud", "rain", "snow", "storm", "wind", "fire", "earth", "water", "air", "light", "dark", "color", "shape", "line", "dot", "circle", "square", "triangle", "rectangle", "oval", "heart", "star", "moon", "sun", "flower", "tree", "leaf", "grass", "fruit", "vegetable", "animal", "bird", "fish", "insect", "reptile", "mammal", "amphibian", "human", "baby", "child", "adult", "old"];
        for (let i = 0; i < list.length && i < 10; i++) {
            await get(list[i], page);
        }
        console.log("All data fetched successfully");
    } catch (error) {
        console.error(error);
    }
}

main();