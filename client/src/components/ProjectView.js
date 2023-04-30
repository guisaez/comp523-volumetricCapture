/**
 * Components: ProjectView
 * This component renders either the ProjectList or ProjectEdit component based on the value of 'view' state.
 * Props:
 * setTabValue: a function to update the active tab value in the parent component
 * setisLogged: a function to update the login status in the parent component
 * Functions:
 * None
 * States:
 * view: a string state to determine which component to render. It can have the value of either 'projectList' or 'projectEdit'.
 * project: a state to store the currently selected project object.
*/
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
