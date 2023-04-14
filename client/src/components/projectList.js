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
//import TESTHOST from '../backend/backendAPI'
const TESTHOST = ''
const axios = require('axios').default

// const Item = styled(Paper)(({ theme }) => ({
//   ...theme.typography.body2,
//   padding: theme.spacing(1),
//   textAlign: 'center',
//   color: theme.palette.text.secondary
// }))

function ProjectCard({ setNumProjects, setView, value, setProject, ...props }) {
  //const [isExist, setIsExist] = useState(true)
  React.useEffect(() => {
    console.log("use effect")
  })
  const [projectInfo, setInfo] = React.useState({
    projectName: value.projectName,
    userId: value.userId,
    createdAt:value.createdAt,
    lastModifiedAt:value.lastModifiedAt,
    processStatus:value.processStatus,
    zip_fileId:value.zip_fileId,
    extrinsic_fileId: value.extrinsic_fileId,
    intrinsic_fileId: value.intrinsic_fileId,
    output_fileId:value.intrinsic_fileId,
    id:value.id
  })
  const handleEdit = () => {
    //console.log(value)
    setProject(value)
    setView('projectEdit')
  }
  const handleDelete = () => {
    axios({
      method: 'delete',
      url: TESTHOST + '/api/projects/' +  value.id
      // data: {
      //   projectName: projectName || "New Project"
      //   //createdAt: new Date(),
      //   //lastModifiedAt:new Date()
		  //   //userId: uid
      // }
    }).then((res) => {
      setInfo(res.data)
      console.log("Deleting ")
      console.log(projectInfo)
      //setNumProjects([...numCaptures, res.data])
      //console.log(numProjects)
      //setView('projectList')
      //setIsExist(false)
      // setNumProjects([...numProjects, res.data])
      // console.log("numproj")
      // console.log(numProjects)
      // console.log("type")
      // console.log(typeof numProjects)
    })
    console.log("Deleted " + value.id)
    //setProject(value)
    //setView('projectEdit')
  }

//   <CardMedia
//   component='img'
//   height='140'
//   image=''
//   alt='project image'//? projectInfo.email : ''
// />
  return (
      <Card style={{ height: '30%', width: '20%', margin: 16, padding: 10 }}>
        <CardContent>
          <Typography gutterBottom variant='h5' component='div'>
            {projectInfo.projectName ? projectInfo.projectName : 'Project'}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {'Created at ' + new Date(projectInfo.createdAt).toLocaleString() }
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
            <Grid item><Button variant='contained' onClick={handleDelete}>Delete</Button></Grid>
            <Grid item><Button variant="outlined">Download Model</Button></Grid>
          </Grid>
        </CardActions>
      </Card>
  )
}

// function getDate(date){
//       mnth = ("0" + (date.getMonth() + 1)).slice(-2),
//       day = ("0" + date.getDate()).slice(-2);
//     return [date.getFullYear(), mnth, day].join("-") + date.get;
// }

function ProjectList({ setView, setProject, ...props }) {
  const [numProjects, setNumProjects] = React.useState([])
  const [uid,setUid] = React.useState('')
  const [email,setEmail] = React.useState('')
  const [projectName, setProjectName] = React.useState('')
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
      console.log(res.data.projects)
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
      console.log("numproj")
      console.log(numProjects)
      console.log("type")
      console.log(typeof numProjects)
    })
    // setNumProjects([...numProjects, numProjects.length + 1])
  }
  return (
    <div>
      <div>
        <h3 style={{ margin: 16 }}>{ 'Welcome, '+email+'!'}</h3>
        <FormControl variant='contained' style={{ margin: 16 }}>
            <InputLabel >Project Name</InputLabel>
            <Input
              value={projectName}
              onChange={(e) => { handleChange('projectName', e) }}
            />
          </FormControl>
        <Button variant='contained' style={{ margin: 16 }} onClick={handleAddProject}>New Project</Button>
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
  //   return (
  //   <div>
  //     <div>
  //       <h3 style={{ margin: 16 }}>{ 'Welcome, '+email+'!'}</h3>

  //       <Button variant='contained' style={{ margin: 16 }} onClick={handleAddProject}>New Project</Button>
  //     </div>
  //     <Box sx={{ flexGrow: 1 }} style={{ margin: 16 }}>

  //     </Box>
  //   </div>
  // )

}
export default ProjectList