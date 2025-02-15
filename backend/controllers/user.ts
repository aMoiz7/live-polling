import jwt from "jsonwebtoken"
import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt"
const prisma = new PrismaClient();

export const signUp = async (req: Request, res: Response , next:NextFunction) => {
  try {
    const { username, email, password }: any = req.body;
  
  
    if([username , email , password].some((data)=> data === '')){
      return res.status(401).json("all feilds are required");
    }
  
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return res.status(401).json("User already exists");
    }
   
  
     const hashPassword = await bcrypt.hash(password , 10)
  
     const newUser = await prisma.user.create({
       data: {
         username,
         email,
         password: hashPassword,
       },
     });
  
     if(!newUser){
     return res.sendStatus(400).json({message:"new user not creared", newUser});
     }
   
     return res.sendStatus(200).json({ message: "new user creared", newUser });
  } catch (error) {
    next(error);
  }

};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password }: any = req.body;

    if ([username, email, password].some((data) => data === "")) {
      return res.status(401).json("all feilds are required");
    }

   const existingUser = await prisma.user.findFirst({
     where: {
       OR: [{ email: email }, { username: username }],
     },
   });


    if (!existingUser) {
      return res.status(401).json("User not exists");
    }

    const hashPassword = await bcrypt.compare(password , existingUser.password)

    if(!hashPassword){
      return res
        .sendStatus(401)
        .json({ message: "invalid credentials"});  
    }
      
     
   const token = jwt.sign({ username: existingUser.username }, "testing", {
     expiresIn: "1h",
   });


    if(!token){
        return res.send(401).json({ message: "token not generated" });  
    }


    return res.send(200).json({ message: "user login", token , existingUser });
  } catch (error) {
    next(error);
  }
};


