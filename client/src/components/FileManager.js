import * as React from 'react'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import CardActions from '@mui/material/CardActions'
import Typography from '@mui/material/Typography'
import DeleteButton from "./DeleteButton";
const axios = require('axios').default



function FileManager({ info, fileType, format }) {
    const [Id, setId] = React.useState('')
    const [File, setFile] = React.useState(null)
    const [ButtonName, setButtonName] = React.useState('')
    const [FileName, setFileName] = React.useState('None')
    const Ref = React.useRef(null)
    const [selectedName, setSelectedName] = React.useState('None')
    const [disableUpload, setDisableUpload] = React.useState(true)
    const [disableDelete, setDisableDelete] = React.useState(true)
    React.useEffect(() => {
        axios({
            method: 'get',
            url: '/api/projects/' + info.id
        }).then((res) => {
            let resFileId='';
            if(fileType==='zip'){
                resFileId = res.data.project.zip_fileId;
            }else if(fileType==='extrinsic'){
                resFileId = res.data.project.extrinsic_fileId;
            }else if(fileType==='intrinsic'){
                resFileId = res.data.project.intrinsic_fileId;
            }
            //initialize 
            if (resFileId) {
                setButtonName('Update '+fileType)
                setId(resFileId)
                axios({
                    method: 'get',
                    url: '/api/files/' + resFileId
                }).then((res) => {
                    setFileName(res.data.file.name)
                })
            } else {
                setButtonName('Upload '+fileType)
            }

            setDisableDelete(!resFileId)
        }).catch((err) =>{
            console.log(err)
        })
    })

    const handleFileReader = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
        setSelectedName(selectedFile.name)
        setDisableUpload(false);
    }

    const handleUpload = () => {
        const formData = new FormData();
        formData.append('file', File);
        formData.append('type', fileType);
        if (ButtonName === 'Upload '+fileType) {
            const route = '/api/files/upload/' + info.id;
            axios.post(route, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then((res) => {
                setId(res.data.file.id);
                setDisableUpload(true);
                setDisableDelete(false);
                setButtonName('Update '+fileType);
                setFileName(res.data.file.name)
                setFile(null);
                Ref.current.value = null;
                setSelectedName("None")
            })
                .catch((err) => {
                    setDisableUpload(false);
                });

        } else if (ButtonName === 'Update '+fileType) {
            const route = '/api/files/update/' + Id;
            console.log("update zip " + route)
            axios.put(route, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then((res) => {
                setId(res.data.file.id);
                setDisableUpload(true);
                setDisableDelete(false);
                setButtonName('Update '+fileType);
                setFileName(res.data.file.name)
                setFile(null);
                Ref.current.value = null;
                setSelectedName("None")
            })
                .catch((err) => {
                    setDisableUpload(false);
                });
        }
    }
    const handleDelete = () => {
        axios({
            method: 'delete',
            url: '/api/files/delete',
            data: {
                projectId: info.id,
                id: Id
            }
        }).then((res) => {
            setDisableDelete(true);
            setButtonName('Upload '+fileType);
            setDisableUpload(!File);
            setFileName("None")
        }).catch((err) => {
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

    return (
        <Grid item xs={6}>
            <Card style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start' }}>
                <Stack spacing={5}>
                    <CardContent>
                        <Typography gutterBottom variant='h5' component='div'>
                             {fileType.charAt(0).toUpperCase() + fileType.slice(1)+' File'}
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                            {'Uploaded File is ' + FileName}
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                            {'Chosen File is ' + selectedName}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Stack spacing={1}>
                            <div>
                                <Button variant="outlined" component="label" style={{ margin: 8 }}>
                                    {'Choose ' +fileType}
                                    <input hidden
                                        accept={format}
                                        type="file"
                                        onChange={handleFileReader}
                                        style={{ display: 'none' }}
                                        ref={Ref}
                                    />
                                </Button>

                                <Button onClick={handleUpload} variant="contained" disabled={(disableUpload)} style={{ margin: 8 }}>{ButtonName}</Button>
                            </div>
                            <div>
                                <DeleteButton onDelete={handleDelete} marginVar={8} isDisabled={disableDelete} deletedThing={fileType+" file"} size="medium" buttonName={'Delete '+fileType}></DeleteButton>
                                <Button onClick={(e) => { handleDownload(Id, FileName) }} variant="outlined" style={{ margin: 8 }} disabled={FileName === 'None'}>{'Download '+fileType }</Button>
                            </div>
                        </Stack>
                    </CardActions>
                </Stack>
            </Card>
        </Grid>
    )







}

export default FileManager
