# Client Service 

This service runs in a separate container or pod in our application. It is a front-end based on React.

---

## Install
* This application establishes a connection, listening on PORT 3000. 
* Make sure you have `auth`, `files-service`, `model-service`, `project-service` and `volumetricCapture` running.

* Navigate to the root directory of this service.
```shell
cd client
```
* Make sure you have installed all dependencies associated with this server. You should have a node_modules directory
```shell
npm install 
```
---

## Testing

Tests can be added to the `src/tests/` directory with a `test.js` extension. Example: `example_test.test.js`

After you finish the installation above:
* Run the following command to test
```shell
npm run test
```
---
## Running

After you finish the installation above:
* Run the following command to run
```shell
npm run start
```

---
## Folder Structure
```
comp523-volumetricCapture
└── client
    ├── package.json
    ├── Dockerfile
    ├── public
    └── src
        └── components
            ├── BackButton.js
            ├── DeleteButton.js
            ├── FileManager.js
            ├── Help.js
            ├── Login.js
            ├── ProjectCard.js
            ├── ProjectEdit.js
            ├── ProjectList.js
            ├── ProjectView.js
            ├── SettingManager.js
            ├── Signup.js
            └── User.js
        └── pages
            └── LandingPage.js
        └── tests
            └── components.test.js
```
---
## Components
All of the components below are locaed in `src/components`.

---

### BackButton

Renders a "Back" button and a confirmation dialog to navigate back to the projectList view or prompt the user to confirm their intention to discard unsaved changes.

#### Props

- `setView`: A function that sets the current view state to navigate back to the projectList view.
- `isSafed`: A boolean value that indicates whether there are any unsaved changes.

#### Functions

- `handleOpenBack()`: A function that opens the confirmation dialog if there are unsaved changes, otherwise navigates back to the projectList view.
- `handleBack()`: A function that navigates back to the projectList view.
- `handleCloseBack()`: A function that closes the confirmation dialog.

#### States

- `openBack`: A boolean value that indicates if the dialog is opened.

---

### DeleteButton

This component renders a delete button with a confirmation dialog.

#### Props

- `isDisabled`: A boolean that specifies whether the button should be disabled or not.
- `size`: A string that specifies the size of the button.
- `marginVar`: An integer that specifies the margin of the button.
- `buttonName`: A string that specifies the name to be displayed on the button.
- `onDelete`: A function that specifies the function to be called when the delete button is clicked.
- `deletedThing`: A string that specifies the name of the thing to be deleted.

#### Functions

- `handleClickOpen()`: A function that opens the confirmation dialog when the delete button is clicked.
- `handleClose()`: A function that closes the confirmation dialog when the user clicks outside the dialog or presses the ESC key.
- `handleDelete()`: A function that handles the delete action and closes the confirmation dialog.

#### States

- `open`: A boolean that manages the visibility of the confirmation dialog.

---

### FileManager

A reusable component for file upload/update, download, delete.

#### Props

- `info`: An object that contains information about the project.
- `fileType`: A string that determines the type of file (zip, extrinsic, or intrinsic).
- `format`: A string that determines the file format to accept in the input file element.

#### Functions

- `handleFileReader()`: A function that handles the file selection by the user and updates the state accordingly.
- `handleUpload()`: A function that handles the file upload to the server and updates the state accordingly.
- `handleDelete()`: A function that handles the file deletion from the server and updates the state accordingly.
- `handleDownload()`: A function that handles the file download from the server.

#### States

- `Id`: A string that represents the id of the uploaded file.
- `File`: An object that represents the selected file to be uploaded.
- `ButtonName`: A string that represents the text of the upload button (either "Upload" or "Update").
- `FileName`: A string that represents the name of the uploaded file.
- `Ref`: A reference to the input file element.
- `selectedName`: A string that represents the name of the selected file.
- `disableUpload`: A boolean that determines if the upload button should be disabled.
- `disableDelete`: A boolean that determines if the delete button should be disabled.

