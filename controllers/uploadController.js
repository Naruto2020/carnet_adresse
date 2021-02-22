// import UserSchema
const {User} = require("../models/user");
// import de l'objetId de mongoose
const ObjetId = require("mongoose").Types.ObjectId;

// initialisation de la création des fichiers 
const fs = require("fs");
const {promisify} = require("util");
const pipeline = promisify(require("stream").pipeline);

// gestion des erreurs 
const {uploadErrors} = require("../utils/errorsUtils");

module.exports.uploadProfil = async (req, res) =>{
    try{
        if (
            req.file.detectedMimeType != "image/jpg" &&
            req.file.detectedMimeType != "image/png" &&
            req.file.detectedMimeType != "image/jpeg"
        ){
            throw Error("invalid file");
        }

        if (req.file.size > 500000){
            throw Error("max size");
        }
    } catch(err){
        const errors = uploadErrors(err);
        return res.status(201).json({ errors });
    }

    // on sauvegarde les photos de profil sous un même nom pour éviter un surstockage de photo ut
    const fileName = req.body.name + ".jpg";

    // ceation et stockage du fichier static
    await pipeline(
        req.file.stream,
        fs.createWriteStream(
          `${__dirname}/public/uploads/profil/${fileName}`
        )
    );

    // insertion du chemin dans la BDD 
    try{
        await User.findByIdAndUpdate(
            req.body.userId,
            { $set : {photo: "./uploads/profil/" + fileName}},
            { new: true, upsert: true, setDefaultsOnInsert: true},
            (err, docs) =>{
                if(!err){
                    return res.send(docs);
                }else{
                    return res.status(500).send({ message: err });
                }
            }
        );
    }catch(err){
        return res.status(500).send({ message: err });
    }
};