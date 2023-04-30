import React, { useState } from 'react';
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';

function DeleteButton(props) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    props.onDelete();
    setOpen(false);
  };
  return (
    <>
      {!props.isDisabled && <Button variant="contained" size={props.size} style={{ margin: props.marginVar, backgroundColor: 'red', color: 'white' }} onClick={handleClickOpen}>
        {props.buttonName}
      </Button>}
      {props.isDisabled && <Button variant="contained" size={props.size} style={{ margin: props.marginVar }} disabled onClick={handleClickOpen}>
        {props.buttonName}
      </Button>}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <Typography variant='body2' color='black'>
            {'Are you sure you want to delete this ' + props.deletedThing + '?'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained" color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} variant="contained" style={{ backgroundColor: 'red', color: 'white' }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default DeleteButton;
