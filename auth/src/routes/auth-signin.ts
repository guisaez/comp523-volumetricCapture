import express from 'express';
import { body } from "express-validator";
import { Password } from "../utils/password";
import { validateRequest, BadRequestError } from "@teamg2023/common";
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { User } from "../models/user-model";

const router = express.Router();

router.post('/api/auth/signin', [
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('You must supply a password')
    ],
    validateRequest,
    async (req: Request, res: Response) => {

        const { email, password } = req.body;

        const existingUser = await User.findOne({
            email
        })

        if(!existingUser){
            throw new BadRequestError('No user associated with that email has been found')
        }

        const passwordMatch = await Password.compare(existingUser.password, password);

        if(!passwordMatch){
            throw new BadRequestError('Invalid Credentials');
        }

        const JWT = jwt.sign({
            id: existingUser.id,
            email: existingUser.email
        }, 
            process.env.JWT_KEY!
        )

        req.session = {
            jwt: JWT
        }

        res.status(200).send(existingUser);
    }
)

export { router as SignInRouter };

