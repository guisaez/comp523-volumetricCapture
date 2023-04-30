import * as React from 'react'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import CardActions from '@mui/material/CardActions'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import yaml from 'js-yaml';


const axios = require('axios').default

function SettingManager({ info }) {
    const [multiViewConfigId, setMultiViewConfigId] = React.useState('')
    const [epoch, setEpoch] = React.useState(50);
    const [batchTrain, setBatchTrain] = React.useState(1);
    const [batchTest, setBatchTest] = React.useState(1);
    const [numWorkers, setNumWorkers] = React.useState(6);
    const [numTrainFrame, setNumTrainFrame] = React.useState(20);
    const [ratio, setRatio] = React.useState(0.5)
    const [isUpload, setIsupload] = React.useState(false)
    const [Id, setId] = React.useState('')
    const [file, setFile] = React.useState(null)
    const [FileName, setFileName] = React.useState('None')
    const Ref = React.useRef(null)
    const [selectedName, setSelectedName] = React.useState('None')
    const [disableUpload, setDisableUpload] = React.useState(true)
    const [error, setError] = React.useState(false)

    React.useEffect(() => {
        axios({
            method: 'get',
            url: '/api/projects/' + info.id
        }).then((res) => {
            //initialize multi_view_config           
            if (res.data.project.multi_view_fileId) {
                setMultiViewConfigId(res.data.project.multi_view_fileId)                
                setId(res.data.project.multi_view_fileId)
                axios({
                    method: 'get',
                    url: '/api/files/' + res.data.project.multi_view_fileId
                }).then((res) => {
                    setFileName(res.data.file.name)
                }).catch((err) =>{
                    console.log(err)
                })
                axios({
                    method: 'get',
                    url: '/api/files/download/' + res.data.project.multi_view_fileId
                }).then((res) => {
                    const data = yaml.load(res.data)
                    setEpoch(data.train.epoch);
                    setNumWorkers(data.train.num_workers);
                    setNumTrainFrame(data.num_train_frame);
                    setRatio(data.ratio)
                    setBatchTest(data.test.batch_size)
                    setBatchTrain(data.train.batch_size)
                }).catch((err) =>{
                    console.log(err)
                })
            }

        }).catch((err) =>{
            console.log(err)
        })
    })



    const handleUpdateConfig = () => {
        const data = {
            task: 'if_nerf',
            gpus: [0],
            parent_cfg: 'configs/zju_mocap_exp/latent_xyzc_313.yaml',
            train_dataset: {
                data_root: '/app/src/data/' + info.id + '/neural_input',
                human: 'custom',
                ann_file: '/app/src/data/' + info.id + '/neural_input/annots.npy',
                split: 'train'
            },
            test_dataset: {
                data_root: '/app/src/data/' + info.id + '/neural_input',
                human: 'custom',
                ann_file: '/app/src/data/' + info.id + '/neural_input/annots.npy',
                split: 'test'
            },
            train: {
                epoch: epoch,
                num_workers: numWorkers,
                batch_size: batchTrain
            },
            test: {
                batch_size: batchTest
            },
            ratio: ratio,
            training_view: [0, 1, 2, 3],
            num_train_frame: numTrainFrame,
            smpl: 'smpl',
            vertices: 'vertices',
            params: 'params',
            big_box: true
        };
        const yamlData = yaml.dump(data, { indent: 2, quotingType: "'", forceQuotes: true, flowLevel: 4 });
        const config_yaml = new File([yamlData], info.id + "_config.yaml", { type: "text/plain;charset=utf-8" });
        const formData = new FormData();
        formData.append('file', config_yaml);
        formData.append('type', 'multi_view_config');
        const route = '/api/files/update/' + multiViewConfigId;
        axios.put(route, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then((res) => {
        }).catch((err) => {
        });
    };


    React.useEffect(() => {
        axios({
            method: 'get',
            url: '/api/projects/' + info.id
        }).then((res) => {
            let resFileId = res.data.project.multi_view_fileId;
            //initialize 
            if (resFileId) {
                setId(resFileId)
                axios({
                    method: 'get',
                    url: '/api/files/' + resFileId
                }).then((res) => {
                    setFileName(res.data.file.name)
                })
            }
        })
    })

    const handleFileReader = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
        setSelectedName(selectedFile.name)
        performFileCheck(selectedFile)
    }

    const handleUpload = () => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'multi_view_config');
        const route = '/api/files/update/' + Id;
        axios.put(route, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then((res) => {
            setId(res.data.file.id);
            setDisableUpload(true);
            setFileName(res.data.file.name)
            setFile(null);
            Ref.current.value = null;
            setSelectedName("None")
            axios({
                method: 'get',
                url: '/api/files/download/' + res.data.file.id
            }).then((res) => {
                const data = yaml.load(res.data)
                setEpoch(data.train.epoch);
                setNumWorkers(data.train.num_workers);
                setNumTrainFrame(data.num_train_frame);
                setRatio(data.ratio)
                setBatchTest(data.test.batch_size)
                setBatchTrain(data.train.batch_size)
            })
        })
            .catch((err) => {
                setDisableUpload(false);
            });
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

    const performFileCheck = (yamlFile) => {
        const reader = new FileReader();
        reader.onload = function(event) {
          const yamlData = event.target.result;
          const data = yaml.load(yamlData);
          let result = data.train && data.test && data.train.epoch && data.train.num_workers && data.num_train_frame && data.ratio && data.test.batch_size && data.train.batch_size
          setError(!result);
          setDisableUpload(!result);
        };
        reader.readAsText(yamlFile);
    }


    return (
        <Grid item xs={6}>
            <Card style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start' }}>
                <Stack>
                    <CardContent>
                        <Typography gutterBottom variant='h5' component='div'>
                            Multi-View Settings
                        </Typography>

                        <FormGroup>
                            <FormControlLabel control={<Switch checked={isUpload} onChange={(e) => setIsupload(e.target.checked)} size='large' />} label="Upload a configuration file?" />
                        </FormGroup>
                    </CardContent>
                    {!isUpload &&
                        <CardContent>
                            <Stack spacing={2}>
                                <div>
                                    <TextField
                                        label="Epoch"
                                        variant="outlined"
                                        type="number"
                                        value={epoch}
                                        onChange={(e) => {if(e.target.value) setEpoch(parseInt(e.target.value)); else setEpoch(0)}}
                                    />
                                    <TextField
                                        label="Number of Workers"
                                        variant="outlined"
                                        type="number"
                                        value={numWorkers}
                                        onChange={(e) => {if(e.target.value) setNumWorkers(parseInt(e.target.value)); else setNumWorkers(0)}}
                                    />
                                    <TextField
                                        label="Batch Size of Training"
                                        variant="outlined"
                                        type="number"
                                        value={batchTrain}
                                        onChange={(e) => {if(e.target.value) setBatchTrain(parseInt(e.target.value)); else setBatchTrain(0)}}
                                    />
                                </div>
                                <div>
                                    <TextField
                                        label="Number of Train Frames"
                                        variant="outlined"
                                        type="number"
                                        value={numTrainFrame}
                                        onChange={(e) => {if(e.target.value) setNumTrainFrame(parseInt(e.target.value)); else setNumTrainFrame(0)}}
                                    />
                                    <TextField
                                        label="Ratio"
                                        variant="outlined"
                                        type="number"
                                        value={ratio}
                                        onChange={(e) => {if(e.target.value) setRatio(parseInt(e.target.value)); else setRatio(0)}}
                                    />
                                    <TextField
                                        label="Batch Size of Testing"
                                        variant="outlined"
                                        type="number"
                                        value={batchTest}
                                        onChange={(e) => {if(e.target.value) setBatchTest(parseInt(e.target.value)); else setBatchTest(0)}}
                                    />
                                </div>
                            </Stack>
                        </CardContent>


                    }
                    {isUpload &&
                        <CardContent>
                            <Typography variant='body2' color='text.secondary'>
                                {'Project id is ' + info.id + '. You may use it as the data root in your configuration file.'}
                            </Typography>
                            <Typography variant='body2' color='text.secondary'>
                                {'Uploaded File is ' + FileName}
                            </Typography>
                            <Typography variant='body2' color='text.secondary'>
                                {'Chosen File is ' + selectedName}
                            </Typography>
                        </CardContent>

                    }
                    {!isUpload &&
                        <CardActions>
                            <Button variant="contained" onClick={handleUpdateConfig}>
                                Update
                            </Button>
                        </CardActions>
                    }
                    {isUpload &&
                        <CardActions>
                            <Stack spacing={1}>
                                <div>
                                    <Button variant="outlined" component="label" style={{ margin: 8 }}>
                                        Choose Configuration
                                        <input hidden
                                            accept=".yaml"
                                            type="file"
                                            onChange={handleFileReader}
                                            style={{ display: 'none' }}
                                            ref={Ref}
                                        />
                                    </Button>
                                    <Button onClick={handleUpload} variant="contained" disabled={(disableUpload)} style={{ margin: 8 }}>Update Configuration</Button>
                                    <Button onClick={(e) => { handleDownload(Id, FileName) }} variant="outlined" style={{ margin: 8 }} disabled={FileName === 'None'}>Download Configuration</Button>
                                </div>
                                {error && <Alert severity="error">You must have train.batch_size, train.epoch, train.num_workers, num_train_frame ,ratio, test.batch_size defined in the file.</Alert>}
                            </Stack>
                        </CardActions>
                    }

                </Stack>
            </Card>
        </Grid>
    )

}
export default SettingManager