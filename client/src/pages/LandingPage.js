import * as React from 'react'
import Button from "@mui/material/Button";
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Tabs from '@mui/material/Tabs'
//import {Typography} from "@mui/material";
import Typography from '@mui/material/Typography'
import Tab from '@mui/material/Tab'
import { useEffect, useState} from "react";
import ProjectView from '../components/projectView'
import User from '../components/user'
const TESTHOST = ''
const axios = require('axios').default

function LandingPage () {
    const [isLogged, setisLogged] = useState(false);
    const [tabValue, setTabValue] = React.useState('')

    useEffect(() => {
        console.log(isLogged)
        checkIsLogIn();
        return () => {};
    }, [isLogged]);
    function checkIsLogIn(){
        axios({
            method: 'get',
            url: TESTHOST + '/api/auth/user/'
          }).then((res) => {
            if(!res.data.currentUser){
                setisLogged(false)
                setTabValue('vcp');
            }else{
                setisLogged(true)
                setTabValue('projects')
            }
          })
    }
    return (
        <div>
            <div>
                <AppBar position='static' style={{ backgroundColor: '#222222' }}>
                <h3 style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
                }}>Volumetric Capture Platform</h3>
                </AppBar>
            </div>
            <div>
               {tabValue === 'vcp' && <User setTabValue={setTabValue} />}
            </div>
            <div>
                {tabValue === 'projects' && <ProjectView setTabValue={setTabValue}/>} 
            </div>
        </div>
    )
    
}
export default LandingPage
