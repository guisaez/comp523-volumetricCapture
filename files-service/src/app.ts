import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { currentUser, errorHandler, NotFoundError, requireAuth } from '@teamg2023/common';
import cookieSession from 'cookie-session';

// Import Routers
import { UploadFileRouter } from './routes/file-upload';
import { UpdateFileRouter } from './routes/file-update';
import { IndexFiles } from './routes/file-index';
import { DownloadFilesRouter } from './routes/file-download';
import { DeleteFileRouter } from './routes/file-delete';

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
app.use(UploadFileRouter);
app.use(UpdateFileRouter);
app.use(IndexFiles);
app.use(DownloadFilesRouter);
app.use(DeleteFileRouter);

app.all('*', async () => {
    throw new NotFoundError();
})

export { app };