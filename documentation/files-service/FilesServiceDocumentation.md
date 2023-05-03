## Files Service

* Handles File CRUD (Create, Read, Upload, Delete) of files.

### Folder Structure

| Name | Description |
| ---- |  ---- |
| package.json | Contains server information such as required dependencies, scripts and jest configuration.|
| tsconfig.json | Typescript configuration. |
Dockerfile | Creates a Docker image that will install all node dependencies listed in package.json and starts the server using the `npm start` command. |
| src | Server implementation

### Src Folder Structure
1. `__mocks__`
    * Used for testing event handling with NATS streaming service.
2. `events`
    * Listeners:
        * Will listen for events and define the logic of what to do for each specific event. For example: `ProjectDeletedListener` will delete all files related with a specific project from the database.
    * Publishers:
        * Will create an instance of a publisher event that will be read from NATS Streaming across different services. For example: a `new FileUploadedEvent` will be published once the file has been uploaded and it will be picked up by the `projects-service`.
3. `models`
    * Defines a file model and what information will be stored in the database.
4. `routes`
    * Express server routes for file deletion update, etc.
5. `tests`
    * Sets up test configuration for jest.
6. `utils`
    * `GridFS`: Handles file binary data upload to the database.
7. `app.ts`
    * Express application configuration.
    * Establishes connection to database and NATS streaming service.
    * Initializes `listeners` from application.

| Method | Route | Payload | Description | Response |
| ---- | ---- | ---- | --- | --- |
| DELETE | /api/files/delete | { projectId: string, id: string }| Deletes a file | { } |
| DELETE | /api/files/delete-all/:userId | {} | Deletes all files associated with user | { } |
| GET | /api/files/download/:id | {} | Download file by Id | { } |
| GET | /api/files | {} |  Get all files associated with current user | { files: [ FileDoc ]} |
| GET | /api/files/:id | {} | Get file by Id | { FileDoc }
| PUT | /api/files/update/:id | { file, type } | Update File by FileId | { file: FileDoc } |
| POST | /api/files/upload:projectId | { file, type } | Upload file and associate with projectId | { file: FileDoc }



### Testing

Additional tests can be added inside `__test__` directories.

In order to run tests locally:
1. Navigate to the files directory:
    ```shell
    cd files-service
    ```
2. Run test script:
    ```shell
    npm run test
    ```