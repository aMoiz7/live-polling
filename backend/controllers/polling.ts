import { PrismaClient } from "@prisma/client";
import { json, NextFunction, Request, Response } from "express";
import { io } from './../index';
const prisma = new PrismaClient();

export const polls = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { question, options, expireAt } = req.body;

    const userId = Number(req.query.id);

    const finduser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!finduser) {
      return res.status(400).json("user not found");
    }

    const createpoll = await prisma.poll.create({
      data: {
        question,
        options: options.map((option) => ({ text: option, votes: 0 })),
        createdBy: userId,
        expiresAt: expireAt,
      },
    });

    if (!createpoll) {
      return res.status(400).json("poll not created");
    }

    return res.status(200).json(createpoll);
  } catch (error) {
    next(error);
  }
};



export const castVote = (async(res:Response , req:Request)=>{
 try {
    const io = req.io; 
   const {pollId , option} = req.body
   const userId = Number(req.query.id);
 
   const vote = await prisma.vote.create({
     data:{
       pollId,
       userId,
       option
     }
   })
 
   const poll = await prisma.poll.findUnique({
     where:{
       id:pollId
     }
   })
 
   const updatePoll = poll?.options?.map((poll)=> poll.text===option?{...poll , votes:poll.votes+1}:poll)
 
    await prisma.poll.update({
     where:{
       id:pollId
     },
     data:{
       options:updatePoll
     }
    }) 
 
      io.emit("updateResults", { pollId, options: updatePoll });
   
     res.status(200).json(vote);
 } catch (error) {
    
    
 }
  })


