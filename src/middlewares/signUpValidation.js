import { signUpSchema } from "../models/signUp.model.js";
import {db} from "../database/db.js";

export async function signUpValidation(req, res, next){
    const {name,email,password,confirmPassword} = req.body;
    const {error} = signUpSchema.validate({name,email,password,confirmPassword}, {abortEarly: false});
    if(error){
        const errors = error.details.map((detail)=> detail.message)
        return res.status(422).send(errors);
    };

    if(password !== confirmPassword){
        return res.status(422).send({message:"Senhas diferentes."});
    }

    const emailExists = await db.query("SELECT * FROM  users WHERE email = $1", [email]);
    
    if (emailExists.rowCount > 0){
        return res.sendStatus(409);
    }

    res.locals.signUp = {name,email,password};
    next();
}
