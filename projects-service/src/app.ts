import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { currentUser, errorHandler, NotFoundError, requireAuth } from '@teamg2023/common';
import cookieSession from 'cookie-session';
import { projectDeleteRouter } from './routes/delete-project';
import { projectNewRouter } from './routes/new-project';

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

app.use(currentUser);
app.use(requireAuth);
app.use(errorHandler);

// Routes
app.use(projectDeleteRouter);
app.use(projectNewRouter);

app.all('*', async () => {
    throw new NotFoundError();
})

export { app };