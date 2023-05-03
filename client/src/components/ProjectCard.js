/**
 * Components: ProjectCard
 * This component represents the project card component that shows the project name, creation date, and status. It also contains buttons to edit, delete, and download the project, depending on the project's status.
 * Props:
 * setNumProjects: a function to set the total number of projects.
 * setView: a function to set the current view of the user.
 * value: an object containing the project's information.
 * setProject: a function to set the current project being edited.
 * setisLogged: a function to set the current logged-in status of the user.
 * Functions:
 * handleEdit: a function to handle the edit button click.
 * handleDelete: a function to handle the delete button click.
 * handleDownload: a function to handle the download button click.
 * States:
 * errorMsg: a string representing the error message if there's any.
 * error: a boolean value indicating if there's an error.
 * buttonName: a string representing the name of the button displayed in the project card.
 * projectInfo: an object containing the project's information such as the project name, creation date, status, etc.
 */
import * as React from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import DeleteButton from "./DeleteButton";

const axios = require("axios").default;

function ProjectCard({
  setNumProjects,
  setView,
  value,
  setProject,
  setisLogged,
  ...props
}) {
  // Define state variables using React.useState hook
  const [errorMsg, setErrorMsg] = React.useState("");
  const [error, setError] = React.useState(false);
  const [buttonName, setButtonName] = React.useState("");
  const [projectInfo, setInfo] = React.useState({
    // Initialize state with default values
    projectName: value.projectName,
    userId: value.userId,
    createdAt: value.createdAt,
    lastModifiedAt: value.lastModifiedAt,
    processStatus: value.processStatus,
    version: value.version,
    zip_fileId: value.zip_fileId,
    extrinsic_fileId: value.extrinsic_fileId,
    intrinsic_fileId: value.intrinsic_fileId,
    output_fileId: value.output_fileId,
    id: value.id,
  });

  // Use the useEffect hook to update buttonName when projectInfo.processStatus changes
  React.useEffect(() => {
    if (projectInfo.processStatus === "not-started") {
      setButtonName("Run Model");
    } else if (projectInfo.processStatus === "running") {
      setButtonName("Running");
    } else if (projectInfo.processStatus === "error") {
      setButtonName("Try Again");
      setError(true);
      setErrorMsg("Errors happened!");
    } else if (projectInfo.processStatus === "completed") {
      setButtonName("Download Model");
    }
  }, [projectInfo.processStatus]);

  // Define event handler functions
  const handleEdit = () => {
    setProject(value);
    setView("projectEdit");
  };

  const handleDelete = () => {
    axios({
      method: "delete",
      url: "/api/projects/" + value.id,
    })
      .then((res) => {
        axios({
          method: "get",
          url: "/api/projects/",
        })
          .then((res) => {
            setNumProjects(res.data.projects);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDownload = () => {
    // If project status is not-started or error, start a new run
    if (
      projectInfo.processStatus === "not-started" ||
      projectInfo.processStatus === "error"
    ) {
      axios({
        method: "post",
        url: "/api/projects/run/" + value.id,
      })
        .then((res) => {
          setInfo({
            projectName: res.data.project.projectName,
            userId: res.data.project.userId,
            createdAt: res.data.project.createdAt,
            lastModifiedAt: res.data.project.lastModifiedAt,
            processStatus: res.data.project.processStatus,
            version: res.data.project.version,
            zip_fileId: res.data.project.zip_fileId,
            extrinsic_fileId: res.data.project.extrinsic_fileId,
            intrinsic_fileId: res.data.project.intrinsic_fileId,
            output_fileId: res.data.project.output_fileId,
            id: res.data.project.id,
          });
          setButtonName("Running");
          setError(false);
          setErrorMsg("");
          axios({
            method: "get",
            url: "/api/projects/",
          })
            .then((res) => {
              setNumProjects(res.data.projects);
            })
            .catch((err) => {});
        }, [])
        .catch(() => {
          setError(true);
          setErrorMsg("Failed! Please check the files!");
        });
    } else if (projectInfo.processStatus === "completed") {
      // Download the output file
      axios({
        method: "get",
        url: "/api/files/download/" + projectInfo.output_fileId.id,
        responseType: "blob",
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          projectInfo.projectName + "_" + projectInfo.output_fileId.name
        );
        document.body.appendChild(link);
        link.click();
      });
    }
  };
  return (
    <Card style={{ height: "30%", width: "20%", margin: 16, padding: 10 }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {projectInfo.projectName ? projectInfo.projectName : "Project"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {"Created at " + new Date(projectInfo.createdAt).toLocaleString()}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {"Status is " + projectInfo.processStatus}
        </Typography>
      </CardContent>
      <CardActions>
        <Grid
          container
          direction="row"
          justifyContent="space-around"
          spacing={1}
          alignItems="center"
          margin="auto"
        >
          {/*Edit button*/}
          <Grid item>
            <Button variant="contained" onClick={handleEdit}>
              Edit
            </Button>
          </Grid>
          {/*Delete button (disabled when the project is running)*/}
          <Grid item>
            <DeleteButton
              onDelete={handleDelete}
              marginVar={8}
              isDisabled={projectInfo.processStatus === "running"}
              deletedThing="project"
              size="medium"
              buttonName="Delete"
            ></DeleteButton>
          </Grid>
          {/*Download/Run/Try Again button (disabled when the project is running, only showing running)*/}
          <Grid item>
            <Button
              variant="outlined"
              onClick={handleDownload}
              disabled={
                projectInfo.processStatus === "running" ||
                (buttonName === "Run Model" &&
                  (!projectInfo.zip_fileId ||
                    !projectInfo.extrinsic_fileId ||
                    !projectInfo.intrinsic_fileId))
              }
            >
              {buttonName}
            </Button>
          </Grid>
        </Grid>
      </CardActions>
      {error && (
        <Alert style={{ justifyContent: "center" }} severity="error">
          {errorMsg}
        </Alert>
      )}
    </Card>
  );
}

export default ProjectCard;
