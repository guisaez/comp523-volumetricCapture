import * as React from 'react'
import InputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import CardActions from '@mui/material/CardActions'
import Typography from '@mui/material/Typography'
import FilledInput from '@mui/material/FilledInput'
import isEmpty from 'validator/lib/isEmpty'
import Alert from '@mui/material/Alert'
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import ReactMarkdown from 'react-markdown';
import DeleteButton from "./deleteButton";
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
const axios = require('axios').default

function ProjectEdit({ setView, project, setProject, setisLogged, ...props }) {
    const [info, setInfo] = React.useState(project)
    const [error, setError] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState('');
    const [openHelp, setOpenHelp] = React.useState(false);
    const [markdown, setMarkdown] = React.useState('');
    const [isSafed, setIsSafed] = React.useState(true);
    const [openBack, setOpenBack] = React.useState(false);

    const handleOpenHelp = () => {

        axios({
            method: 'get',
            url: 'https://raw.githubusercontent.com/guisaez/comp523-volumetricCapture/main/README.md'
        }).then((response) => {
            setMarkdown(response.data)
        }
        ).catch(error => console.error(error));
        setOpenHelp(true);
    };

    const handleCloseHelp = () => {
        setOpenHelp(false);
    };

    const handleCloseBack = () => {
        setOpenBack(false);
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

    //multi_view_config
    const [multiViewConfigId, setMultiViewConfigId] = React.useState('')
    const [multiViewConfigFile, setMultiViewConfigFile] = React.useState(null)
    const [multiViewConfigButtonName, setMultiViewConfigButtonName] = React.useState('')
    const [multiViewConfigFileName, setMultiViewConfigFileName] = React.useState('None')
    const multiViewConfigRef = React.useRef(null)
    const [selectedMultiViewConfigName, setSelectedMultiViewConfigName] = React.useState('None')
    const [disableMultiViewConfigUpload, setDisableMultiViewConfigUpload] = React.useState(true)
    const [disableMultiViewConfigDelete, setDisableMultiViewConfigDelete] = React.useState(true)


    React.useEffect(() => {
        axios({
            method: 'get',
            url: '/api/projects/' + info.id
        }).then((res) => {
            //initialize zip
            if (res.data.project.zip_fileId) {
                setZipButtonName('Update Zip')
                setZipId(res.data.project.zip_fileId)
                axios({
                    method: 'get',
                    url: '/api/files/' + res.data.project.zip_fileId
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
                    url: '/api/files/' + res.data.project.intrinsic_fileId
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
                    url: '/api/files/' + res.data.project.extrinsic_fileId
                }).then((res) => {
                    setExtrinsicFileName(res.data.file.name)
                })
            } else {
                setExtrinsicButtonName('Upload Extrinsic')
            }

            //initialize multi_view_config           
            if (res.data.project.multi_view_fileId) {
                setMultiViewConfigButtonName('Update MultiViewConfig')
                setMultiViewConfigId(res.data.project.multi_view_fileId)
                axios({
                    method: 'get',
                    url: '/api/files/' + res.data.project.multi_view_fileId
                }).then((res) => {
                    setMultiViewConfigFileName(res.data.file.name)
                })
            } else {
                setMultiViewConfigButtonName('Upload MultiViewConfig')
            }

            setDisableZipDelete(!res.data.project.zip_fileId)
            setDisableIntrinsicDelete(!res.data.project.intrinsic_fileId)
            setDisableExtrinsicDelete(!res.data.project.extrinsic_fileId)
            setDisableMultiViewConfigDelete(!res.data.project.multi_view_fileId)
        })
    }, [])

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
            setIsSafed(event.target.value == project.projectName)
        }
    }
    const handleBack = () => {
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
    const handleMultiConfigFileReader = (event) => {
        const selectedFile = event.target.files[0];
        setMultiViewConfigFile(selectedFile);
        setMultiViewConfigFileName(selectedFile.name)
        setDisableMultiViewConfigUpload(false);
    }

    const handleZipUpload = () => {
        const formData = new FormData();
        formData.append('file', zipFile);
        formData.append('type', 'zip');
        if (zipButtonName == 'Upload Zip') {
            const route = '/api/files/upload/' + info.id;
            axios.post(route, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then((res) => {
                setZipId(res.data.file.id);
                setDisableZipUpload(true);
                setDisableZipDelete(false);
                setZipButtonName('Update Zip');
                setZipFileName(res.data.file.name)
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
            axios.put(route, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then((res) => {
                setZipId(res.data.file.id);
                setDisableZipUpload(true);
                setDisableZipDelete(false);
                setZipButtonName('Update Zip');
                setZipFileName(res.data.file.name)
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
            axios.post(route, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then((res) => {
                setIntrinsicId(res.data.file.id);
                setDisableIntrinsicUpload(true);
                setDisableIntrinsicDelete(false);
                setIntrinsicButtonName('Update Intrinsic');
                setIntrinsicFileName(res.data.file.name)
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
            axios.put(route, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then((res) => {
                setIntrinsicId(res.data.file.id);
                setDisableIntrinsicUpload(true);
                setDisableIntrinsicDelete(false);
                setIntrinsicButtonName('Update Intrinsic');
                setIntrinsicFileName(res.data.file.name)
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
            axios.post(route, formData, {
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
            axios.put(route, formData, {
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
        }
    }

    const handleMultiViewConfigUpload = () => {
        const formData = new FormData();
        formData.append('file', multiViewConfigFile);
        formData.append('type', 'multi_view_config');
        if (multiViewConfigButtonName == 'Upload MultiViewConfig') {
            const route = '/api/files/upload/' + info.id;
            axios.post(route, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then((res) => {
                setMultiViewConfigId(res.data.file.id);
                setDisableMultiViewConfigUpload(true);
                setDisableMultiViewConfigUpload(false);
                setMultiViewConfigButtonName('Update MultiViewConfig');
                setMultiViewConfigFileName(res.data.file.name)
                setMultiViewConfigFile(null);
                multiViewConfigRef.current.value = null;
                setSelectedMultiViewConfigName("None")
            })
                .catch((err) => {
                    console.error(err);
                    setDisableMultiViewConfigUpload(false);
                });

        } else if (multiViewConfigButtonName == 'Update MultiViewConfig') {
            const route = '/api/files/update/' + multiViewConfigId;
            axios.put(route, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then((res) => {
                setMultiViewConfigId(res.data.file.id);
                setDisableMultiViewConfigUpload(true);
                setDisableMultiViewConfigDelete(false);
                setMultiViewConfigButtonName('Update MultiViewConfig');
                setMultiViewConfigFileName(res.data.file.name)
                setMultiViewConfigFile(null);
               multiViewConfigRef.current.value = null;
                setSelectedMultiViewConfigName("None")
            })
                .catch((err) => {
                    console.error(err);
                    setDisableMultiViewConfigUpload(false);
                });
        }
    }

    const handleZipDelete = () => {
        axios({
            method: 'delete',
            url: '/api/files/delete',
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
            url: '/api/files/delete',
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
            url: '/api/files/delete',
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

    const handleMultiConfigViewDelete = () => {
        axios({
            method: 'delete',
            url: '/api/files/delete',
            data: {
                projectId: info.id,
                id: multiViewConfigId
            }
        }).then((res) => {
            setDisableMultiViewConfigDelete(true);
            setMultiViewConfigButtonName('Upload Extrinsic');
            setDisableMultiViewConfigUpload(!extrinsicFile);
            setMultiViewConfigFileName("None")
        })
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

    const handleDownload = (id, fileName) => {
        axios({
            method: 'get',
            url: '/api/files/download/' + id,
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

    const handleOpenBack = () => {
        if (!isSafed)
            setOpenBack(!isSafed);
        else
            handleBack();
    };

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
                            <DialogTitle>Help</DialogTitle>
                            <DialogContent>
                                <Button className="close-btn" onClick={handleCloseHelp} size="small" variant="contained" style={{ margin: 16, position: 'absolute', top: 5, right: 5, backgroundColor: 'red' }}>
                                    X
                                </Button>
                                <ReactMarkdown>{markdown}</ReactMarkdown>
                            </DialogContent>
                        </Dialog>
                    </Grid></Grid>
                {error && <Alert severity="error">{errorMessage}</Alert>}

                <Grid container spacing={1} style={{ display: 'flex', direction: 'column' }} justifyContent="center"
                    alignItems="center"
                >
                    <Grid item xs={6}>
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
                                            <Button variant="outlined" component="label" style={{ margin: 8 }}>
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
                    <Grid item xs={6}>
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
                                            <Button variant="outlined" component="label" style={{ margin: 8 }}>
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
                    <Grid item xs={6}>
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
                                            <Button variant="outlined" component="label" style={{ margin: 8 }}>
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
                    <Grid item xs={6}>
                        <Card style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start' }}>
                            <Stack spacing={5}>
                                <CardContent>
                                    <Typography gutterBottom variant='h5' component='div'>
                                        MultiViewConfig File
                                    </Typography>
                                    <Typography variant='body2' color='text.secondary'>
                                        {'Uploaded MultiConfigView File is ' + multiViewConfigFileName}
                                    </Typography>
                                    <Typography variant='body2' color='text.secondary'>
                                        {'Chosen File is ' + selectedMultiViewConfigName}
                                    </Typography>
                                    <Typography variant='body2' color='text.secondary'>
                                        {'ProjectId to add to configuration: ' + info.id}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Stack spacing={1}>
                                        <div>
                                            <Button variant="outlined" component="label" style={{ margin: 8 }}>
                                                Choose MultiConfigView
                                                <input hidden
                                                    accept=".yml"
                                                    id="yml-upload"
                                                    type="file"
                                                    onChange={handleMultiConfigFileReader}
                                                    style={{ display: 'none' }}
                                                    ref={multiViewConfigRef}
                                                />
                                            </Button>

                                            <Button onClick={handleMultiViewConfigUpload} variant="contained" disabled={(disableMultiViewConfigUpload)} style={{ margin: 8 }}>{multiViewConfigButtonName}</Button>
                                        </div>
                                        <div>
                                            <DeleteButton onDelete={handleMultiConfigViewDelete} marginVar={8} isDisabled={disableMultiViewConfigDelete} deletedThing="MultiConfigView file" size="medium" buttonName='Delete MultiConfigView'></DeleteButton>
                                            <Button onClick={(e) => { handleDownload(multiViewConfigId, multiViewConfigFileName) }} variant="outlined" style={{ margin: 8 }} disabled={multiViewConfigFileName == 'None'}>Download MultiConfigView</Button>
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
                >
                    <Grid item>
                        <DeleteButton onDelete={handleDelete} isDisabled={false} deletedThing="project" marginVar={0} size="large" buttonName='Delete Project'></DeleteButton>
                    </Grid>
                    <Grid item>
                        <Button variant="outlined" onClick={handleOpenBack} size="large">Back</Button>
                        <Dialog open={openBack} onClose={handleCloseBack}>
                            <DialogTitle>Confirmation</DialogTitle>
                            <DialogContent>
                                <Typography variant='body2' color='black'>
                                    {'Are you sure you want to disgard the name change?'}
                                </Typography>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseBack} variant="contained" color="primary">
                                    Cancel
                                </Button>
                                <Button onClick={handleBack} variant="contained" style={{ backgroundColor: 'red', color: 'white' }}>
                                    Continue
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Grid>
                </Grid>
            </Stack>
        </div>
    )
}
export default ProjectEdit