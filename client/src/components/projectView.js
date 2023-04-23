import * as React from 'react'

import ProjectList from './projectList'
import ProjectEdit from './projectEdit'


function ProjectView ({setTabValue}) {
  const [view, setView] = React.useState('projectList')
  const [project, setProject] = React.useState(null)

  return (
    <>
    {view === 'projectList' && <ProjectList setView={setView} setProject={setProject} setTabValue={setTabValue}/>}
    {view === 'projectEdit' && <ProjectEdit setView={setView} project={project} setProject={setProject}/>}  
  </>
  )
}

export default ProjectView
