/**
 * Component: FileManager
 * A reusable component for file upload/update, download, delete.
 * Props:
 * info: object that contains information about the project
 * fileType: string that determines the type of file (zip, extrinsic, or intrinsic)
 * format: string that determines the file format to accept in the input file element
 * Functions:
 * handleFileReader: function that handles the file selection by the user and updates the state accordingly
 * handleUpload: function that handles the file upload to the server and updates the state accordingly
 * handleDelete: function that handles the file deletion from the server and updates the state accordingly
 * handleDownload: function that handles the file download from the server
 * State:
 * Id: string that represents the id of the uploaded file
 * File: object that represents the selected file to be uploaded
 * ButtonName: string that represents the text of the upload button (either "Upload" or "Update")
 * FileName: string that represents the name of the uploaded file
 * Ref: reference to the input file element
 * selectedName: string that represents the name of the selected file
 * disableUpload: boolean that determines if the upload button should be disabled
 * disableDelete: boolean that determines if the delete button should be disabled
 */

import * as React from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import DeleteButton from "./DeleteButton";
const axios = require("axios").default;

function FileManager({ info, fileType, format }) {
  // Initialize state variables.
  const [Id, setId] = React.useState("");
  const [File, setFile] = React.useState(null);
  const [ButtonName, setButtonName] = React.useState("");
  const [FileName, setFileName] = React.useState("None");
  const Ref = React.useRef(null);
  const [selectedName, setSelectedName] = React.useState("None");
  const [disableUpload, setDisableUpload] = React.useState(true);
  const [disableDelete, setDisableDelete] = React.useState(true);

  // Use an effect to retrieve information about the file from the server when the component mounts or when the fileType changes.
  React.useEffect(() => {
    axios({
      method: "get",
      url: "/api/projects/" + info.id,
    })
      .then((res) => {
        let resFileId = "";
        if (fileType === "zip") {
          resFileId = res.data.project.zip_fileId;
        } else if (fileType === "extrinsic") {
          resFileId = res.data.project.extrinsic_fileId;
        } else if (fileType === "intrinsic") {
          resFileId = res.data.project.intrinsic_fileId;
        }

        // If the file exists, set the button name to 'Update fileType', set the file ID, and retrieve the file name from the server.
        if (resFileId) {
          setButtonName("Update " + fileType);
          setId(resFileId);
          axios({
            method: "get",
            url: "/api/files/" + resFileId,
          }).then((res) => {
            setFileName(res.data.file.name);
          });
        }
        // Otherwise, set the button name to 'Upload fileType'.
        else {
          setButtonName("Upload " + fileType);
        }

        // Disable the delete button if the file does not exist.
        setDisableDelete(!resFileId);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [fileType, info.id]);

  // Update state variables when a file is selected.
  const handleFileReader = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setSelectedName(selectedFile.name);
    setDisableUpload(false);
  };

  // Upload or update the file when the upload button is clicked.
  const handleUpload = () => {
    const formData = new FormData();
    formData.append("file", File);
    formData.append("type", fileType);

    // If the button name is 'Upload fileType', create a new file.
    if (ButtonName === "Upload " + fileType) {
      const route = "/api/files/upload/" + info.id;
      axios
        .post(route, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          setId(res.data.file.id);
          setDisableUpload(true);
          setDisableDelete(false);
          setButtonName("Update " + fileType);
          setFileName(res.data.file.name);
          setFile(null);
          Ref.current.value = null;
          setSelectedName("None");
        })
        .catch((err) => {
          setDisableUpload(false);
        });
    }
    // If the button name is 'Update fileType', update the existing file.
    else if (ButtonName === "Update " + fileType) {
      const route = "/api/files/update/" + Id;
      axios
        .put(route, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          setId(res.data.file.id);
          setDisableUpload(true);
          setDisableDelete(false);
          setButtonName("Update " + fileType);
          setFileName(res.data.file.name);
          setFile(null);
          Ref.current.value = null;
          setSelectedName("None");
        })
        .catch((err) => {
          setDisableUpload(false);
        });
    }
  };
  // delete the file.
  const handleDelete = () => {
    axios({
      method: "delete",
      url: "/api/files/delete",
      data: {
        projectId: info.id,
        id: Id,
      },
    })
      .then((res) => {
        setDisableDelete(true);
        setButtonName("Upload " + fileType);
        setDisableUpload(!File);
        setFileName("None");
      })
      .catch((err) => {});
  };
  // download the file
  const handleDownload = (id, fileName) => {
    axios({
      method: "get",
      url: "/api/files/download/" + id,
      responseType: "blob",
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
    });
  };

  return (
    <Grid item xs={6}>
      <Card
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "start",
        }}
      >
        <Stack spacing={5}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {fileType.charAt(0).toUpperCase() + fileType.slice(1) + " File"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {"Uploaded File is " + FileName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {"Chosen File is " + selectedName}
            </Typography>
          </CardContent>
          <CardActions>
            <Stack spacing={1}>
              <div>
                {/* Choose File Button*/}
                <Button
                  variant="outlined"
                  component="label"
                  style={{ margin: 8 }}
                >
                  {"Choose " + fileType}
                  <input
                    hidden
                    accept={format}
                    type="file"
                    onChange={handleFileReader}
                    style={{ display: "none" }}
                    ref={Ref}
                  />
                </Button>
                {/* Upload/Update Button*/}
                <Button
                  onClick={handleUpload}
                  variant="contained"
                  disabled={disableUpload}
                  style={{ margin: 8 }}
                >
                  {ButtonName}
                </Button>
              </div>
              <div>
                {/* Delete File Button*/}
                <DeleteButton
                  onDelete={handleDelete}
                  marginVar={8}
                  isDisabled={disableDelete}
                  deletedThing={fileType + " file"}
                  size="medium"
                  buttonName={"Delete " + fileType}
                ></DeleteButton>
                {/* Download Button*/}
                <Button
                  onClick={(e) => {
                    handleDownload(Id, FileName);
                  }}
                  variant="outlined"
                  style={{ margin: 8 }}
                  disabled={FileName === "None"}
                >
                  {"Download " + fileType}
                </Button>
              </div>
            </Stack>
          </CardActions>
        </Stack>
      </Card>
    </Grid>
  );
}

export default FileManager;
