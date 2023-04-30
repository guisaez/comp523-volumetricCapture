import * as React from 'react'
import Login from './Login'
import Signup from './Signup'

const axios = require('axios').default

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