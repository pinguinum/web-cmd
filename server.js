const express = require("express");
const bodyParser = require("body-parser");
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;
const localPath = 'http://localhost:3000/'
const cors = require('cors');
const oldImagesPath = path.join(__dirname, '/public/oldPhotos/');
const newImagesPath = path.join(__dirname, '/public/newPhotos/');
const catsPath = path.join(__dirname, '/public/cats/');
let usedImages = {
    selfie: new Set(),
    school: new Set(),
    cats: new Set(),
};

app.use(bodyParser.json());
app.use(cors({
    origin: '*'
}));


app.post("/command", (req, res) => {
    const command = req.body.command;
    let result = {};
    switch (command) {
        case 'help':
            result = {
                res: '<p>Доступные команды: <br/>s --selfie-photo - Отправить селфи фото, <br/> ' +
                    's --school-photo - Отправить школьное фото,<br/>' +
                    's --cats-photo - Отправить фото котиков,<br/>' +
                    'about - О приолжении, <br/>' +
                    's --cv - Отправить резюме</p>'
            };
            break;
        case 's --selfie-photo':
            result = {link: localPath + 'getPhoto?photo=selfie'};
            break;
        case 's --school-photo':
            result = {link: localPath + 'getPhoto?photo=school'};
            break;
        case 's --cats-photo':
            result = {link: localPath + 'getPhoto?photo=cats'};
            break;
        case 's --cv':
            result = {
                res: 'Привет! Я Вероника Родина, java-разработчик! :)<br/>Переодически я фулстачу как на рабочем проекте, так и для себя и на хакатонах<br/>' +
                    'Со школы увлекаюсь программированием. Начала с java в школе, продолжила на python, vue/node в университете.<br/>' +
                    'Мне инетерсена эта работа, потому что я вижу для себя возможности для роста в менторстве. Я веселая, легкая на подьем и всегда нахожу общий язык с людьми :) '
            };
            break;
        case 'about':
            result = {
                res: 'Надеюсь вам понравился мой полет фантазии. Давно хотела сделать сайт визитку в виде консоли :) <br/>' +
                    'Я потратила на это 1,5 вечера. Конечено, есть что доработать, можно подумать как оформить бд, чтобы все это хранить, порефактрорить, доработать логику... <br/>' +
                    'Я с удовольствием провела время, в будущем доработаю этот сайт и размещу в интеренете как свою визитку :)'
            };
            break;
        default:
            result = {
                res: '"' + command + '" не является внутренней или внешней' +
                    'командой, исполняемой программой или пакетным файлом.'
            };
            break;
    }
    res.send(result);
});

app.get("/getPhoto", (req, res) => {
    const typePhoto = req.query.photo;
    let folderPath;
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    switch (typePhoto) {
        case 'selfie':
            folderPath = newImagesPath;
            break;
        case 'school':
            folderPath = oldImagesPath;
            break;
        case 'cats':
            folderPath = catsPath;
            break;
    }
    getRandomImageFromFolder(folderPath, typePhoto, (err, imagePath) => {
        if (err) {
            res.status(500).send('Ошибка сервера');
        } else {
            res.sendFile(imagePath);
        }
    });
});


function getRandomImageFromFolder(folderPath, typePhoto, callback) {
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            callback(err, null);
        } else {
            let availableImages = files.filter(image => !usedImages[typePhoto].has(image));

            if (availableImages.length === 0) {
                usedImages[typePhoto].clear();
                availableImages = files.filter(image => !usedImages[typePhoto].has(image));
            }

            const randomIndex = Math.floor(Math.random() * availableImages.length);
            const randomImage = availableImages[randomIndex];

            usedImages[typePhoto].add(randomImage);
            const imagePath = path.join(folderPath, randomImage);
            callback(null, imagePath);
        }
    });
}

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});