---

### Help

This component renders a help button and a dialog containing markdown content.

#### Props

- `helpMarkDown`: A string representing the URL to fetch the markdown content from.

#### Functions

- `handleOpenHelp()`: A function that is called when the help button is clicked. It fetches the markdown content from the given URL and sets the markdown
- `handleCloseHelp()`: A function that is called when the help dialog is closed. It sets the openHelp state to false.
####States:
- `markdown`: A string to store the fetched markdown content.
- `openHelp`: A boolean to indicate if the help dialog is open or closed.
---
### Login
This component is responsible for the login page UI and functionality. It receives props such as `setView`, `setTabValue`, and `setisLogged`. The component renders a form with an email and password input field and two buttons, one for login and one for sign up. It also displays an error message in case of invalid input.

#### Props:
- `setView`: A function that sets the current view to either the login or sign-up page
- `setTabValue`: A function that sets the current tab in the main application view
- `setisLogged`: A function that sets the current login status of the user

#### Functions:
- `handleChange()`: A function that updates the values in the state based on user input
- `handleClickShowPassword()`: A function that toggles the visibility of the password field
- `handleMouseDownPassword()`: A function that prevents the default behavior when the password icon button is clicked
- `handlelogin()`: A function that handles the login functionality using Axios and sets the state accordingly

#### States:
- `values`: An object that holds the current values of email and password input fields
- `error`: A boolean that holds whether an error occurred during login
- `errorMessage`: A string that holds an error message occurred during login
- `showPassword`: A boolean that holds whether the password field should be visible or not
---
### ProjectCard

This component represents the project card component that shows the project name, creation date, and status. It also contains buttons to edit, delete, and download the project, depending on the project's status.

#### Props

- `setNumProjects`: A function to set the total number of projects.
- `setView`: A function to set the current view of the user.
- `value`: An object containing the project's information.
- `setProject`: A function to set the current project being edited.
- `setisLogged`: A function to set the current logged-in status of the user.

#### Functions

- `handleEdit()`: A function to handle the edit button click.
- `handleDelete()`: A function to handle the delete button click.
- `handleDownload()`: A function to handle the download button click.

#### States

- `errorMsg`: A string representing the error message if there's any.
- `error`: A boolean value indicating if there's an error.
- `buttonName`: A string representing the name of the button displayed in the project card.
- `projectInfo`: An object containing the project's information such as the project name, creation date, status, etc.
---

### ProjectEdit

A component for editing project information, including project name, file management, settings, and deleting the project.
You may change the content of the makrdown file by changing the path defined in the `helpMarkdown` constant in `src/components/ProjectEdit.js` line `37` to `39`.

#### Props:
- `setView`: A function to switch views.
- `project`: The current project object to edit.
- `setProject`: A function to set the edited project object.
- `setisLogged`: A function to set the login status.

#### Functions:
- `handleSave()`: A function to save the changes made to the project name.
- `handleChange()`: A function to handle the changes made to the project name.
- `handleDelete()`: A function to delete the current project.

#### States:
- `info`: An object of project information state that holds the current project object.
- `error`: A boolean that indicates whether there is an error with the project name.
- `errorMessage`: A string of the error message to display when there is an error with the project name.
- `isSafed`: A boolean state that indicates whether the changes made are saved.
---
### ProjectList
A component that displays a list of projects for a user and allows them to add new projects.

#### Props:
- `setView`: A function to set the current view of the app
- `setTabValue`: A function to set the value of the current tab
- `setProject`: A function to set the current project

#### Functions:
- `handleAddProject()`: A function that creates a new project and generates a default configuration YAML file for it
- `handleChange()`: A function that handles changes to the project name input field
- `generateMultiViewConfig()`: A function that generates a default configuration YAML file for a new project

