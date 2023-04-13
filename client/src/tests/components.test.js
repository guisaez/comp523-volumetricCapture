import { render, screen } from '@testing-library/react'
import { ReactDOM } from 'react'
import User from './../components/user'
import TakeEdit from './../components/takeEdit'
import SceneEdit from './../components/sceneEdit'
import ProjectView from './../components/projectView'
import ProjectList from './../components/projectList'
import ProjectEdit from './../components/projectEdit'
import LandingPage from './../pages/LandingPage'

test('renders user page', () => {
  render(<User />)
})

test('renders take page', () => {
  const setView = jest.fn()
  render(<TakeEdit setView={setView}/>)
})

test('renders scene page', () => {
  const setView = jest.fn()
  render(<SceneEdit setView={setView}/>)
})

test('renders project view', () => {
  render(<ProjectView />)
})

test('renders project list', () => {
  render(<ProjectList />)
})

test('renders project edit page', () => {
  render(<ProjectEdit />)
})

test('renders landing page', () => {
  render(<LandingPage />)
})

