// @ts-check
import express, { Router } from "express";
import { z } from "zod";
import pool from "../db.js";

export const router = Router();
const SignupSchema = z.object({
  username: z.string(),
  name: z.string(),
  password: z.string(),
});
const SigninSchema = z.object({
  username: z.string(),
  password: z.string(),
});

router.use(express.json());

const keyLength = 32;

router.get("/", (req, res) => {
  res.send(`api works`);
});

router.post("/signup", (req, res) => {
  const data = SignupSchema.safeParse(req.body);
  if (!data.success) {
    res.send("invalid Data");
    return;
  }
  // const hashedPassword = await hash(data.password);

  try {
    // console.log(username);
    // var user = await pool.connect();
    pool.query(`insert into users(username,name,password) values($1,$2,$3)`, [
      data.data.username,
      data.data.name,
      data.data.password,
    ]);
    res.send(`Signup Succesfull`);
  } catch (e) {
    console.error(e);
    if (e.code === "23505") {
      res.status(400).json({ message: "User already exists" });
    } else if (e instanceof z.ZodError) {
      res.status(400).json({ errors: e.errors });
    } else {
      res.status(500).json({ message: "Signup failed" });
    }
    res.json({});
  }
});

router.post("/signin", async (req, res) => {
  const user_data = SigninSchema.safeParse(req.body);
  if (!user_data.success) {
    res.send("Bhul gaye password");
    return;
  }
  try {
    // console.log(`hello`);
    const data = await pool.query(`select * from users where username = $1`, [
      user_data.data.username,
    ]);
    const rawData = data.rows[0];
    if (rawData.password === user_data.data.password) {
      // res.json({});
      res.send("signin successful");
      return;
    } else {
      res.send(`invalid password`);
      return;
    }
  } catch (e) {
    console.error(e);
    if (e.code === "23505") {
      res.status(400).json({ message: "User already exists" });
    } else if (e instanceof z.ZodError) {
      res.status(400).json({ errors: e.errors });
    } else {
      res.status(500).json({ message: "Signin failed" });
    }
    res.json({});
    return;
  }
});
