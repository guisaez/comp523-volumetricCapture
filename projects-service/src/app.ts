import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { currentUser, errorHandler, NotFoundError, requireAuth } from '@teamg2023/common';
import cookieSession from 'cookie-session';
import { projectDeleteRouter } from './routes/delete-project';
import { projectNewRouter } from './routes/new-project';
import { projectIndexRouter } from './routes/index-project';
import { runProjectRouter } from './routes/run-project';
import { projectUpdateRouter } from './routes/update-project';

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
app.use(projectIndexRouter);
app.use(runProjectRouter);
app.use(projectUpdateRouter);


app.all('*', async () => {
    throw new NotFoundError();
})

export { app };