// initialisation du server et des variables d'environnement 
const express = require("express");
//const path = require('path');
const bodyParser = require("body-parser");
const coockieParser = require("cookie-parser");

// import routes 
const userRoutes = require("./routes/userRoutes");
// import midleware
const {checkUser, requireAuth} = require("./midleware/authMidleware");
const cors = require("cors");

// import fichier .env
require("dotenv").config({path:"./config/.env"});
const {mongoose} = require("./config/db");

const app = express();

// Cors
const corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true,
    'allowedHeaders': ['sessionId', 'Content-Type'],
    'exposedHeaders': ['sessionId'],
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false
  }

app.use(cors(corsOptions));

// parse body & cookies
app.use(coockieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))


// securité auth jwt 
app.get("*", checkUser); // on verrifie le jetton de connexion 
app.get("/jwtid", requireAuth, (req, res) =>{ // on récuppère les infos de l'ut connecté 
    res.status(200).send(res.locals.user._id);
}); 

// routes
app.use("/api/user", userRoutes);


app.listen(process.env.PORT, ()=>{
    console.log(`Listening on port ${process.env.PORT}`);
});