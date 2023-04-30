import * as React from 'react'

import ProjectList from './ProjectList'
import ProjectEdit from './ProjectEdit'


function ProjectView({ setTabValue, setisLogged }) {
  const [view, setView] = React.useState('projectList')
  const [project, setProject] = React.useState(null)

  return (
    <>
      {view === 'projectList' && <ProjectList setView={setView} setProject={setProject} setTabValue={setTabValue} setisLogged={setisLogged} />}
      {view === 'projectEdit' && <ProjectEdit setView={setView} project={project} setProject={setProject} setisLogged={setisLogged} />}
    </>
  )
}

export default ProjectView
