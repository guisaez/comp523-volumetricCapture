import * as React from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
//import TESTHOST from '../backend/backendAPI'
const TESTHOST = ''
const axios = require('axios').default

// const Item = styled(Paper)(({ theme }) => ({
//   ...theme.typography.body2,
//   padding: theme.spacing(1),
//   textAlign: 'center',
//   color: theme.palette.text.secondary
// }))

function ProjectCard({ setView, value, setProject, ...props }) {
  const [projectInfo, setInfo] = React.useState({
    projectName: value.projectName,
    userId: value.userId,
    createdAt:value.createdAt,
    lastModifiedAt:value.lastModifiedAt,
    processStatus:value.processStatus,
    zip_fileId:value.zip_fileId,
    extrinsic_fileId: value.extrinsic_fileId,
    intrinsic_fileId: value.intrinsic_fileId,
    output_fileId:value.intrinsic_fileId
  })
  const handleEdit = () => {
    console.log(value)
    setProject(value)
    setView('projectEdit')
  }

//   <CardMedia
//   component='img'
//   height='140'
//   image=''
//   alt='project image'
// />
  return (
      <Card style={{ height: '30%', width: '20%', margin: 16, padding: 10 }}>
        <CardContent>
          <Typography gutterBottom variant='h5' component='div'>
            {projectInfo.projectName ? projectInfo.projectName : 'Project'}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {projectInfo.userId ? projectInfo.userId : 'You have created a new project! Add any descriptions through the edit button.'}
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
            <Grid item><Button variant="outlined">Download Model</Button></Grid>
          </Grid>
        </CardActions>
      </Card>
  )
}

function ProjectList({ setView, setProject, ...props }) {
  const [numProjects, setNumProjects] = React.useState([])
  const [uid,setUid] = React.useState('')
  const [email,setEmail] = React.useState('')
  React.useEffect(() => {
    axios({
      method: 'get',
      url: TESTHOST + '/api/auth/user/'
    }).then((res) => {
      //console.log(res.data)
      setUid(res.data.currentUser.id)
      setEmail(res.data.currentUser.email)
    })
  }, [])
  React.useEffect(() => {
    axios({
      method: 'get',
      url: TESTHOST + '/api/projects/'
    }).then((res) => {
      console.log(res.data)
      setNumProjects(res.data)
    })
  }, [])
  const handleAddProject = () => {
    axios({
      method: 'post',
      url: TESTHOST + '/api/projects/',
      data: {
        projectName: "New Project",
		    userId: uid
      }
    }).then((res) => {
      setNumProjects([...numProjects, res.data])
      console.log(res.data)
    })
    // setNumProjects([...numProjects, numProjects.length + 1])
  }
  return (
    <div>
      <div>
        <h3 style={{ margin: 16 }}>{ 'Welcome, '+email+'!'}</h3>
        <Button variant='contained' style={{ margin: 16 }} onClick={handleAddProject}>SO</Button>
        <Button variant='contained' style={{ margin: 16 }} onClick={handleAddProject}>New Project</Button>
      </div>
      <Box sx={{ flexGrow: 1 }} style={{ margin: 16 }}>
        <Grid container spacing={2} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start' }}>
          {numProjects && numProjects.map((value) => (
            <ProjectCard key={value.id} setView={setView} value={value} setProject={setProject}/>
          ))}
        </Grid>
      </Box>
    </div>
  )
}

export default ProjectList
