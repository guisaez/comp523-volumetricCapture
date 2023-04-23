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
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import ReactMarkdown from 'react-markdown';
import DeleteButton from "./deleteButton";

//import TESTHOST from '../backend/backendAPI'

const TESTHOST = ''
const axios = require('axios').default
const Input = styled("input")({
    // display: "none"
});
function ProjectEdit({ setView, project, setProject, ...props }) {
    const [info, setInfo] = React.useState(project)
    const [error, setError] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState('');
    const [openHelp, setOpenHelp] = React.useState(false);
    const [markdown, setMarkdown] = React.useState('');


    const handleOpenHelp = () => {

        axios({
            method: 'get',
            url: 'https://raw.githubusercontent.com/guisaez/comp523-volumetricCapture/main/README.md'
        }).then((response) => {
            console.log(response.data)
            setMarkdown(response.data)
        }
        ).catch(error => console.error(error));
        setOpenHelp(true);
    };

    const handleCloseHelp = () => {
        setOpenHelp(false);
    };

    //zip
    const [zipId, setZipId] = React.useState('')
    const [zipFile, setZipFile] = React.useState(null)
    const [zipButtonName, setZipButtonName] = React.useState('')
    const [zipFileName, setZipFileName] = React.useState('None')
    const zipRef = React.useRef(null)
    const [selectedZipName, setSelectedZipName] = React.useState('None')
    const [disableZipUpload, setDisableZipUpload] = React.useState(true)
    const [disableZipDelete, setDisableZipDelete] = React.useState(true)

    //intrinsic
    const [intrinsicId, setIntrinsicId] = React.useState('')
    const [intrinsicFile, setIntrinsicFile] = React.useState(null)
    const [intrinsicButtonName, setIntrinsicButtonName] = React.useState('')
    const [intrinsicFileName, setIntrinsicFileName] = React.useState('None')
    const intrinsicRef = React.useRef(null)
    const [selectedIntrinsicName, setSelectedIntrinsicName] = React.useState('None')
    const [disableIntrinsicUpload, setDisableIntrinsicUpload] = React.useState(true)
    const [disableIntrinsicDelete, setDisableIntrinsicDelete] = React.useState(true)

    //extrinsic
    const [extrinsicId, setExtrinsicId] = React.useState('')
    const [extrinsicFile, setExtrinsicFile] = React.useState(null)
    const [extrinsicButtonName, setExtrinsicButtonName] = React.useState('')
    const [extrinsicFileName, setExtrinsicFileName] = React.useState('None')
    const extrinsicRef = React.useRef(null)
    const [selectedExtrinsicName, setSelectedExtrinsicName] = React.useState('None')
    const [disableExtrinsicUpload, setDisableExtrinsicUpload] = React.useState(true)
    const [disableExtrinsicDelete, setDisableExtrinsicDelete] = React.useState(true)


    React.useEffect(() => {
        axios({
            method: 'get',
            url: TESTHOST + '/api/projects/' + info.id
        }).then((res) => {
            //initialize zip
            if (res.data.project.zip_fileId) {
                setZipButtonName('Update Zip')
                console.log(res.data.project.zip_fileId)
                setZipId(res.data.project.zip_fileId)
                axios({
                    method: 'get',
                    url: TESTHOST + '/api/files/' + res.data.project.zip_fileId
                }).then((res) => {
                    setZipFileName(res.data.file.name)
                })
            } else {
                setZipButtonName('Upload Zip')
            }

            //initialize intrinsic
            if (res.data.project.intrinsic_fileId) {
                setIntrinsicButtonName('Update Intrinsic')
                setIntrinsicId(res.data.project.intrinsic_fileId)
                axios({
                    method: 'get',
                    url: TESTHOST + '/api/files/' + res.data.project.intrinsic_fileId
                }).then((res) => {
                    setIntrinsicFileName(res.data.file.name)
                })
            } else {
                setIntrinsicButtonName('Upload Intrinsic')
            }

            //initialize extrinsic           
            if (res.data.project.extrinsic_fileId) {
                setExtrinsicButtonName('Update Extrinsic')
                setExtrinsicId(res.data.project.extrinsic_fileId)
                axios({
                    method: 'get',
                    url: TESTHOST + '/api/files/' + res.data.project.extrinsic_fileId
                }).then((res) => {
                    setExtrinsicFileName(res.data.file.name)
                })
            } else {
                setExtrinsicButtonName('Upload Extrinsic')
            }




            setDisableZipDelete(!res.data.project.zip_fileId)
            setDisableIntrinsicDelete(!res.data.project.intrinsic_fileId)
            setDisableExtrinsicDelete(!res.data.project.extrinsic_fileId)
        })
    }, [])

    const handleSave = () => {
        axios({
            method: 'patch',
            url: TESTHOST + '/api/projects/' + info.id,
            data: {
                projectName: info.projectName,
            }
        }).then((res) => {
            setProject(info)
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
    const handleZipFileReader = (event) => {
        const selectedFile = event.target.files[0];
        setZipFile(selectedFile);
        setSelectedZipName(selectedFile.name)
        setDisableZipUpload(false);
    }
    const handleIntrinsicFileReader = (event) => {
        const selectedFile = event.target.files[0];
        setIntrinsicFile(selectedFile);
        setSelectedIntrinsicName(selectedFile.name)
        setDisableIntrinsicUpload(false);

    }
    const handleExtrinsicFileReader = (event) => {
        const selectedFile = event.target.files[0];
        setExtrinsicFile(selectedFile);
        setSelectedExtrinsicName(selectedFile.name)
        setDisableExtrinsicUpload(false);

    }
    const handleZipUpload = () => {
        const formData = new FormData();
        formData.append('file', zipFile);
        formData.append('type', 'zip');
        if (zipButtonName == 'Upload Zip') {
            const route = '/api/files/upload/' + info.id;
            console.log(route);
            axios.post(TESTHOST + route, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then((res) => {
                setZipId(res.data.file.id);
                setDisableZipUpload(true);
                setDisableZipDelete(false);
                setZipButtonName('Update Zip');
                setZipFileName(res.data.file.name)
                console.log(zipId);
                setZipFile(null);
                zipRef.current.value = null;
                setSelectedZipName("None")
            })
                .catch((err) => {
                    console.error(err);
                    setDisableZipUpload(false);
                });

        } else if (zipButtonName == 'Update Zip') {
            const route = '/api/files/update/' + zipId;
            console.log(route);
            axios.put(TESTHOST + route, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then((res) => {
                setZipId(res.data.file.id);
                setDisableZipUpload(true);
                setDisableZipDelete(false);
                setZipButtonName('Update Zip');
                setZipFileName(res.data.file.name)
                console.log(zipId);
                setZipFile(null);
                zipRef.current.value = null;
                setSelectedZipName("None")
            })
                .catch((err) => {
                    console.error(err);
                    setDisableZipUpload(false);
                });
        }
    }
    const handleIntrinsicUpload = () => {
        const formData = new FormData();
        formData.append('file', intrinsicFile);
        formData.append('type', 'intrinsic');
        if (intrinsicButtonName == 'Upload Intrinsic') {
            const route = '/api/files/upload/' + info.id;
            console.log(route);
            axios.post(TESTHOST + route, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then((res) => {
                setIntrinsicId(res.data.file.id);
                setDisableIntrinsicUpload(true);
                setDisableIntrinsicDelete(false);
                setIntrinsicButtonName('Update Intrinsic');
                setIntrinsicFileName(res.data.file.name)
                console.log(zipId);
                setIntrinsicFile(null);
                intrinsicRef.current.value = null;
                setSelectedIntrinsicName("None")
            })
                .catch((err) => {
                    console.error(err);
                    setDisableIntrinsicUpload(false);
                });

        } else if (intrinsicButtonName == 'Update Intrinsic') {
            const route = '/api/files/update/' + intrinsicId;
            console.log(route);
            axios.put(TESTHOST + route, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then((res) => {
                setIntrinsicId(res.data.file.id);
                setDisableIntrinsicUpload(true);
                setDisableIntrinsicDelete(false);
                setIntrinsicButtonName('Update Intrinsic');
                setIntrinsicFileName(res.data.file.name)
                console.log(intrinsicId);
                setIntrinsicFile(null);
                intrinsicRef.current.value = null;
                setSelectedIntrinsicName("None")
            })
                .catch((err) => {
                    console.error(err);
                    setDisableIntrinsicUpload(false);
                });
        }
    }
    const handleExtrinsicUpload = () => {
        const formData = new FormData();
        formData.append('file', extrinsicFile);
        formData.append('type', 'extrinsic');
        if (extrinsicButtonName == 'Upload Extrinsic') {
            const route = '/api/files/upload/' + info.id;
            console.log(route);
            axios.post(TESTHOST + route, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then((res) => {
                setExtrinsicId(res.data.file.id);
                setDisableExtrinsicUpload(true);
                setDisableExtrinsicDelete(false);
                setExtrinsicButtonName('Update Extrinsic');
                setExtrinsicFileName(res.data.file.name)
                setExtrinsicFile(null);
                extrinsicRef.current.value = null;
                setSelectedExtrinsicName("None")
            })
                .catch((err) => {
                    console.error(err);
                    setDisableExtrinsicUpload(false);
                });

        } else if (extrinsicButtonName == 'Update Extrinsic') {
            const route = '/api/files/update/' + extrinsicId;
            console.log(route);
            axios.put(TESTHOST + route, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then((res) => {
                setExtrinsicId(res.data.file.id);
                setDisableExtrinsicUpload(true);
                setDisableExtrinsicDelete(false);
                setExtrinsicButtonName('Update Extrinsic');
                setExtrinsicFileName(res.data.file.name)
                console.log(extrinsicId);
                setExtrinsicFile(null);
                extrinsicRef.current.value = null;
                setSelectedExtrinsicName("None")
            })
                .catch((err) => {
                    console.error(err);
                    setDisableExtrinsicUpload(false);
                });
        }
    }
    const handleZipDelete = () => {
        axios({
            method: 'delete',
            url: TESTHOST + '/api/files/delete',
            data: {
                projectId: info.id,
                id: zipId
            }
        }).then((res) => {
            setDisableZipDelete(true);
            setZipButtonName('Upload Zip');
            setDisableZipUpload(!zipFile);
            setZipFileName("None")
        }).catch((err) => {
        })
    }
    const handleIntrinsicDelete = () => {
        axios({
            method: 'delete',
            url: TESTHOST + '/api/files/delete',
            data: {
                projectId: info.id,
                id: intrinsicId
            }
        }).then((res) => {
            setDisableIntrinsicDelete(true);
            setIntrinsicButtonName('Upload Intrinsic');
            setDisableIntrinsicUpload(!intrinsicFile);
            setIntrinsicFileName("None")
        }).catch((err) => {
        })
    }
    const handleExtrinsicDelete = () => {
        axios({
            method: 'delete',
            url: TESTHOST + '/api/files/delete',
            data: {
                projectId: info.id,
                id: extrinsicId
            }
        }).then((res) => {
            setDisableExtrinsicDelete(true);
            setExtrinsicButtonName('Upload Extrinsic');
            setDisableExtrinsicUpload(!extrinsicFile);
            setExtrinsicFileName("None")
        })
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

    const handleDownload = (id, fileName) => {
        console.log('/api/files/download/' + id)
        axios({
            method: 'get',
            url: TESTHOST + '/api/files/download/' + id,
            responseType: 'blob'
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
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
                        <Button variant="outlined" onClick={handleOpenHelp} size="large">Help</Button>
                        <Dialog open={openHelp} onClose={handleCloseHelp}>
                            <DialogContent>
                                <Button className="close-btn" onClick={handleCloseHelp} size="small" variant="contained" style={{ margin: 16, position: 'absolute', top: 5, right: 5, backgroundColor: 'red' }}>
                                    X
                                </Button>
                                <ReactMarkdown>{markdown}</ReactMarkdown>
                            </DialogContent>
                        </Dialog>
                    </Grid></Grid>
                {error && <Alert severity="error">{errorMessage}</Alert>}

                <Grid container spacing={1} style={{ display: 'flex', direction: 'column' }} justifyContent="flex-end"
                    alignItems="center"
                >
                    <Grid item xs={20} md={4}>
                        <Card style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start' }}>
                            <Stack spacing={5}>
                                <CardContent>
                                    <Typography gutterBottom variant='h5' component='div'>
                                        Zip File
                                    </Typography>
                                    <Typography variant='body2' color='text.secondary'>
                                        {'Uploaded Zip File is ' + zipFileName}
                                    </Typography>
                                    <Typography variant='body2' color='text.secondary'>
                                        {'Chosen File is ' + selectedZipName}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Stack spacing={1}>
                                        <div>
                                            <Button variant="contained" component="label" style={{ margin: 8 }}>
                                                Choose Zip
                                                <input hidden
                                                    accept=".zip"
                                                    id="zip-upload"
                                                    type="file"
                                                    onChange={handleZipFileReader}
                                                    style={{ display: 'none' }}
                                                    ref={zipRef}
                                                />
                                            </Button>

                                            <Button onClick={handleZipUpload} variant="contained" disabled={(disableZipUpload)} style={{ margin: 8 }}>{zipButtonName}</Button>
                                        </div>
                                        <div>
                                            <DeleteButton onDelete={handleZipDelete} marginVar={8} isDisabled={disableZipDelete} deletedThing="zip file" size="medium" buttonName='Delete Zip'></DeleteButton>
                                            <Button onClick={(e) => { handleDownload(zipId, zipFileName) }} variant="outlined" style={{ margin: 8 }} disabled={zipFileName == 'None'}>Download Zip</Button>

                                        </div>
                                    </Stack>
                                </CardActions>
                            </Stack>
                        </Card>
                    </Grid>
                    <Grid item xs={20} md={4}>
                        <Card style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start' }}>
                            <Stack spacing={5}>
                                <CardContent>
                                    <Typography gutterBottom variant='h5' component='div'>
                                        Intrinsic File
                                    </Typography>
                                    <Typography variant='body2' color='text.secondary'>
                                        {'Uploaded Intrinsic File is ' + intrinsicFileName}
                                    </Typography>
                                    <Typography variant='body2' color='text.secondary'>
                                        {'Chosen File is ' + selectedIntrinsicName}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Stack spacing={1}>
                                        <div>
                                            <Button variant="contained" component="label" style={{ margin: 8 }}>
                                                Choose Intrinsic
                                                <input hidden
                                                    accept=".yml"
                                                    id="yml-upload"
                                                    type="file"
                                                    onChange={handleIntrinsicFileReader}
                                                    style={{ display: 'none' }}
                                                    ref={intrinsicRef}
                                                />
                                            </Button>

                                            <Button onClick={handleIntrinsicUpload} variant="contained" disabled={(disableIntrinsicUpload)} style={{ margin: 8 }}>{intrinsicButtonName}</Button>
                                        </div>
                                        <div>
                                            <DeleteButton onDelete={handleIntrinsicDelete} marginVar={8} isDisabled={disableIntrinsicDelete} deletedThing="intrinsic file" size="medium" buttonName='Delete Intrinsic'></DeleteButton>
                                            <Button onClick={(e) => { handleDownload(intrinsicId, intrinsicFileName) }} variant="outlined" style={{ margin: 8 }} disabled={intrinsicFileName == 'None'}>Download Intrinsic</Button>
                                        </div>
                                    </Stack>
                                </CardActions>
                            </Stack>
                        </Card>
                    </Grid>
                    <Grid item xs={20} md={4}>
                        <Card style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start' }}>
                            <Stack spacing={5}>
                                <CardContent>
                                    <Typography gutterBottom variant='h5' component='div'>
                                        Extrinsic File
                                    </Typography>
                                    <Typography variant='body2' color='text.secondary'>
                                        {'Uploaded Extrinsic File is ' + extrinsicFileName}
                                    </Typography>
                                    <Typography variant='body2' color='text.secondary'>
                                        {'Chosen File is ' + selectedExtrinsicName}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Stack spacing={1}>
                                        <div>
                                            <Button variant="contained" component="label" style={{ margin: 8 }}>
                                                Choose Extrinsic
                                                <input hidden
                                                    accept=".yml"
                                                    id="yml-upload"
                                                    type="file"
                                                    onChange={handleExtrinsicFileReader}
                                                    style={{ display: 'none' }}
                                                    ref={extrinsicRef}
                                                />
                                            </Button>

                                            <Button onClick={handleExtrinsicUpload} variant="contained" disabled={(disableExtrinsicUpload)} style={{ margin: 8 }}>{extrinsicButtonName}</Button>
                                        </div>
                                        <div>
                                            <DeleteButton onDelete={handleExtrinsicDelete} marginVar={8} isDisabled={disableExtrinsicDelete} deletedThing="extrinsic file" size="medium" buttonName='Delete Extrinsic'></DeleteButton>
                                            <Button onClick={(e) => { handleDownload(extrinsicId, extrinsicFileName) }} variant="outlined" style={{ margin: 8 }} disabled={extrinsicFileName == 'None'}>Download Extrinsic</Button>
                                        </div>
                                    </Stack>
                                </CardActions>
                            </Stack>
                        </Card>
                    </Grid>
                </Grid>
                <Grid
                    container
                    direction="row"
                    justifyContent="right"
                    alignItems="center"
                    margin={16}
                    spacing={1.5}
                ><Grid item>
                        <DeleteButton onDelete={handleDelete} isDisabled={false} deletedThing="project" marginVar={0} size="large" buttonName='Delete Project'></DeleteButton>
                    </Grid><Grid item>
                        <Button variant="contained" size="large" onClick={handleCancel}>Back</Button>
                    </Grid></Grid>
            </Stack>
        </div>
    )
}
export default ProjectEdit