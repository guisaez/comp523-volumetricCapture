## Projects Service

This service handles project creation, deletion. notifies the user with project status, etc.

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
        * Will listen for events and define the logic of what to do for each specific event. For example: `FileUploadedListener` will add a relation with the file that was uploaded and the reference Id in the project.
    * Publishers:
        * Will create an instance of a publisher event that will be read from NATS Streaming across different services. For example: a `new ModelRunEvent` will be published once the project is selected to run and it will be picked up by the `model-service`.
3. `models`
    * Defines a project model and what information will be stored in the database. It also has the definition of a file-model to add to the relation inside each ProjectDoc. That is, a `ProjectDoc` will have a reference to zip_fileId, which will point to a `FileDoc`.
4. `routes`
    * Express server routes for project creation, deletion, etc.
5. `tests`
    * Sets up test configuration for jest.
6. `utils`
    * `validateFiles`: checks if every required file has been updated before running the model.
7. `app.ts`
    * Express application configuration.
    * Establishes connection to database and NATS streaming service.
    * Initializes `listeners` from application.

| Method | Route | Payload | Description | Response |
| ---- | ---- | ---- | --- | --- |
| DELETE | /api/projects | { currentUser }| Delete all projects related with the user | { } |
| DELETE | /api/projects/:id | {} | Delete project by specified Id | { } |
| GET | /api/projects/:id | {} | Get project by Id | { project: ProjectDoc } |
| GET | /api/projects | { currentUser } |  Get all projects related with user | { projects: [ ProjectDoc ]} |
| POST | /api/projects/run/:projectId | {} | Run the model | { FileDoc } |
| PUT | /api/projects/:id | { file, type } | Update Project by projectId | { project: ProjectDoc } |


### Testing

Additional tests can be added inside `__test__` directories.

In order to run tests locally:
1. Navigate to the files directory:
    ```shell
    cd projects-service
    ```
2. Run test script:
    ```shell
    npm run test
    ```
