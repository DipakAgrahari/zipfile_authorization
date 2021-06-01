const express = require('express')
const app = express();
const router = require('./route/router');
// const port

app.use("/", router)

app.listen(5000, () => {
    console.log(`App is listening on Port ${5000}`);
});