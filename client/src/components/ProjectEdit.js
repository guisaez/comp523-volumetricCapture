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
                projectName: info.projectName,
            }
        }).then((res) => {
            setProject(info)
            setIsSafed(true)
        }).catch((err) => {
            if (isEmpty(info.projectName)) {
                setErrorMessage("The project name must not be empty.")
                setError(true)
                setIsSafed(false)
            }
        })
    }

    const handleChange = (type, event) => {
        if (type === 'name') {
            setError((!event.target.value && error))
            setInfo({ ...info, projectName: event.target.value })
            setIsSafed(event.target.value === project.projectName)
        }
    }

    const handleDelete = () => {
        axios({
            method: 'delete',
            url: '/api/projects/' + info.id,
            data: {
            }
        }).then((res) => {
            setProject(res.data)
            setView('projectList')
        })
    }

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
                        <FormControl variant="filled" width='80%'>
                            <InputLabel htmlFor="filled-adornment-project-name">Project Name:</InputLabel>
                            <FilledInput
                                id="filled-adornment-project-name"
                                startAdornment={<InputAdornment position="start"></InputAdornment>}
                                value={info.projectName}
                                onChange={(e) => {
                                    handleChange('name', e)
                                }}></FilledInput>

                        </FormControl>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" size="large" onClick={handleSave} sx={{ m: 1 }} margin="16">Save Name</Button>
                        <Help helpMarkDown='https://raw.githubusercontent.com/guisaez/comp523-volumetricCapture/main/README.md' />
                    </Grid>

                </Grid>
                {error && <Alert severity="error">{errorMessage}</Alert>}

                <Grid container spacing={1} style={{ display: 'flex', direction: 'column' }} justifyContent="center"
                    alignItems="center"
                >
                    <FileManager info={info} fileType={"zip"} format={'.zip'}></FileManager>
                    <FileManager info={info} fileType={"intrinsic"} format={'.yml'}></FileManager>
                    <FileManager info={info} fileType={"extrinsic"} format={'.yml'}></FileManager>
                    <SettingManager info={info}></SettingManager>
                </Grid>
                <Grid
                    container
                    direction="row"
                    justifyContent="right"
                    alignItems="center"
                    margin={16}
                    spacing={1.5}
                >
                    <Grid item>
                        <DeleteButton onDelete={handleDelete} isDisabled={false} deletedThing="project" marginVar={0} size="large" buttonName='Delete Project'></DeleteButton>
                    </Grid>
                    <BackButton setView={setView} isSafed={isSafed}></BackButton>
                </Grid>
            </Stack>
        </div>
    )

}
export default ProjectEdit