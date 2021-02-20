// import UserSchema
const {User} = require("../models/user");
const jwt = require("jsonwebtoken");
const {signUpErrors, signInErrors} = require("../utils/errorsUtils");

// initialisation de la durée du token 
const maxlife = 3 * 24 * 60 * 60 * 1000; // en milisecondeequivaut à 03 jours 
const createToken = (id)=>{
    return jwt.sign({id}, process.env.TOKEN_SECRET, {
        expiresIn : maxlife,

    });
}

/** *** *** *** CRUD *** *** *** */

// inscription
module.exports.singUp = async (req, res) =>{
    // initialisation des champs de saisie
    const  { nom, username, email, password } = req.body;
    try{
        const newUser = await User.create({ nom, username, email, password });
        // enregistrement du profil
        res.status(201).json({newUser:newUser._id});

    }catch(err){
        const errors = signUpErrors(err);
        res.status(200).send({errors});
    }
};

module.exports.singIn = async (req, res) =>{
    const {email, password} = req.body;
    try{
        // check if user exist with those email and password 
        const user = await User.login(email, password);
        // create token with user id 
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, sameSite:true, maxlife});
        res.status(200).json({ user: user._id});

    }catch(err){
        const errors = signInErrors(err);
        res.status(200).json({errors});
    }
}

// gestion des déconnexions 
module.exports.logout =  (req, res) =>{
    res.cookie('jwt', '', {maxlife:1});
    res.redirect("/");
}