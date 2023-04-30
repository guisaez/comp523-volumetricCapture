import * as React from 'react'
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import ReactMarkdown from 'react-markdown';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button'

const axios = require('axios').default

function Help({helpMarkDown}) {
    const [markdown, setMarkdown] = React.useState('');
    const [openHelp, setOpenHelp] = React.useState(false);

    const handleOpenHelp = () => {
        axios({
            method: 'get',
            url: helpMarkDown
        }).then((response) => {
            setMarkdown(response.data)
        }
        ).catch(error => console.error(error));
        setOpenHelp(true);
    };

    const handleCloseHelp = () => {
        setOpenHelp(false);
    };



    return (
        <>
            <Button variant="outlined" onClick={handleOpenHelp} size="large">Help</Button>
            <Dialog open={openHelp} onClose={handleCloseHelp}>
                <DialogTitle>Help</DialogTitle>
                <DialogContent>
                    <Button className="close-btn" onClick={handleCloseHelp} size="small" variant="contained" style={{ margin: 16, position: 'absolute', top: 5, right: 5, backgroundColor: 'red' }}>
                        X
                    </Button>
                    <ReactMarkdown>{markdown}</ReactMarkdown>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default Help