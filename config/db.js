const mongoose = require("mongoose");
const MONGODB_URI = "mongodb+srv://" + process.env.DB_USER_PASS + "@cluster0.5hvbw.mongodb.net/MERN";

//&w=majority
// connexion à mongo atlas 
mongoose.connect( MONGODB_URI , {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
},
function(err){
    if(err){
        console.log("erreur de connexion avec la bd:" + JSON.stringify(err, undefined, 2));
    }else{
        console.log("connecter avec succes a mongodb!...");
    }
}

);


module.exports = mongoose;