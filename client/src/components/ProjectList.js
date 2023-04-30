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
  const [numProjects, setNumProjects] = React.useState([])
  const [email, setEmail] = React.useState('')
  const [projectName, setProjectName] = React.useState('')
  React.useEffect(() => {
    axios({
      method: 'get',
      url: '/api/auth/user/'
    }).then((res) => {
      setEmail(res.data.currentUser.email)
    })
  }, [])
  React.useEffect(() => {
    axios({
      method: 'get',
      url: '/api/projects/'
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
      url: '/api/projects/',
      data: {
        projectName: projectName || "New Project"
      }
    }).then((res) => {
      setNumProjects([...numProjects, res.data])
      generateMultiViewConfig(res.data.id)
    })
  }

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
    };
    const yamlData = yaml.dump(data, { indent: 2, quotingType: "'", forceQuotes: true, flowLevel: 4 });
    const config_yaml = new File([yamlData], pid + "_default_config.yaml", { type: "text/plain;charset=utf-8" });
    const formData = new FormData();
    formData.append('file', config_yaml);
    formData.append('type', 'multi_view_config');
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
      </div>
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