import * as React from 'react'
import Box from '@mui/material/Box'
import { styled } from "@mui/material/styles"
import InputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import CardActions from '@mui/material/CardActions'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import DeleteIcon from '@mui/icons-material/Delete'
import FilledInput from '@mui/material/FilledInput'
import ProjectList from './projectList'
import ProjectView from './projectView'
import LoadingButton from '@mui/lab/LoadingButton'
import isEmpty from 'validator/lib/isEmpty'
import Alert from '@mui/material/Alert'
//import TESTHOST from '../backend/backendAPI'

const TESTHOST = ''
const axios = require('axios').default
const Input = styled("input")({
    // display: "none"
});
function ProjectEdit({ setView, project, setProject,...props }) {
    const [numCaptures, setNumCaptures] = React.useState([])
    const [projectName, setProjectName] = React.useState(project.projectName)
    const [projectId, setProjectId] = React.useState(project.projectId)
    const [info, setInfo] = React.useState(project)
    const [error, setError] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState('');
    //const [success, setSuccess] = React.useState(false)
    //const [loading, setLoading] = React.useState(false)
    const [file,setFile] = React.useState(null)
    const [fileType, setFileType] = React.useState('')
    const [zipId, setZipId] = React.useState('')
    const [intrinsicId, setIntrinsicId] =  React.useState('')
    const [extrinsicId, setExtrinsicId] = React.useState('')
    const [zipStatus, setZipStatus] = React.useState(false)
    const [intrinsicStatus, setIntrinsicStatus] = React.useState(false)
    const [extrinsicStatus, setExtrinsicStatus] = React.useState(false)
    const [id, setId] = React.useState('')

    React.useEffect(() => {
        axios({
            method: 'get',
            url: TESTHOST + '/api/projects/' + info.id
        }).then((res) => {
            setProjectName(res.data.projectName)
        })
    }, [])
    const handleAddCapture = () => {
        // axios({
        //     method: 'post',
        //     url: TESTHOST + '/captures/createcapture/',
        //     data: {
        //         pid: info.pid,
        //         token: localStorage.getItem('token')
        //     }
        // }).then((res) => {
        //     setNumCaptures([...numCaptures, res.data])
        //     console.log(res.data)
        // })
    }


    const handleSave = () => {
        axios({
            method: 'patch',
            url: TESTHOST + '/api/projects/' + info.id,
            data: {
                projectName: info.projectName,
            }
        }).then((res) => {
            setProject(info)
            setView('projectList')
        }).catch((err) => {
            if (isEmpty(info.projectName)) {
                setErrorMessage("The project name must not be empty.")
                setError(true)
            }
        })
    }

    const handleChange = (type, event) => {
        if (type === 'name') {
            setInfo({ ...info, projectName: event.target.value })
        }
    }
    const handleCancel = () => {
        setView('projectList')
    }
    const handleZipFileReader = (event) =>{
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
        setFileType('zip');
    }
    const handleIntrinsicFileReader = (event) =>{
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
        setFileType('intrinsic');
    }
    const handleExtrinsicFileReader = (event) =>{
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
        setFileType('extrinsic');
    }
    const handleZipUpload = () => {
       //const [zipStatus, setZipStatus] = React.useState(false);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', fileType);
        axios.post(TESTHOST + '/api/files/upload/' + info.id, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },}).then((res) => {
                setZipStatus(true);
                setZipId(res.data.file.id);
                console.log(res.data.file);
                // handle success here
              })
              .catch((err) => {
                console.error(err);
                // handle error here
              });
       /*axios({
            method: 'post',
            url: TESTHOST + '/api/files/upload/' + info.id
        }).then((res) => {
            console.log('File Uploaded')
        }).catch((err) => {
            console.error(err);
            // handle error here
          });*/
    }
    const handleIntrinsicUpload = () => {
        //const [intrinsicStatus, setIntrinsicStatus] = React.useState(false);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', fileType);
        axios.post(TESTHOST + '/api/files/upload/' + info.id, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },}).then((res) => {
                setIntrinsicStatus(true);
                setIntrinsicId(res.data.file.id);
                console.log(res.data.file);
                // handle success here
              })
              .catch((err) => {
                console.error(err);
                // handle error here
              });}
    const handleExtrinsicUpload = () => {
        //const [extrinsicStatus, setExtrinsicStatus] = React.useState(false);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', fileType);
        axios.post(TESTHOST + '/api/files/upload/' + info.id, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },}).then((res) => {
                setExtrinsicStatus(true);
                setExtrinsicId(res.data.file.id);
                console.log(res.data.file);
                // handle success here
              })
              .catch((err) => {
                console.error(err);
                // handle error here
              });}
    const handleZipDelete = () =>{
        axios({
            method: 'delete',
            url: TESTHOST + '/api/files/delete',
            data: {
                projectId : info.id,
                id: zipId
            }
        }).then((res) => {
            setZipStatus(false);
        })
    }
    const handleIntrnsicDelete = () =>{
        axios({
            method: 'delete',
            url: TESTHOST + '/api/files/delete',
            data: {
                projectId : info.id,
                id: intrinsicId
            }
        }).then((res) => {
            setIntrinsicStatus(false);
        })
    }
    const handleExtrinsicDelete = () =>{
        axios({
            method: 'delete',
            url: TESTHOST + '/api/files/delete',
            data: {
                projectId : info.id,
                id: extrinsicId
            }
        }).then((res) => {
            setExtrinsicStatus(false);
        })
        //setZipStatus(false);
    }
    const handleClick = () => {
        console.log('handle click')

    }
    const handleDelete = () => {
        axios({
            method: 'delete',
            url: TESTHOST + '/api/projects/' + info.id,
            data: {
            }
        }).then((res) => {
            setProject(res.data)
            setView('projectList')
        })
    }
    return (
        <div>
            <Stack spacing={1}>
                <Box m={1} pt={1}>
                    <Grid
                        container
                        direction="column"
                        justifyContent="flex-start"
                        alignItems="center"
                        margin="auto"
                    >
                        <FormControl fullWidth sx={{ m: 1 }} variant="filled">
                            <InputLabel htmlFor="filled-adornment-project-name">Project Name:</InputLabel>
                            <FilledInput
                                id="filled-adornment-project-name"
                                startAdornment={<InputAdornment position="start"></InputAdornment>}
                                value={info.projectName}
                                onChange={(e) => {
                                    handleChange('name', e)
                                }}
                            />
                        </FormControl>
                    </Grid>
                    {error && <Alert severity="error">{errorMessage}</Alert>}
                    <Grid
                        container
                        direction="row"
                        justifyContent="flex-start"
                        spacing={1}
                        alignItems="center"
                        margin="auto"
                    >
                        <Grid item><Button variant="contained" size="large" onClick={handleSave}>Save</Button></Grid>
                        <Grid item><Button variant="outlined" size="large" onClick={handleCancel}>Cancel</Button></Grid>
                    </Grid>
                    
                    <Grid item>
                        <Card m={1} pt={1} style={{ padding: '20px 10px' ,justifyContent:"right" }}>
                            <label id={info.id} htmlFor="contained-button-file">
                                <Input
                                    accept=".zip"
                                    id="contained-button-file"
                                    type="file"
                                    onChange={handleZipFileReader}
                                />
                                <button onClick={handleZipUpload} disabled={fileType!== 'zip'}>Zip Upload</button>
                                <button onClick={handleZipDelete}>Zip Delete</button>
                                {zipStatus ? (
                                <div className="zipUploadSuccess" role="alert">
                                    Your zip file was uploaded successfully!
                                </div>
                                ) :  <div className="noZip" role="alert">
                                  You have not uploaded zip file yet!
                            </div>}
                            </label>

                        </Card>
                        <Card m={1} pt={1} style={{ padding: '20px 10px' ,justifyContent:"right" }}>
                            <label id={info.id} htmlFor="contained-button-file">
                                <Input
                                    accept=".yml"
                                    id="contained-button-file"
                                    type="file"
                                    onChange={handleIntrinsicFileReader}
                                />
                                 <button onClick={handleIntrinsicUpload} disabled={fileType!== 'intrinsic'}>Intrinsic Upload</button>
                                 <button onClick={handleIntrnsicDelete}>Intrinsic Delete</button>
                                 {intrinsicStatus ? (
                                <div className="intrinsicUploadSuccess" role="alert">
                                    Your intrinsic file was uploaded successfully!
                                </div>
                                ) : <div className="noIntrinsic" role="alert">
                                You have not uploaded intrinsic file yet!
                            </div>}
                            </label>
                        </Card>
                        <Card m={1} pt={1} style={{ padding: '20px 10px' ,justifyContent:"right" }}>
                            <label id={info.id} htmlFor="contained-button-file">
                                <Input
                                    accept=".yml"
                                    id="contained-button-file"
                                    type="file"
                                    onChange={handleExtrinsicFileReader}
                                />
                                <button onClick={handleExtrinsicUpload} disabled={fileType!== 'extrinsic'}>Extrinsic Upload</button>
                                <button onClick={handleExtrinsicDelete}>extrinsic Delete</button>
                                {extrinsicStatus ? (
                                <div className="extrinsicUploadSuccess" role="alert">
                                    Your extrinsic file was uploaded successfully!
                                </div>
                                ) :  <div className="noExtrinsic" role="alert">
                                You have not uploaded extrinsic file yet!
                            </div>}
                            </label>
                        </Card>

                        </Grid>
                    <Grid
                        container
                        direction="row"
                        justifyContent="flex-end"
                        alignItems="center"
                        margin="auto"
                    >
                        <Button variant="outlined" startIcon={<DeleteIcon />} size="large" onClick={handleDelete}>
                            Delete Project
                        </Button>
                    </Grid>
                </Box>
            </Stack>
        </div>
    )
}

