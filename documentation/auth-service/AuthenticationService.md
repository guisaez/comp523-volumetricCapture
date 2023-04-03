## Authentication Service 

This services runs in a separate container or pod in our application. It handles:
* UserAuthentication
* UserCreation
* UserSignOut

| Endpoint | Method | Request Body | Description |
| :---: | :---:  | :---:| :---:   |
| /api/auth/signup | POST | { email: string, password: string } | Create a new user |
| /api/auth/signin | POST | { email: string, password: string} | Sign in into application |
| /api/auth/user | GET | { } | Get current user information based on cookie session | 
| /api/auth/signout | POST | { } | Signout from application |


### Server

* This application establishes a connection, listening for requests on PORT 3000. 
* It also connects to a defined MongoDB database service. 
* Utilizes cookies and JWT to store user information.
* Ensures that user password is hashed before saving it in the database.

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
### User Model

The User Table has the following schema:

```typescript
// Interface that describes the properties that are needed to create a new User.
interface UserAttrs {
    email: string;
    password: string;
}

// Represents on single record from the database
interface UserDoc extends mongoose.Document {
    email: string,
    password: string
}

// Represents the entire collection of data
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc
}
```

### Testing Service 

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



