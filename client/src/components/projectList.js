import * as React from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import timestamp from 'time-stamp'
import FormControl from '@mui/material/FormControl'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import Alert from '@mui/material/Alert'
import DeleteIcon from '@mui/icons-material/Delete'

const TESTHOST = ''
const axios = require('axios').default

function ProjectCard({ setNumProjects, setView, value, setProject, ...props }) {
  const [errorMsg, setErrorMsg] = React.useState('')
  const [error, setError] = React.useState(false)
  const [projectInfo, setInfo] = React.useState({
    projectName: value.projectName,
    userId: value.userId,
    createdAt:value.createdAt,
    lastModifiedAt:value.lastModifiedAt,
    processStatus:value.processStatus,
    version:value.version,
    zip_fileId:value.zip_fileId,
    extrinsic_fileId: value.extrinsic_fileId,
    intrinsic_fileId: value.intrinsic_fileId,
    output_fileId:value.output_fileId,
    id:value.id
  })
  const handleEdit = () => {
    setProject(value)
    setView('projectEdit')
  }
  const handleDelete = () => {
    axios({
      method: 'delete',
      url: TESTHOST + '/api/projects/' +  value.id
    }).then((res) => {
      axios({
        method: 'get',
        url: TESTHOST + '/api/projects/'
      }).then((res) => {
        setNumProjects(res.data.projects)
      }).catch((err) => {
        
      })
    }, [])
  }

  const handleDownload = () => {
    if(projectInfo.processStatus !=  'completed'){
      setError(true)
      setErrorMsg("No available model to download!")
    }else{
      axios({
      method: 'get',
      url: TESTHOST + '/api/files/download/' + projectInfo.output_fileId.id,
      responseType: 'blob'
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;s
      link.setAttribute('download', projectInfo.projectName+"_"+projectInfo.output_fileId.name);
      document.body.appendChild(link);
      link.click();
    })
    }
  }

  return (
      <Card style={{ height: '30%', width: '20%', margin: 16, padding: 10 }}>
        <CardContent>
          <Typography gutterBottom variant='h5' component='div'>
            {projectInfo.projectName ? projectInfo.projectName : 'Project'}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {'Created at ' + new Date(projectInfo.createdAt).toLocaleString() }
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {'Status is ' + projectInfo.processStatus}
          </Typography>
        </CardContent>
        <CardActions>
          <Grid
            container
            direction="row"
            justifyContent="space-around"
            spacing={1}
            alignItems="center"
            margin="auto"
          >
            <Grid item><Button variant='contained' onClick={handleEdit}>Edit</Button></Grid>
            <Grid item><Button variant='contained' startIcon={<DeleteIcon/>} onClick={handleDelete}>Delete</Button></Grid>
            <Grid item><Button variant="outlined" onClick={handleDownload}>Download Model</Button></Grid>
          </Grid>
        </CardActions> 
        {error && <Alert style={{justifyContent: 'center' }} severity="error">{errorMsg}</Alert>}
      </Card>
  )
}

function ProjectList({ setView, setTabValue, setProject, ...props }) {
  const [numProjects, setNumProjects] = React.useState([])
  const [uid,setUid] = React.useState('')
  const [email,setEmail] = React.useState('')
  const [projectName, setProjectName] = React.useState('')
  React.useEffect(() => {
    axios({
      method: 'get',
      url: TESTHOST + '/api/auth/user/'
    }).then((res) => {
      setUid(res.data.currentUser.id)
      setEmail(res.data.currentUser.email)
    })
  }, [])
  React.useEffect(() => {
    axios({
      method: 'get',
      url: TESTHOST + '/api/projects/'
    }).then((res) => {
      setNumProjects(res.data.projects)
    }).catch((err) => {
      
    })
  }, [])
  const handleChange = (type, event) => {
    if (type === 'projectName') {
      setProjectName(event.target.value)
    } 
  }
  const handleAddProject = () => {
    axios({
      method: 'post',
      url: TESTHOST + '/api/projects/',
      data: {
        projectName: projectName || "New Project"
      }
    }).then((res) => {
      setNumProjects([...numProjects, res.data])
    })
  }

  const handleLogout = () => {
    axios({
      method: 'post',
      url: TESTHOST + '/api/auth/signout/',
      data: {
      }
    }).then((res) => {
      setTabValue('vcp')
    })
  }

  return (
    <div>
      <div>
        <div>
        <h3 style={{ margin: 16 }}>{ 'Welcome, '+email+'!'}</h3> 
        </div>
        <FormControl variant='contained' style={{ margin: 16 }}>
            <InputLabel >Project Name</InputLabel>
            <Input
              value={projectName}
              onChange={(e) => { handleChange('projectName', e) }}
            />
          </FormControl>
        <Button variant='contained' style={{ 
          margin: 16
        }} onClick={handleAddProject}>New Project</Button>
        <Button variant='contained' style={{ 
          margin: 16
        }} onClick={handleLogout}>Log out</Button>
      </div>
      <Box sx={{ flexGrow: 1 }} style={{ margin: 16 }}>
        <Grid container spacing={2} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start' }}>
          {numProjects && numProjects.map((value) => (
            <ProjectCard key={value.id} setView={setView} value={value} setProject={setProject} setNumProjects={setNumProjects}/>
          ))}
        </Grid>
      </Box>
    </div>
  )
}
export default ProjectList