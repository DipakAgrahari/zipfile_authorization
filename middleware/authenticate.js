const express = require('express')
const fs = require('fs')
const admzip = require('adm-zip')
const path = require('path')
const { hostname } = require('os')
const decompress = require("decompress")
const { brotliDecompress } = require('zlib')
const app = express()

function authenticate(req, res, next) {
    var dirPath = process.cwd() + "/public/compressed/" + req.files[0].originalname;
    var destPath = process.cwd() + "/public/unzip";

    //unzipping the file
    (async() => {
        try {
            const files = await decompress(dirPath, destPath);
            console.log("unziping is done")
        } catch (error) {
            console.log(error);
        }
        readFile(destPath)
    })();

    //authorization is process
    function readFile(destPath) {
        fs.readdir(destPath, function(err, files) {
            for (i = 0; i < files.length; i++) {
                var ext = path.extname(destPath + files);
                if (ext === ".json") {
                    //after authorization zip the unzip file again
                    var zip = new admzip();
                    var outputFilePath = "output.zip";
                    if (files) {
                        files.forEach((file) => {
                            zip.addLocalFile(destPath + "/" + file)
                        });
                        fs.writeFileSync(outputFilePath, zip.toBuffer());
                    }
                    console.log("authorization provided")
                    break;
                }
                //authorization is faled
                if (ext != ".json") {
                    return res.status(401).send({ message: "No authorization provided" })
                    break;
                }
            }
        })
        next();
    }
}
module.exports = authenticate