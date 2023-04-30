/**
 * Component: DeleteButton
 * This component renders a delete button with a confirmation dialog.
 * Props:
 * isDisabled: A boolean that specifies whether the button should be disabled or not
 * size: A string that specifies the size of the button
 * marginVar: A integer that specifies the margin of the button
 * buttonName: A string that specifies the name to be displayed on the button
 * onDelete: A function that specifies the function to be called when the delete button is clicked
 * deletedThing: A string that specifies the name of the thing to be deleted
 * Functions:
 * handleClickOpen: A function that opens the confirmation dialog when the delete button is clicked
 * handleClose: A function that closes the confirmation dialog when the user clicks outside the dialog or presses the ESC key
 * handleDelete: A function that handles the delete action and closes the confirmation dialog
 * States:
 * open: A boolean that manages the visibility of the confirmation dialog
 */

import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";

// This component renders a delete button with a confirmation dialog.
function DeleteButton(props) {
  // Declare state variable to manage the visibility of the confirmation dialog.
  const [open, setOpen] = useState(false);

  // Open the confirmation dialog when the button is clicked.
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Close the confirmation dialog when the user clicks outside the dialog or presses the ESC key.
  const handleClose = () => {
    setOpen(false);
  };

  // Handle the delete action and close the confirmation dialog.
  const handleDelete = () => {
    props.onDelete();
    setOpen(false);
  };

  // Render the delete button and the confirmation dialog.
  return (
    <>
      {/* Render the button as enabled or disabled depending on the isDisabled prop. */}
      {!props.isDisabled && (
        <Button
          variant="contained"
          size={props.size}
          style={{
            margin: props.marginVar,
            backgroundColor: "red",
            color: "white",
          }}
          onClick={handleClickOpen}
        >
          {props.buttonName}
        </Button>
      )}
      {props.isDisabled && (
        <Button
          variant="contained"
          size={props.size}
          style={{ margin: props.marginVar }}
          disabled
          onClick={handleClickOpen}
        >
          {props.buttonName}
        </Button>
      )}
      {/* Render the confirmation dialog with the appropriate title and message. */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="black">
            {"Are you sure you want to delete this " + props.deletedThing + "?"}
          </Typography>
        </DialogContent>
        {/* Render two buttons to allow the user to confirm or cancel the delete action. */}
        <DialogActions>
          <Button onClick={handleClose} variant="contained" color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            style={{ backgroundColor: "red", color: "white" }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default DeleteButton;
