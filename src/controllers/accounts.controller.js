import bcrypt from "bcrypt";
import { db } from "../database/db.js"
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export async function signUp(req,res){
    const {name,email,password} = res.locals.signUp;

    const hiddenPassword = bcrypt.hashSync(password, 12);

    try{
        await db.query(
        `INSERT INTO users (name, email, password) VALUES ($1, $2, $3);`,
        [name, email, hiddenPassword]); 
        res.sendStatus(201);
    }catch(error){
        res.sendStatus(500);
    }
}

export async function signIn(req, res){
    const { email } = req.body;

    try{

        const userExists = await db.query("SELECT * FROM  users WHERE email = $1", [email]);
        const user = userExists.rows[0];
        const token = jwt.sign({ userId: user.id }, process.env.JWT_KEY);
        console.log(token);
        await db.query('INSERT INTO sesions ("userId", token) VALUES ($1, $2);', [user.id, token]);

        res.sendStatus(200);
    }catch(error){
        res.sendStatus(500);
        console.log(error);
    }
}