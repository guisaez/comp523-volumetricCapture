import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { currentUser, errorHandler, NotFoundError, requireAuth } from '@teamg2023/common';
import cookieSession from 'cookie-session';
import { modelRunRouter } from './routes/run-model';

// Import Routers

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: false
    })
)
app.use(express.json({limit: '50mb' }))
app.use(express.urlencoded({limit: '50mb', extended: true}))
app.use(currentUser);
app.use(requireAuth);
app.use(errorHandler);

// Routes
app.use(modelRunRouter);

app.all('*', async () => {
    throw new NotFoundError();
})

export { app };