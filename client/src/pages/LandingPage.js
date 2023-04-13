import * as React from 'react'
import Button from "@mui/material/Button";
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Tabs from '@mui/material/Tabs'
import {Typography} from "@mui/material";
import Tab from '@mui/material/Tab'
import { useEffect, useState} from "react";
import ProjectView from '../components/projectView'
import User from '../components/user'

function LandingPage () {
    const [isLogged, setisLogged] = useState(false);
    const [tabValue, setTabValue] = React.useState('vcp')

    useEffect(() => {
        console.log(isLogged)
        checkStorage();
        return () => {};
    }, [isLogged]);
    function checkStorage() {
        if (localStorage.getItem("currentUser")) {
            setisLogged(true);
            console.log("Logged in");
        } else {
            setisLogged(false);
            console.log("Logged out");
        }
    }
    // const logout = () => {   
    //         localStorage.removeItem("token");
    //         setisLogged(false);
    //         setTabValue('vcp')
    //     }
    const logout = () => {
        if (localStorage.getItem("currentUser")) {
            localStorage.removeItem("currentUser");
            setisLogged(false);
            setTabValue('vcp');
            console.log("Logged out");
        } else {
            setisLogged(true);
            setTabValue('projects');
        }
    };

    ;
    const handleChange = (event, newValue) => {
        setTabValue(newValue)
    }
   
    return (
        <div>
            <div>
                <AppBar position='static' style={{ backgroundColor: '#222222' }}>
                    <Toolbar variant='dense'>
                        <Tabs
                            value={tabValue}
                            onChange={handleChange}
                            textColor='white'
                            indicatorColor='secondary'
                            sx={{ flexGrow: 1 }}
                        >
                            <Tab value='Log out' 
                            label='VCP' 
                            disabled={isLogged}/>
                            <Tab
                                value='projects'
                                label='Projects'
                                disabled={!isLogged}
                            />
                        </Tabs>
                        <Button color="inherit" onClick={() => logout()}>
                            {isLogged ? "Log out" : "Log in"}
                        </Button>
                    </Toolbar>
                </AppBar>
            </div>
            <div>
               {tabValue === 'vcp' && <User setTabValue={setTabValue} />}
            </div>
            <div>
                {tabValue === 'projects' && <ProjectView/>} 
            </div>
        </div>
    )
    
}
export default LandingPage
