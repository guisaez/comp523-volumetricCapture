/**
 * Components: BackButton
 * Renders a "Back" button and a confirmation dialog to navigate back to the projectList view or
 * prompt the user to confirm their intention to discard unsaved changes.
 * Props:
 * setView: A function that sets the current view state to navigate back to the projectList view.
 * isSafed: A boolean value that indicates whether there are any unsaved changes.
 * Functions:
 * handleOpenBack: A function that opens the confirmation dialog if there are unsaved changes,
 * otherwise navigates back to the projectList view.
 * handleBack: A function that navigates back to the projectList view.
 * handleCloseBack: A function that closes the confirmation dialog.
 * States:
 * openBack: A boolean value that indicates if the dialog is opened
 */
import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import DialogActions from "@mui/material/DialogActions";

function BackButton({ setView, isSafed }) {
  // Initialize state for the confirmation dialog
  const [openBack, setOpenBack] = React.useState(false);

  // Handles opening the confirmation dialog if there are unsaved changes,
  // otherwise navigates back to the projectList view
  const handleOpenBack = () => {
    if (!isSafed) setOpenBack(!isSafed);
    else handleBack();
  };

  // Navigates back to the projectList view
  const handleBack = () => {
    setView("projectList");
  };

  // Closes the confirmation dialog
  const handleCloseBack = () => {
    setOpenBack(false);
  };

  return (
    <Grid item>
      {/* Renders a "Back" button that, when clicked, calls handleOpenBack */}
      <Button variant="outlined" onClick={handleOpenBack} size="large">
        Back
      </Button>
      {/* Renders the confirmation dialog */}
      <Dialog open={openBack} onClose={handleCloseBack}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="black">
            {"Are you sure you want to disgard the name change?"}
          </Typography>
        </DialogContent>
        <DialogActions>
          {/* Renders a "Cancel" button that closes the dialog */}
          <Button onClick={handleCloseBack} variant="contained" color="primary">
            Cancel
          </Button>
          {/* Renders a "Continue" button that navigates back to the projectList view */}
          <Button
            onClick={handleBack}
            variant="contained"
            style={{ backgroundColor: "red", color: "white" }}
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default BackButton;
