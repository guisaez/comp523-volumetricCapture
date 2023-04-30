import * as React from 'react'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import DeleteButton from "./DeleteButton";


const axios = require('axios').default

function ProjectCard({ setNumProjects, setView, value, setProject, setisLogged, ...props }) {
  const [errorMsg, setErrorMsg] = React.useState('')
  const [error, setError] = React.useState(false)
  const [buttonName, setButtonName] = React.useState("")
  const [projectInfo, setInfo] = React.useState({
    projectName: value.projectName,
    userId: value.userId,
    createdAt: value.createdAt,
    lastModifiedAt: value.lastModifiedAt,
    processStatus: value.processStatus,
    version: value.version,
    zip_fileId: value.zip_fileId,
    extrinsic_fileId: value.extrinsic_fileId,
    intrinsic_fileId: value.intrinsic_fileId,
    output_fileId: value.output_fileId,
    id: value.id
  })
  React.useEffect(() => {
    if (projectInfo.processStatus === 'not-started') {
      setButtonName("Run Model")
    } else if (projectInfo.processStatus === 'running') {
      setButtonName("Running")
    } else if (projectInfo.processStatus === 'error') {
      setButtonName("Try Again")
      setError(true)
      setErrorMsg("Errors happened!")
    } else if (projectInfo.processStatus === 'completed') {
      setButtonName("Download Model")
    }
  }, [projectInfo.processStatus]);
  const handleEdit = () => {
    setProject(value)
    setView('projectEdit')
  }
  const handleDelete = () => {
    axios({
      method: 'delete',
      url: '/api/projects/' + value.id
    }).then((res) => {
      axios({
        method: 'get',
        url: '/api/projects/'
      }).then((res) => {
        setNumProjects(res.data.projects)
      }).catch((err) =>{
        console.log(err)
    })
    }).catch((err) =>{
      console.log(err)
  })
  }

  const handleDownload = () => {
    if (projectInfo.processStatus === 'not-started' || projectInfo.processStatus === 'error') {
      axios({
        method: 'post',
        url: '/api/projects/run/' + value.id
      }).then((res) => {
        setInfo({
          projectName: res.data.project.projectName,
          userId: res.data.project.userId,
          createdAt: res.data.project.createdAt,
          lastModifiedAt: res.data.project.lastModifiedAt,
          processStatus: res.data.project.processStatus,
          version: res.data.project.version,
          zip_fileId: res.data.project.zip_fileId,
          extrinsic_fileId: res.data.project.extrinsic_fileId,
          intrinsic_fileId: res.data.project.intrinsic_fileId,
          output_fileId: res.data.project.output_fileId,
          id: res.data.project.id
        })
        setButtonName("Running")
        setError(false)
        setErrorMsg("")
        axios({
          method: 'get',
          url: '/api/projects/'
        }).then((res) => {
          setNumProjects(res.data.projects)
        }).catch((err) => {

        })
      }, []).catch(() => {
        setError(true)
        setErrorMsg("Failed! Please check the files!")
      })
    } else if (projectInfo.processStatus === 'completed') {
      axios({
        method: 'get',
        url: '/api/files/download/' + projectInfo.output_fileId.id,
        responseType: 'blob'
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', projectInfo.projectName + "_" + projectInfo.output_fileId.name);
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
          {'Created at ' + new Date(projectInfo.createdAt).toLocaleString()}
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
          <Grid item><Button variant='contained' onClick={handleEdit} disabled={projectInfo.processStatus === 'running'}>Edit</Button></Grid>
          <Grid item><DeleteButton onDelete={handleDelete} marginVar={8} isDisabled={false} deletedThing="project" size="medium" buttonName='Delete'></DeleteButton></Grid>
          <Grid item><Button variant="outlined" onClick={handleDownload} disabled={(projectInfo.processStatus === 'running') ||
            (buttonName === 'Run Model' && (!projectInfo.zip_fileId || !projectInfo.extrinsic_fileId || !projectInfo.intrinsic_fileId))}>{buttonName}</Button>
          </Grid>
        </Grid>
      </CardActions>
      {error && <Alert style={{ justifyContent: 'center' }} severity="error">{errorMsg}</Alert>}
    </Card>
  )
}

export default ProjectCard