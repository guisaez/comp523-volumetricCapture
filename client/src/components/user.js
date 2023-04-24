import * as React from 'react'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'
import FormControl from '@mui/material/FormControl'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import Alert from '@mui/material/Alert'
import isEmail from 'validator/lib/isEmail'
import isLength from 'validator/lib/isLength'
import isEmpty from 'validator/lib/isEmpty'

const axios = require('axios').default

function Login({ setView, setTabValue, setisLogged,...props }) {
  const [values, setValues] = React.useState({
    email: '',
    password: ''
  })
  const [userInfo, setUserInfo] = React.useState(null)
  const [error, setError] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState('')
  
  const handleChange = (type, event) => {
    if (type === 'password') {
      setValues({ ...values, password: event.target.value })
    } else if (type === 'email') {
      setValues({ ...values, email: event.target.value })
    }
  }
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }
  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }

  const handlelogin = () => {
    axios({
      method: 'post',
      url: '/api/auth/signin/',
      data: values
    }).then((response) => {
      setError(false)
      setUserInfo(response.data)
      setisLogged(true)
      setTabValue('projects')
      
    }).catch((err) => {
      setError(true)
      if(!isEmail(values.email))
        setErrorMessage("The email you input is not a valid email address.")
      else if(isEmpty(values.password))
        setErrorMessage("The password must not be empty.")
      else setErrorMessage("Invalid email or password! Please check again!")
    })
  }

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Card style={{ height: '40%', width: '30%', padding: '1%' }}>
        <CardContent>
          <h3>Sign In</h3>
          <FormControl sx={{ m: 1, width: '100%' }} variant='standard'>
            <InputLabel htmlFor='input-with-icon-adornment'>
              Email
            </InputLabel>
            <Input
              value={values.email}
              onChange={(e) => { handleChange('email', e) }}
            />
          </FormControl>
          <FormControl sx={{ m: 1, width: '100%' }} variant='standard'>
            <InputLabel htmlFor='standard-adornment-password'>Password</InputLabel>
            <Input
              id='standard-adornment-password'
              type={showPassword ? 'text' : 'password'}
              value={values.password}
              onChange={(e) => { handleChange('password', e) }}
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton
                    aria-label='toggle password visibility'
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          {error && <Alert severity="error">{errorMessage}</Alert>}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: '10%' }}>
            <Button variant='outlined' disableElevation onClick={() => { setView('signup') }} style={{ marginTop: 5 }}>
              Sign up
            </Button>
            <Button variant='contained' disableElevation onClick={handlelogin} style={{ marginTop: 5 }}>
              Log in
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function Signup({ setView, ...props }) {
  const [values, setValues] = React.useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = React.useState(false)
  const [error, setError] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState('');
  const handleChange = (type, event) => {
    if (type === 'password') {
      setValues({ ...values, password: event.target.value })
    } else if (type === 'email') {
      setValues({ ...values, email: event.target.value })
    } 
  }
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }
  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }
  const handleSignup = () => {
    axios({
      method: 'post',
      url: '/api/auth/signup/',
      data: values
    }).then((response) => {
      setError(false)
      setView('login')
    }).catch((err) => {
      setError(true)
      if(!isEmail(values.email))
        setErrorMessage("The email you input is not a valid email address.")
      else if(!isLength(values.password,{min: 8, max: 20}))
        setErrorMessage("The length of the password must be between 8 to 20.")
      else setErrorMessage("The email address has already been registered!")
    })
  }

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Card style={{ height: '40%', width: '30%', padding: '1%' }}>
        <CardContent>
          <h3>Sign Up</h3>
          <FormControl sx={{ m: 1, width: '100%' }} variant='standard'>
            <InputLabel htmlFor='standard-adornment-password'>Email</InputLabel>
            <Input
              value={values.email}
              onChange={(e) => { handleChange('email', e) }}
            />
          </FormControl>
          <FormControl sx={{ m: 1, width: '100%' }} variant='standard'>
            <InputLabel htmlFor='standard-adornment-password'>Password</InputLabel>
            <Input
              id='standard-adornment-password'
              type={showPassword ? 'text' : 'password'}
              value={values.password}
              onChange={(e) => { handleChange('password', e) }}
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton
                    aria-label='toggle password visibility'
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          {error && <Alert severity="error">{errorMessage}</Alert>}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: '10%' }}>
            <Button variant='outlined' disableElevation onClick={handleSignup} style={{ marginTop: 5 }}>
              Submit
            </Button>
            <Button variant='contained' disableElevation onClick={() => { setView('login') }} style={{ marginTop: 5 }}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function User({ setTabValue, setisLogged,...props }) {
  const [view, setView] = React.useState('login')
  return (
    <div>
      {view === 'login' && <Login setView={setView} setTabValue={setTabValue}  setisLogged={setisLogged}/>}
      {view === 'signup' && <Signup setView={setView} />}
    </div>
  )
}
export default User