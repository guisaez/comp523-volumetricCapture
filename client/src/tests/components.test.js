import { render, screen } from '@testing-library/react'
import { ReactDOM } from 'react'
import User from './../components/user'
import ProjectView from './../components/projectView'
import ProjectList from './../components/projectList'
import ProjectEdit from './../components/projectEdit'
import LandingPage from './../pages/LandingPage'

test('renders user page', () => {
  render(<User />)
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

