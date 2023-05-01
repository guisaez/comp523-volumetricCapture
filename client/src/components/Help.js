/**
 * Component: Help
 * This component renders a help button and a dialog containing markdown content.
 * Props:
 * helpMarkDown : A string representing the URL to fetch the markdown content from.
 * Functions:
 * handleOpenHelp: A function that is called when the help button is clicked. It fetches the markdown content from the given URL and sets the markdown state.
 * handleCloseHelp: A function that is called when the help dialog is closed. It sets the openHelp state to false.
 * States:
 * markdown: A string to store the fetched markdown content.
 * openHelp: A boolean to indicate if the help dialog is open or closed.
 */
import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import ReactMarkdown from "react-markdown";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

const axios = require("axios").default;

function Help({ helpMarkDown }) {
  // Define state variables
  const [markdown, setMarkdown] = React.useState("");
  const [openHelp, setOpenHelp] = React.useState(false);

  // Function to open the help dialog and fetch the markdown content from the given URL
  const handleOpenHelp = () => {
    axios({
      method: "get",
      url: helpMarkDown,
    })
      .then((response) => {
        setMarkdown(response.data);
      })
      .catch((error) => console.error(error));
    setOpenHelp(true);
  };

  // Function to close the help dialog
  const handleCloseHelp = () => {
    setOpenHelp(false);
  };

  // Render the help button and the help dialog
  return (
    <>
      <Button variant="outlined" onClick={handleOpenHelp} size="large">
        Help
      </Button>
      <Dialog open={openHelp} onClose={handleCloseHelp}>
        <DialogTitle>Help</DialogTitle>
        <DialogContent>
          {/* Close button to close the dialog */}
          <Button
            className="close-btn"
            onClick={handleCloseHelp}
            size="small"
            variant="contained"
            style={{
              margin: 16,
              position: "absolute",
              top: 5,
              right: 5,
              backgroundColor: "red",
            }}
          >
            X
          </Button>
          {/* Render the markdown content */}
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Help;
