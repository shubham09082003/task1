import express from 'express';
import jwt from 'jsonwebtoken';
import cors from 'cors'
import { db } from './db';
import {User} from './userSchema'
import bcrypt from 'bcrypt';

const app = express();

app.use(express.json());
app.use(cors())


app.get("/" , async(req , res) => {
    res.status(200).json({
        msg : "hi there!!"
    });
})

app.post("/signup", async(req , res) => {
    const {email , password} = req.body;

    try{
        const user = await User.findOne({email : email});
        if(user){
            res.status(401).json({
                msg  : "User is Already signed up"
            });
            return;
        }
        const hashedPassword = await bcrypt.hash(password , 10);
        const response = await User.create({
            email,
            password : hashedPassword
        });
        res.status(200).json({
            msg : "User Logged In successfully",
            response : response
        });
    }

    catch(err){
        console.log(err);
        res.status(500).json({
            msg : "Internal Server Error"
        });
    }
})

app.post("/login", async(req , res) => {
    const {email , password } = req.body;
    try{
        const response = await User.findOne({email : email});
        if(!response){
            res.status(401).json({msg : "User not found"})
        }else{
            if(response.email === email){
                const comparedPassword = await bcrypt.compare(password , response.password);
                if(comparedPassword){
                    const token = jwt.sign({ id :  response._id }, "mySecret");
                    res.status(200).json({
                        msg : "User loged In!!",
                        token : token
                    });
                    return;
                }
                else{
                    res.status(422).json({
                        msg : 'Password is not correct'
                    });
                    return;
                }
            }
            else{
                res.status(422).json({
                    msg : "Email is not found"
                });
                return;
            }
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            msg : "Internal Server Error"
        });
    }
} )

app.listen(3000,() => {
    db();
    console.log("Server is listening on port 3000");
});