#### States:
- `numProjects`: an array of objects representing the user's projects
- `email`: A string of the email of the current user
- `projectName`: A string of the name of a new project being added
---
### ProjectView
This component renders either the ProjectList or ProjectEdit component based on the value of `view` state.
#### Props:
- `setTabValue`: a function to update the active tab value in the parent component
- `setisLogged`: a function to update the login status in the parent component

#### States:
- `view`: a string state to determine which component to render. It can have the value of either 'projectList' or 'projectEdit'.
- `project`: a state to store the currently selected project object.
---
### SettingManager

This component renders the Setting Manager that allows the user to modify settings for their application.

#### Props:
* `info`: An object containing the id of the project whose settings need to be modified.

#### Functions:
* `handleUpdateConfig()`: A function that handles the update of the multi-view configuration file.
* `handleFileReader()`: A function that handles the chosen file.
* `handleUpload()`: A function that updates a new config file.
* `handleDownload()`: A function that downloads the current config file.
* `performFileCheck()`: A function that checks if the chosen file meets the minimum requirements.

#### States:
* `multiViewConfigId`: A string of the id of the multi-view configuration file.
* `epoch`: An integer of the number of epochs for which the model is to be trained.
* `batchTrain`: An integer of the batch size for training.
* `batchTest`: An integer of the batch size for testing.
* `numWorkers`: An integer of the number of workers to be used for training.
* `numTrainFrame`: An integer of the number of frames to be used for training.
* `ratio`: A float of the ratio of frames to be used for training and testing.
* `isUpload`: A boolean that indicates whether a file is being uploaded or not.
* `Id`: A string of the id of the uploaded file.
* `file`: An object if the uploaded file.
* `FileName`: A string of the name of the uploaded file.
* `firstLoad`: A boolean that check if it is first-time loading.
* `selectedName`: A string of the name of the selected file.
* `disableUpload`: A boolean that indicates whether the upload button is disabled or not.
* `error`: A boolean that indicates whether there is an error while uploading the file or not.
---
### Signup
A component that allows users to sign up for the website. It provides an email input, a password input and two buttons, one for submitting and one for canceling the sign-up process.

#### Props:
* `setView`: A function that takes in a string as an argument and changes the view of the app to that view.

#### Functions:
* `handleChange()`: A function that takes in two arguments, type and event, and sets the values state according to the input.
* `handleClickShowPassword()`: A function that toggles the visibility of the password in the password input.
* `handleMouseDownPassword()`: A function that prevents the default action when the password input is clicked.
* `handleSignup()`: A function that sends a POST request to the server to sign up the user. It sets the error state and error message state accordingly.

#### States:
* `values`: An object that contains two properties, email and password, that store the input values for email and password.
* `showPassword`: A boolean value that indicates whether the password input is visible or not.
* `error`: A boolean value that indicates whether there is an error during the sign-up process.
* `errorMessage`: A string that stores the error message when there is an error during the sign-up process.
---
### User

This component represents the user authentication flow, it decides whether to render the login or signup view.

#### Props:
* `setTabValue`: a function to set the value of the current tab in the main navigation bar
* `setisLogged`: a function to set the logged-in status of the user

#### States:
* `view`: a string to determine the current view of the component (`login` or `signup`)
---
## Pages
All of the pages below are locaed in `src/pages`.

---

### LandingPage

This component is the main page of the application. It displays either the `User` component or the `ProjectView` component based on the value of the `tabValue` state.

#### Functions:
- `checkIsLogIn()`: A function that sends a GET request to the `/api/auth/user/` endpoint to check if the user is logged in or not.
- `handleLogout()`: A function that sends a POST request to the `/api/auth/signout/` endpoint to log out the user.
- `handleOpenLogOut()`: A function that sets the `openLogout` state to true to open the logout dialog box.
- `handleCloseLogOut()`: A function that sets the `openLogout` state to false to close the logout dialog box.

#### States:
- `isLogged`: A boolean that stores whether the user is logged in or not.
- `tabValue`: A string that stores the current tab value (`auth` or `projects`).
- `openLogout`: A boolean stores whether the logout dialog box is open or not.

---
