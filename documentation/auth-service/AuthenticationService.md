## Authentication Service 

This services runs in a separate container or pod in our application. It handles:
* UserAuthentication
* UserCreation
* UserSignOut

### Server

* This application establishes a connection, listening for requests on PORT 3000. 
* It also connects to a defined MongoDB database service. 
* Utilizes cookies and JWT to store user information.
* Ensures that user password is hashed before saving it in the database.

### Folder Structure

| Name | Description |
| ---- |  ---- |
| package.json | Contains server information such as required dependencies, scripts and jest configuration.|
| tsconfig.json | Typescript configuration. |
Dockerfile | Creates a Docker image that will install all node dependencies listed in package.json and starts the server using the `npm start` command. |
| src | Server implementation

### Src Directory Structure

1. `index.ts`
    * Checks for required environment variables.
    * Establishes a connection to the mongoose using the provided `MONGO_URI` environment variable.
    * Initializes the server and sets it up to listen in PORT: 3000
2. `app.ts`
    * Configure express server.
    * Configure cookie-session
    * Add endpoints to the express server.
    * Ensure that unknown requests return a `NotFoundError()`
3. `models/user-model.ts`
    * Define the User model to be saved in the database.
    * UserAttrs corresponds to the attributes required to create a user.
    * UserDoc represents a single record from the database.
    * UserModel represents the entire collection of data.
    * Defines a pre-save function that ensures the password is hashed.
4. `utils/password.ts`
    * Handles password encryption and comparison.
5. `test`
    * Adds test configuration for jest.
6. `routes/*`
    * Server routes are defined here.

| Endpoint | Method | Request Body | Description |
| :---: | :---:  | :---:| :---:   |
| /api/auth/signup | POST | { email: string, password: string } | Create a new user |
| /api/auth/signin | POST | { email: string, password: string} | Sign in into application |
| /api/auth/user | GET | { } | Get current user information based on cookie session | 
| /api/auth/signout | POST | { } | Signout from application |

### JWT

The JWT is being access through the environment and it is used to sign user data.

```typescript
 const JWT = jwt.sign({
            id: existingUser.id,
            email: existingUser.email
        }, 
            process.env.JWT_KEY!
        )

        req.session = {
            jwt: JWT
        }
```

### Testing Service 

Tests can be added to the `__test__` directory with the same route name. Example: `auth-signin.test.ts`

In order to test this service locally:
* Navigate to the root directory of this service.
```shell
cd auth
```
* Make sure you have installed all dependencies associated with this server. You should have a node_modules directory
```shell
npm install 
```
* Run the following command to test once.
```shell
npm run test:ci
```
* Run the following command to test and watch changes
```shell
npm run test
```

### Running Service

If you want to run the server on you local environment: (Not Recommended)
* You need to declare a valid MONGO_URI environment variable
* You need to declare a JWT_TOKEN environment variable.
* Run the following command
```shell
npm run start
```



