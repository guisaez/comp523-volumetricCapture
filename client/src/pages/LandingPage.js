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
    const [isLogged, setisLogged] = React.useState(false);
    const [tabValue, setTabValue] = React.useState('');
    const [openLogout, setOpenLogout] = React.useState(false);

    React.useEffect(() => {
        checkIsLogIn();
        return () => { };
    }, [isLogged]);
    function checkIsLogIn() {
        axios({
            method: 'get',
            url: '/api/auth/user/'
        }).then((res) => {
            if (!res.data.currentUser) {
                setisLogged(false)
                setTabValue('vcp');
            } else {
                setisLogged(true)
                setTabValue('projects')
            }
        }).catch((err) =>{
            console.log(err)
        })
    }

    const handleLogout = () => {
        axios({
            method: 'post',
            url: '/api/auth/signout/',
            data: {
            }
        }).then((res) => {
            setisLogged(false);
            setOpenLogout(false);
            setTabValue('vcp');
        })
    }


    const handleOpenLogOut = () => {
        setOpenLogout(true);
    };

    const handleCloseLogOut = () => {
        setOpenLogout(false);
    };

    return (
        <div>
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
            <div>
                {tabValue === 'vcp' && <User setTabValue={setTabValue} setisLogged={setisLogged} />}
            </div>
            <div>
                {tabValue === 'projects' && <ProjectView setTabValue={setTabValue} setisLogged={setisLogged} />}
            </div>
        </div>
    )

}
export default LandingPage