function CaptureCard({ setNumCaptures, info, value, ...props }) {
    const [loading, setLoading] = React.useState(false)
    const [success, setSuccess] = React.useState(false)
    const [file, setFile] = React.useState()

    const handleClick = () => {
        if (file != null) {
            setLoading(true)
            const formData = new FormData();
            formData.append('token', localStorage.token)
            formData.append('video_file', file)
            formData.append('cid', value.cid)
            console.log(value.cid)
            axios({
                method: 'patch',
                url: TESTHOST + '/captures/editcapture/',
                data: formData
            }).then((res) => {
                console.log(res)
                setLoading(false)
                setSuccess(true)
            })
        }
    }
    const handleUpload = (e) => {
        console.log(value.cid)
        setFile(e.target.files[0])
    }
    const handleDelete = () => {
        axios({
            method: 'delete',
            url: TESTHOST + '/captures/deletecapture/',
            data: {
                token: localStorage.getItem('token'),
                cid: value.cid
            }
        }).then((res) => {
            axios({
                method: 'get',
                url: TESTHOST + '/captures/getcaptures/?token=' + localStorage.token + '&pid=' + info.pid
            }).then((res) => {
                console.log(res.data)
                setNumCaptures(res.data)
            })
        })
    }

    return (
        <Card m={1} pt={1} style={{ padding: '20px 10px' }}>
            <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                margin="auto"
            >
                <Stack>
                    <Typography gutterBottom variant='h5' component='div' sx={{ m: 1 }}>
                        Camera
                    </Typography>
                </Stack>
                <Stack direction="column" justifyContent="center" alignItems="center">
                    <Grid
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Grid item>
                            <label id={value.cid} htmlFor="contained-button-file">
                                <Input
                                    accept=".7z,.zip"
                                    id="contained-button-file"
                                    type="file"
                                    onChange={handleUpload}
                                />
                            </label>
                            {success ? <Button variant="contained" style={{ margin: 16, backgroundColor: '#21d284' }}
                                size="small" component="span">Success</Button> :
                                <LoadingButton loading={loading} variant='contained' style={{ margin: 16 }} size="small"
                                    component="span" onClick={handleClick}>Upload Zip</LoadingButton>}
                        </Grid>
                        <Grid item><Button disabled variant='contained' style={{ margin: 16 }} size="small">Upload Point
                            Cloud</Button></Grid>
                    </Grid>
                    <Grid
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Button variant="outlined" style={{ margin: 16 }} size="small" disabled>Download</Button>
                        <Button variant="outlined" style={{ margin: 16 }} startIcon={<DeleteIcon />} onClick={handleDelete}
                            size="small">
                            Remove Capture
                        </Button>
                    </Grid>
                </Stack>
            </Grid>
        </Card>
    )
}


export default ProjectEdit
