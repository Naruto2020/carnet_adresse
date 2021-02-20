// import UserSchema
const {User} = require("../models/user");
// import de l'objetId de mongoose
const ObjetId = require("mongoose").Types.ObjectId;

/** *** *** *** CRUD *** *** *** */

// display all users without password 
module.exports.getAllUsers = async (req, res) =>{
    const users = await User.find().select("-password");
    res.status(200).json(users);
};

// display user by id
module.exports.userInfo =  (req, res) =>{
    // verrification de la validité de l'ID
    if(!ObjetId.isValid(req.params.id))
      return res.status(400).send(`Id incorrecte ${req.params.id}`);
    User.findById(
        req.params.id,
        (err, docs) =>{
            if(!err){
                return res.send(docs);
            }else{
                console.log("erreur de transmission du comptes utilisateur:" + JSON.stringify(err, undefined, 2));
            }
        }
          
    ).select("-password");
};

// update users 
module.exports.editUser = async (req, res) =>{
    // verrification de la validité de l'ID
    if(!ObjetId.isValid(req.params.id))
      return res.status(400).send(`Id incorrecte ${req.params.id}`);

    let newUser =  { 
        age : req.body.age, 
        race : req.body.race,
        famille : req.body.famille,
        nourriture : req.body.nourriture,
        id : req.body.id
    };
    try{
        await User.findByIdAndUpdate(
            req.params.id,
            {$set : newUser},
            {new:true, upsert: true, setDefaultsOnInsert: true},
            (err, docs) =>{
                if(!err){
                    return res.send(docs);
                }else{
                    return res.status(500).send({message: "erreur lors de la mise a jour utilisateur"});
                }
            }
        );  

    }catch(err){
        res.status(400).send(err);
    }
};

// delete users 
module.exports.deleteUser = (req,res) =>{
    if(!ObjetId.isValid(req.params.id))
      return res.status(400).send(`Id incorrecte ${req.params.id}`);

    try{
        User.findByIdAndDelete(
            req.params.id,
            (err, docs) =>{
                if(!err){
                    res.send(docs);
                }else{
                    return res.status(500).send({message : "erreur lors de la suppression du compte"})
                }
            }
        );  

    } catch(err){
        res.status(400).send(err);
    }
      
};

/** *** *** *** set friends request *** *** *** */

// follow user
module.exports.followUser = async (req, res) =>{
    if (!ObjetId.isValid(req.params.id) || !ObjetId.isValid(req.body.idToFollow))
        return res.status(400).send(`id incorrecte ${req.params.id}`);

    try{
        // ajout à la liste followings
        await User.findByIdAndUpdate(
            req.params.id,
            {$addToSet:{followings : req.body.idToFollow}},
            {new : true, upsert:true},
            (err, docs) =>{
                if(!err){
                    res.status(200).json(docs);
                }else{
                    return res.status(400).json({message : "erreur l'ors de l'enregistrement dans la liste d'amis "});
                }
            }

        );
        // ajout à la liste followers
        await User.findByIdAndUpdate(
            req.body.idToFollow,
            {$addToSet : {followers: req.params.id}},
            {new: true, upsert: true},
            (err, docs) =>{
                if(err){
                    return res.status(500).json({message : "erreur l'ors de l'enregistrement dans la liste d'amis "});
                }
            }
        );
    }catch(err){
        res.status(400).send(err);
    }  
}

// unfollow user
module.exports.unfollowUser = async(req, res) =>{
    if (!ObjetId.isValid(req.params.id) || !ObjetId.isValid(req.body.idToUnFollow))
        return res.status(400).send(`id incorrecte ${req.params.id}`);

    try{
        // retrait de la liste followings
        await User.findByIdAndUpdate(
            req.params.id,
            {$pull : {followings : req.body.idToUnFollow}},
            {new: true, upsert: true},
            (err, docs) =>{
                if(!err){
                    res.status(200).json(docs);
                }else{
                    return res.status(400).json({message : "erreur l'ors de l'enregistrement dans la liste d'amis "});
                }
            }
        );
        // retrait de la liste followers
        await User.findByIdAndUpdate(
            req.body.idToUnFollow,
            {$pull : {followers: req.params.id}},
            ({new : true, upsert : true}),
            (err, docs) =>{
                if(err){ 
                    return res.status(500).json({message : "erreur l'ors de l'enregistrement dans la liste d'amis "});
                }
                
            }
        );
    } catch(err){
        res.status(400).send(err);
    }    
};