import express from "express";
import { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import accountsRoute from "./routers/accounts.router.js";

dotenv.config();

const app = express();
app.use(json());
app.use(cors());
app.use(accountsRoute);

const port = process.env.PORT;

app.listen(port, () => console.log(`Server running in port: ${port}`));
