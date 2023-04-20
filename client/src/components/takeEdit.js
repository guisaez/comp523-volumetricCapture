import * as React from 'react'
import {styled} from "@mui/material/styles"
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import FilledInput from '@mui/material/FilledInput'
import Typography from '@mui/material/Typography'
import DeleteIcon from '@mui/icons-material/Delete'
import LoadingButton from '@mui/lab/LoadingButton'
import TESTHOST from '../backend/backendAPI'

const axios = require('axios').default

const Input = styled("input")({
    // display: "none"
});

function TakeEdit({setView, take, setTake, ...props}) {
    const [numCaptures, setNumCaptures] = React.useState([])
    const [info, setInfo] = React.useState(take)
    React.useEffect(() => {
        axios({
            method: 'get',
            url: TESTHOST + '/captures/getcaptures/?token=' + localStorage.token + '&tid=' + info.tid
        }).then((res) => {
            console.log(res.data)
            setNumCaptures(res.data)
        })
    }, [])
    const handleAddCapture = () => {
        axios({
            method: 'post',
            url: TESTHOST + '/captures/createcapture/',
            data: {
                tid: info.tid,
                token: localStorage.getItem('token')
            }
        }).then((res) => {
            setNumCaptures([...numCaptures, res.data])
            console.log(res.data)
        })
    }

    const handleChange = (type, event) => {
        if (type === 'name') {
            setInfo({...info, take_name: event.target.value})
        } else if (type === 'description') {
            setInfo({...info, description: event.target.value})
        }
    }

    const handleSave = () => {
        axios({
            method: 'patch',
            url: TESTHOST + '/takes/edittake/',
            data: {
                take_name: info.take_name,
                description: info.description,
                token: localStorage.getItem('token'),
                tid: info.tid
            }
        }).then((res) => {
            setTake(info)
            setView('sceneEdit')
        })
    }
    const handleCancel = () => {
        setView('sceneEdit')
    }
    const handleDelete = () => {
        axios({
            method: 'delete',
            url: TESTHOST + '/takes/deletetake/',
            data: {
                token: localStorage.getItem('token'),
                tid: info.tid
            }
        }).then((res) => {
            setTake(info)
            console.log(res.data)
            setView('sceneEdit')
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
                        <FormControl fullWidth sx={{m: 1}} variant="filled">
                            <InputLabel htmlFor="filled-adornment-take-name">Take Name:</InputLabel>
                            <FilledInput
                                id="filled-adornment-take-name"
                                startAdornment={<InputAdornment position="start"></InputAdornment>}
                                value={info.take_name}
                                onChange={(e) => {
                                    handleChange('name', e)
                                }}
                            />
                        </FormControl>
                        <FormControl fullWidth sx={{m: 1}} variant="filled">
                            <InputLabel htmlFor="filled-adornment-take-description">Take Description:</InputLabel>
                            <FilledInput
                                id="filled-adornment-take-description"
                                startAdornment={<InputAdornment position="start"></InputAdornment>}
                                multiline
                                rows={4}
                                value={info.description}
                                onChange={(e) => {
                                    handleChange('description', e)
                                }}
                            />
                        </FormControl>
                    </Grid>
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
                    <Grid
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        margin="auto"
                    >
                        <Grid item><Typography gutterBottom variant='h5' component='div' sx={{m: 1}}>
                            Captures
                        </Typography></Grid>
                        <Grid item><Button variant='contained' style={{margin: 16}} size="large"
                                           onClick={handleAddCapture}>+ New Capture</Button>
                            <Button variant='contained' style={{margin: 16}} size="large">Upload Audio</Button>
                            <Button variant='contained' style={{margin: 16}} size="large">Submit Job</Button></Grid>
                    </Grid>
                    <Grid container spacing={1} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        padding: '30px 30px'
                    }}>
                        {numCaptures && numCaptures.map((value) => (
                            <CaptureCard key={value.cid} value={value} setNumCaptures={setNumCaptures} info={info}/>
                        ))}
                    </Grid>
                    <Grid
                        container
                        direction="row"
                        justifyContent="flex-end"
                        alignItems="center"
                        margin="auto"
                    >
                        <Button variant="outlined" startIcon={<DeleteIcon/>} size="large" onClick={handleDelete}
                                style={{marginTop: '3%'}}>
                            Delete Take
                        </Button>
                    </Grid>
                </Box>
            </Stack>
        </div>
    )
}

function CaptureCard({setNumCaptures, info, value, ...props}) {
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
                url: TESTHOST + '/captures/getcaptures/?token=' + localStorage.token + '&tid=' + info.tid
            }).then((res) => {
                console.log(res.data)
                setNumCaptures(res.data)
            })
        })
    }

    return (
        <Card m={1} pt={1} style={{padding: '20px 10px'}}>
            <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                margin="auto"
            >
                <Stack>
                    <Typography gutterBottom variant='h5' component='div' sx={{m: 1}}>
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
                                    // original 
                                    //accept="video/*"
                                    //
                                    accept=".7z,.zip"
                                    id="contained-button-file"
                                    type="file"
                                    onChange={handleUpload}
                                />
                            </label>
                            {success ? <Button variant="contained" style={{margin: 16, backgroundColor: '#21d284'}}
                                               size="small" component="span">Success</Button> :
                                <LoadingButton loading={loading} variant='contained' style={{margin: 16}} size="small"
                                               component="span" onClick={handleClick}>Upload Video</LoadingButton>}
                        </Grid>
                        <Grid item><Button disabled variant='contained' style={{margin: 16}} size="small">Upload Point
                            Cloud</Button></Grid>
                    </Grid>
                    <Grid
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Button variant="outlined" style={{margin: 16}} size="small" disabled>Download</Button>
                        <Button variant="outlined" style={{margin: 16}} startIcon={<DeleteIcon/>} onClick={handleDelete}
                                size="small">
                            Remove Capture
                        </Button>
                    </Grid>
                </Stack>
            </Grid>
        </Card>
    )
}

export default TakeEdit