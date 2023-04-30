import * as React from 'react'
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import DialogActions from '@mui/material/DialogActions';

function BackButton({ setView, isSafed }) {
    const [openBack, setOpenBack] = React.useState(false);

    const handleOpenBack = () => {
        if (!isSafed)
            setOpenBack(!isSafed);
        else
            handleBack();
    };

    const handleBack = () => {
        setView('projectList');
    };

    const handleCloseBack = () => {
        setOpenBack(false);
    };

    return (
        <Grid item>
            <Button variant="outlined" onClick={handleOpenBack} size="large">Back</Button>
            <Dialog open={openBack} onClose={handleCloseBack}>
                <DialogTitle>Confirmation</DialogTitle>
                <DialogContent>
                    <Typography variant='body2' color='black'>
                        {'Are you sure you want to disgard the name change?'}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseBack} variant="contained" color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleBack} variant="contained" style={{ backgroundColor: 'red', color: 'white' }}>
                        Continue
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    )
}
export default BackButton