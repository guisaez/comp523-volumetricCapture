import * as React from 'react'

import ProjectList from './projectList'
import ProjectEdit from './projectEdit'
//import SceneEdit from './sceneEdit'
//import TakeEdit from './takeEdit'

function ProjectView ({setTabValue}) {
  const [view, setView] = React.useState('projectList')
  const [project, setProject] = React.useState(null)
  // const [scene, setScene] = React.useState(null)
  // const [take, setTake] = React.useState(null)
  return (

    // <>
    //   {view === 'projectList' && <ProjectList setView={setView} setProject={setProject}/>}
    //   {view === 'projectEdit' && <ProjectEdit setView={setView} project={project} setProject={setProject} setScene={setScene}/>}  
    // </>
    <>
    {view === 'projectList' && <ProjectList setView={setView} setProject={setProject} setTabValue={setTabValue}/>}
    {view === 'projectEdit' && <ProjectEdit setView={setView} project={project} setProject={setProject}/>}  
  </>
  )
}

export default ProjectView
