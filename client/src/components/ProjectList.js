/**
 * Components: ProjectList
 * A component that displays a list of projects for a user and allows them to add new projects.
 * Props:
 * setView: A function to set the current view of the app
 * setTabValue: A function to set the value of the current tab
 * setProject: A function to set the current project
 * Functions:
 * handleAddProject: A function that creates a new project and generates a default configuration YAML file for it
 * handleChange: A function that handles changes to the project name input field
 * generateMultiViewConfig: A function that generates a default configuration YAML file for a new project
 * States:
 * numProjects: an array of objects representing the user's projects
 * email: A string of the email of the current user
 * projectName: A string of the name of a new project being added
*/
import * as React from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import ProjectCard from './ProjectCard'
import yaml from 'js-yaml';


const axios = require('axios').default

function ProjectList({ setView, setTabValue, setProject, ...props }) {
  // Define state variables numProjects, email, and projectName using React.useState()
  const [numProjects, setNumProjects] = React.useState([])
  const [email, setEmail] = React.useState('')
  const [projectName, setProjectName] = React.useState('')

  // Get the current user's email using a GET request to the '/api/auth/user/' endpoint
  React.useEffect(() => {
    axios({
      method: 'get',
      url: '/api/auth/user/'
    }).then((res) => {
      setEmail(res.data.currentUser.email)
    }).catch((err) => {
      console.log(err)
    })
  }, [])

  // Get a list of projects using a GET request to the '/api/projects/' endpoint
  React.useEffect(() => {
    axios({
      method: 'get',
      url: '/api/projects/'
    }).then((res) => {
      setNumProjects(res.data.projects)
    }).catch((err) => {
      console.log(err)
    })
  }, [])

  // Define a handleChange function that updates the projectName state variable when the Input component changes
  const handleChange = (type, event) => {
    if (type === 'projectName') {
      setProjectName(event.target.value)
    }
  }

  // Define a handleAddProject function that creates a new project using a POST request to the '/api/projects/' endpoint
  // with a default project name if no project name is provided, and then generates a new multi-view configuration for the project
  const handleAddProject = () => {
    axios({
      method: 'post',
      url: '/api/projects/',
      data: {
        projectName: projectName || "New Project"
      }
    }).then((res) => {
      setNumProjects([...numProjects, res.data])
      generateMultiViewConfig(res.data.id)
    })
  }

  // Define a generateMultiViewConfig function that generates a new multi-view configuration for a given project id
  const generateMultiViewConfig = (pid) => {
    const data = {
      task: 'if_nerf',
      gpus: [0],
      parent_cfg: 'configs/zju_mocap_exp/latent_xyzc_313.yaml',
      train_dataset: {
        data_root: '/app/src/data/' + pid + '/neural_input',
        human: 'custom',
        ann_file: '/app/src/data/' + pid + '/neural_input/annots.npy',
        split: 'train'
      },
      test_dataset: {
        data_root: '/app/src/data/' + pid + '/neural_input',
        human: 'custom',
        ann_file: '/app/src/data/' + pid + '/neural_input/annots.npy',
        split: 'test'
      },
      train: {
        epoch: 50,
        num_workers: 6,
        batch_size: 1

      },
      test: {
        batch_size: 1
      },
      ratio: 0.5,
      training_view: [0, 1, 2, 3],
      num_train_frame: 20,
      smpl: 'smpl',
      vertices: 'vertices',
      params: 'params',
      big_box: true
    };// Convert data to YAML format
    const yamlData = yaml.dump(data, { indent: 2, quotingType: "'", forceQuotes: true, flowLevel: 4 });

    // Create a new file object for the YAML data
    const config_yaml = new File([yamlData], pid + "_default_config.yaml", { type: "text/plain;charset=utf-8" });

    // Create a new form data object and append the file and type information
    const formData = new FormData();
    formData.append('file', config_yaml);
    formData.append('type', 'multi_view_config');

    // Send a POST request to the server
    const route = '/api/files/upload/' + pid;
    axios.post(route, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then((res) => {
    })
      .catch((err) => {
        console.error(err);
      });
  };



  return (
    <div>
      <div>
        <div>
          <h3 style={{ margin: 16 }}>{'Welcome, ' + email + '!'}</h3>
        </div>
        <FormControl style={{ margin: 16 }}>
          <InputLabel >Project Name</InputLabel>
          <Input
            value={projectName}
            onChange={(e) => { handleChange('projectName', e) }}
          />
        </FormControl>
        <Button variant='contained' style={{
          margin: 16
        }} onClick={handleAddProject}>New Project</Button>
      </div>
      {/* display the list of projects */}
      <Box sx={{ flexGrow: 1 }} style={{ margin: 16 }}>
        <Grid container spacing={2} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start' }}>
          {numProjects && numProjects.map((value) => (
            <ProjectCard key={value.id} setView={setView} value={value} setProject={setProject} setNumProjects={setNumProjects} />
          ))}
        </Grid>
      </Box>
    </div>
  )
}
export default ProjectList