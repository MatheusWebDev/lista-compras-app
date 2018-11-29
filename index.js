const express = require("express");
const path = require('path');
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 3000;

const app = express();

app.use('/', (req, res) => {
   res.send("<h1>Hello from APP</h1>"); 
});


app.listen(PORT, () => {
    console.log(`App rodando na porta ${PORT}`);
});