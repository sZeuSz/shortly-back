import {db} from "../database/db.js";
import bcrypt from "bcrypt";

export async function signInValidation(req, res, next){
    const { email, password } = req.body;

    const emailExists = await db.query("SELECT * FROM  users WHERE email = $1", [email]);
    
    if (emailExists.rowCount == 0){
        return res.sendStatus(401);
    }

    const user = emailExists.rows[0];
    const userPassword = user.password;
    const samePassword = bcrypt.compareSync(password, userPassword);

    if (!samePassword){
        return res.sendStatus(401);
    }

    next();
}