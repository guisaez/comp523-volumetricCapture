/**
 * Components: ProjectEdit
 * A component for editing project information, including project name, file management, settings, and deleting the project.
 * Props:
 * setView: A function to switch views.
 * project: The current project object to edit.
 * setProject: A function to set the edited project object.
 * setisLogged: A function to set the login status.
 * Functions:
 * handleSave: A function to save the changes made to the project name.
 * handleChange: A function to handle the changes made to the project name.
 * handleDelete: A function to delete the current project.
 * States:
 * info: A object of project information state that holds the current project object.
 * error: A boolean state that indicates whether there is an error with the project name.
 * errorMessage: A string of the error message to display when there is an error with the project name.
 * isSafed: A boolean state that indicates whether the changes made are saved.
*/

import * as React from 'react'
import InputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import FilledInput from '@mui/material/FilledInput'
import isEmpty from 'validator/lib/isEmpty'
import Alert from '@mui/material/Alert'
import DeleteButton from "./DeleteButton";
import FileManager from './FileManager'
import Help from './Help'
import BackButton from './BackButton'
import SettingManager from './SettingManager'

const axios = require('axios').default

function ProjectEdit({ setView, project, setProject, setisLogged, ...props }) {
    const [info, setInfo] = React.useState(project)
    const [error, setError] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState('');
    const [isSafed, setIsSafed] = React.useState(true);

    const handleSave = () => {
        axios({
            method: 'patch',
            url: '/api/projects/' + info.id,
            data: {
                projectName: info.projectName, // send updated project name to server
            }
        }).then((res) => {
            setProject(info) // update project name in app state
            setIsSafed(true) // set the saved flag to true
        }).catch((err) => {
            if (isEmpty(info.projectName)) { // check if project name is empty
                setErrorMessage("The project name must not be empty.")
                setError(true)
                setIsSafed(false) // set the saved flag to false
            }
        })
    }

    const handleChange = (type, event) => {
        if (type === 'name') { // check if the event is for changing project name
            setError((!event.target.value && error)) // set error flag if project name is empty
            setInfo({ ...info, projectName: event.target.value }) // update project name in local state
            setIsSafed(event.target.value === project.projectName) // set the saved flag based on whether the project name is the same as the original project name
        }
    }

    const handleDelete = () => {
        axios({
            method: 'delete',
            url: '/api/projects/' + info.id,
            data: {
            }
        }).then((res) => {
            setProject(res.data) // update app state with the deleted project
            setView('projectList') // go back to the project list view
        })
    }

    // Render the ProjectEdit component
    return (
        <div>
            <Stack spacing={2} style={{ margin: 16 }}>
                <Grid
                    container
                    justifyContent="left"
                    alignItems="center"
                    margin="16"
                    spacing={3}
                >
                    <Grid item>
                        {/* Project name form control */}
                        <FormControl variant="filled" width='80%'>
                            <InputLabel htmlFor="filled-adornment-project-name">Project Name:</InputLabel>
                            <FilledInput
                                id="filled-adornment-project-name"
                                startAdornment={<InputAdornment position="start"></InputAdornment>}
                                value={info.projectName}
                                onChange={(e) => {
                                    handleChange('name', e)
                                }}
                            ></FilledInput>
                        </FormControl>
                    </Grid>
                    <Grid item>
                        {/* Save project name button */}
                        <Button variant="contained" size="large" onClick={handleSave} sx={{ m: 1 }} margin="16">Save Name</Button>
                        {/* Help button */}
                        <Help helpMarkDown='https://raw.githubusercontent.com/guisaez/comp523-volumetricCapture/main/README.md' />
                    </Grid>
                </Grid>
                {error && <Alert severity="error">{errorMessage}</Alert>}

                <Grid container spacing={1} style={{ display: 'flex', direction: 'column' }} justifyContent="center"
                    alignItems="center">
                    {/* Zip File Manager*/}
                    <FileManager info={info} fileType={"zip"} format={'.zip'}></FileManager>
                    {/* Intrinsic File Manager*/}
                    <FileManager info={info} fileType={"intrinsic"} format={'.yml'}></FileManager>
                    {/* Extrinsic File Manager*/}
                    <FileManager info={info} fileType={"extrinsic"} format={'.yml'}></FileManager>
                    {/* Setting Manager*/}
                    <SettingManager info={info}></SettingManager>
                </Grid>
                <Grid
                    container
                    direction="row"
                    justifyContent="right"
                    alignItems="center"
                    margin={16}
                    spacing={1.5}>
                    {/* Delete Project Button*/}
                    <Grid item>
                        <DeleteButton onDelete={handleDelete} isDisabled={info.processStatus === 'running'} deletedThing="project" marginVar={0} size="large" buttonName='Delete Project'></DeleteButton>
                    </Grid>
                    {/* Back Button*/}
                    <BackButton setView={setView} isSafed={isSafed}></BackButton>
                </Grid>
            </Stack>
        </div>
    )

}
export default ProjectEdit