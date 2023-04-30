/**
 * Components: LandingPage
 * This component is the main page of the application. It displays either the User component or the ProjectView component based on the value of the 'tabValue' state.
 * Props: None
 * Functions:
 * checkIsLogIn : function that sends a GET request to the '/api/auth/user/' endpoint to check if the user is logged in or not.
 * handleLogout : function that sends a POST request to the '/api/auth/signout/' endpoint to log out the user.
 * handleOpenLogOut : function that sets the 'openLogout' state to true to open the logout dialog box.
 * handleCloseLogOut : function that sets the 'openLogout' state to false to close the logout dialog box.
 * States:
 * isLogged : state that stores whether the user is logged in or not.
 * tabValue : state that stores the current tab value ('auth' or 'projects').
 * openLogout : state that stores whether the logout dialog box is open or not.
*/
import * as React from 'react'
import Button from "@mui/material/Button";
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography'
import ProjectView from '../components/ProjectView'
import User from '../components/User'

const axios = require('axios').default

function LandingPage() {
    // state variables
    const [isLogged, setisLogged] = React.useState(false);
    const [tabValue, setTabValue] = React.useState('');
    const [openLogout, setOpenLogout] = React.useState(false);

    // useEffect hook to check if user is logged in
    React.useEffect(() => {
        checkIsLogIn();
        return () => { };
    }, [isLogged]);

    // function to check if user is logged in
    function checkIsLogIn() {
        axios({
            method: 'get',
            url: '/api/auth/user/'
        }).then((res) => {
            if (!res.data.currentUser) {
                setisLogged(false)
                setTabValue('auth');
            } else {
                setisLogged(true)
                setTabValue('projects')
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    // function to handle logout
    const handleLogout = () => {
        axios({
            method: 'post',
            url: '/api/auth/signout/',
            data: {
            }
        }).then((res) => {
            setisLogged(false);
            setOpenLogout(false);
            setTabValue('auth');
        })
    }

    // functions to handle opening and closing of logout dialog box
    const handleOpenLogOut = () => {
        setOpenLogout(true);
    };

    const handleCloseLogOut = () => {
        setOpenLogout(false);
    };

    return (
        <div>
            {/* App bar with VCP logo and logout button (if user is logged in) */}
            <div>
                <AppBar position='static' style={{ backgroundColor: '#222222' }}>
                    <Toolbar variant='dense'>
                        <Box sx={{ flexGrow: 1 }}>
                            <h3 style={{ textAlign: 'center' }}>Volumetric Capture Platform</h3>
                        </Box>
                        {isLogged && (
                            <>
                                <Button
                                    onClick={handleOpenLogOut}
                                    color="inherit"
                                    sx={{ justifyContent: 'flex-end' }}
                                >
                                    Log out
                                </Button>
                                {/* Dialog box for logout confirmation */}
                                <Dialog open={openLogout} onClose={handleCloseLogOut}>
                                    <DialogTitle>Log Out Confirmation</DialogTitle>
                                    <DialogContent>
                                        <Typography variant='body2' color='black'>
                                            {'Are you sure you want to log out? You may lose all the unsaved changes.'}
                                        </Typography>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleCloseLogOut} variant="contained" color="primary">
                                            Cancel
                                        </Button>
                                        <Button onClick={handleLogout} variant="contained" style={{ backgroundColor: 'red', color: 'white' }}>
                                            Continue
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            </>
                        )}
                    </Toolbar>
                </AppBar>
            </div>
            {/* User or ProjectView components rendered based on tabValue state */}
            <div>
                {tabValue === 'auth' && <User setTabValue={setTabValue} setisLogged={setisLogged} />}
            </div>
            <div>
                {tabValue === 'projects' && <ProjectView setTabValue={setTabValue} setisLogged={setisLogged} />}
            </div>
        </div>
    )
}

export default LandingPage

