const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://braben:" + 
process.env.MONGO_ATLAS_PW + 
"@cluster0.tzq2zlh.mongodb.net/?retryWrites=true&w=majority");


const clientRoutes = require("./api/routes/clients");
const cursoRoutes = require("./api/routes/cursos");
const userRoutes = require('./api/routes/user');


app.use(morgan("dev"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Acces-Control-Allow-Origin", "*");
    res.header(
        "Acces-Control-Allow-Headers", 
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POSTM PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

//RUTAS
app.use("/clients", clientRoutes);
app.use("/cursos", cursoRoutes);
app.use("/user", userRoutes);

app.use((req, res, next) => {
    const error = new Error('No se encontro');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});


module.exports = app;