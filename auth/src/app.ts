import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { NotFoundError, errorHandler } from '@teamg2023/common';
// Server endpoints import 
import { SingUpRouter } from './routes/auth-signup';
import { SignInRouter } from './routes/auth-signin';
import { SingOutRouter } from './routes/auth-signout';
import { UserRouter } from './routes/auth-user';


const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: false // To be configured later since JEST uses HTTP instead of HTTPS
    })
);
// User Errorhandler middleware
app.use(errorHandler);

// Server Routes
app.use(SingUpRouter);
app.use(SignInRouter);
app.use(SingOutRouter);
app.use(UserRouter);

app.all('*', async () => {
    throw new NotFoundError();
})

export { app }
