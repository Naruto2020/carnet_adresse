const {User} = require("../models/user");
const jwt = require("jsonwebtoken");


// verrification liée a la connexion utilisateur 
module.exports.checkUser = (req, res, next)=>{
    // authentification du token utilisateur
    const token = req.cookies.jwt;
    if(token){
        // on verrifie le token presénté et on le décodes ou on le detruis s'il est éroné 
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) =>{
            if(err){
                res.locals.user = null;
                res.cookie('jwt', '', {maxlife:1});
                next();
            }else{
                //console.log("decodedToken",  decodedToken);
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                //console.log("check",res.locals.user);
                next();
            }
        })
    }else{
        res.locals.user = null;
        next();
    }
}

// information de l'utilisateur connecté 
module.exports.requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) =>{
            if(err){
                console.log(err);
            }else{
                console.log("current user.id : ",decodedToken.id);
                next();
            }
        });
    }else{
        console.log("token absent ...");
    }
}