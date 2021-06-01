const express = require('express')
const fs = require('fs')
const admzip = require('adm-zip')
const multer = require('multer')
const path = require('path')
const { hostname } = require('os')
const decompress = require("decompress")
const { brotliDecompress } = require('zlib')
const app = express()
const authenticate = require('./middleware/authenticate')

var dir = "public";
var subDirectory = "public/compressed";
var subDirectory = "public/compressed";
var sub2Directory = "public/unzip";

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
    fs.mkdirSync(subDirectory)
    fs.mkdirSync(sub2Directory);
}
var storage = multer.diskStorage({
    destination: function(req, file, cb) {

        cb(null, "public/compressed");
    },
    filename: function(req, file, cb) {
        cb(
            null,
            (file.originalname)
        );
    },
});

var compressfilesupload = multer({ storage: storage });

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

app.post("/compressfiles", compressfilesupload.array("file", 100), authenticate, (req, res) => {
    var dirPath = __dirname + "/public/compressed/" + req.files[0].originalname;
    var destPath = __dirname + "/public/unzip";
    fs.readdir(destPath, function(err, files) {
        files.forEach((file) => {
            fs.unlinkSync(destPath + "/" + file)
        });
        fs.unlinkSync(dirPath)
    });

});












// var zip = new admzip();
// var outputFilePath = "output.zip";
// if (files) {
//     files.forEach((file) => {
//         zip.addLocalFile(destPath + "/" + file)
//     });
//     fs.writeFileSync(outputFilePath, zip.toBuffer());



// (async() => {
//     try {
//         const files = await decompress(dirPath, destPath);
//         console.log("unziping is done")
//     } catch (error) {
//         console.log(error);
//     }
//     readFile(destPath, dirPath)
// })();

// function readFile(destPath) {
//     fs.readdir(destPath, function(err, files) {
//         files.forEach(function(files) {
//             var ext = path.extname(destPath + files);
//             if (ext === ".json")
//                 console.log("Authentication is passed")
//             else
//                 console.log("Authentication is failed")
//         })

//         ///if condition will be applied
//         ziper(destPath, dirPath, files)
//     })
// }

// function ziper(destPath, dirPath, files) {












app.listen(5000, () => {
    console.log(`App is listening on Port ${5000}`);
});