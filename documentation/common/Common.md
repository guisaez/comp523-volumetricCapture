## Common - Custom NPM dependency.

1. `src/errors`
    * Creates custom errors to be used in the application.
2. `src/events`
    * Defines events for the NATS streaming service.
3. `src/events/types`
    * Defines the File Types that can be uploaded.
    * Defines the Process Status enum.
4. Defines custom middlewares to be used by the application. 

### Publishing changes.
1. Ensure that you are logged in to npm through the command line.
```shell
npm login
```
Username: teamg2023
Password: TeamGSpring2023

2. Acces the common directory through the terminal and run the command:
```shell
npm run pub
``` 

This will publish packages and upload them to npm library.

3. Make sure to update all services that use the `@teamg2023/common` dependency:
    * Navigate to the root directory service that uses the dependency.
        * Example: 
        ```shell
        cd files-service
        ```
    * Update packages
        ```shell
        npm update @teamg2023/common
        ```


