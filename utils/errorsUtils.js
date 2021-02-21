// gestion des erreurs 
module.exports.signUpErrors = (err) =>{
    let errors = { nom:"" , username :"", email: "", password : ""};
    if(err.message.includes("nom"))
      errors.nom = "nom incorrect";
    if(err.message.includes("username"))
      errors.username = "username incorrect ou déjà pris";
    if(err.message.includes("email"))
      errors.email = "Email incorrect";
    if(err.message.includes("password"))
      errors.password = "le mot de passe doit faire 6 caractères minimum";
      
    if(err.code === 11000 && Object.keys(err.keyValue)[0].includes("username"))
      errors.username = "ce username est déjà pris";  

    if(err.code === 11000 && Object.keys(err.keyValue)[0].includes("email"))
      errors.email = "cet email est déjà enregistrer";  

    return errors;
}

module.exports.signInErrors = (err) =>{
    let errors = {email : "", password : ""};
    if(err.message.includes("email"))
      errors.email = "Email inconnu";
    if(err.message.includes("password"))
      errors.password = "le mot de passe ne correspond pas"  

    return errors;  
}

module.exports.uploadErrors = (err) =>{
  let errors = {format : "", maxSize : ""};

  if(err.message.includes("invalid file"))
    errors.format = "format fichier incompatible";

  if(err.message.includes("max size"))
    errors.maxSize = "fichier trop volumineux > 500ko"  ;

  return errors;
}