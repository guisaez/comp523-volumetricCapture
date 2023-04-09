import express from 'express';
import { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, BadRequestError } from '@teamg2023/common';
import { User } from '../models/user-model';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/api/auth/signup', [
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .isLength({min: 8, max: 20})
        .withMessage('Password must be between 8 and 20 characters')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { email, password } = req.body;

        // check if Email is already in use.
        const userExists = await User.findOne({
            email: email
        })

        if(userExists){
            throw new BadRequestError('User already exists')
        }

        // build new user
        const user = User.build({
            email,
            password
        })

        await user.save();

        // generate JWT token
        const JWT = jwt.sign({
            id: user.id,
            email: user.email
        },
            process.env.JWT_KEY!
        );

        req.session = {
            jwt: JWT
        }

        res.status(201).send(user);
        
    })

export { router as SingUpRouter };