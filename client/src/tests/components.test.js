import { render } from "@testing-library/react";
import User from "./../components/User";
import ProjectView from "./../components/ProjectView";
import ProjectList from "./../components/ProjectList";
import ProjectEdit from "./../components/ProjectEdit";
import Help from "../components/Help";
import BackButton from "../components/BackButton";
import DeleteButton from "../components/DeleteButton";
import FileManager from "../components/FileManager";
import Login from "../components/Login";
import ProjectCard from "../components/ProjectCard";
import SettingManager from "../components/SettingManager";
import Signup from "../components/Signup";

test("renders User", () => {
  render(<User />);
});

test("renders ProjectView", () => {
  render(<ProjectView />);
});

test("renders ProjectList", () => {
  render(<ProjectList />);
});

test("renders ProjectEdit", () => {
  render(
    <ProjectEdit
      project={{
        projectName: "projectName",
        userId: "value.userId",
        createdAt: "value.createdAt",
        lastModifiedAt: "value.lastModifiedAt",
        processStatus: "value.processStatus",
        version: "value.version",
        zip_fileId: "value.zip_fileId",
        extrinsic_fileId: "value.extrinsic_fileId",
        intrinsic_fileId: "value.intrinsic_fileId",
        output_fileId: "value.output_fileId",
        id: "value.id",
      }}
    />
  );
});

test("renders Help", () => {
  render(<Help />);
});

test("renders BackButton", () => {
  render(<BackButton />);
});

test("renders DeleteButton", () => {
  render(<DeleteButton />);
});

test("renders FileManager", () => {
  render(<FileManager fileType={"pdf"} info={{ id: "465465" }} />);
});

test("renders Login", () => {
  render(<Login />);
});

test("renders ProjectCard", () => {
  render(
    <ProjectCard
      value={{
        projectName: "projectName",
        userId: "value.userId",
        createdAt: "value.createdAt",
        lastModifiedAt: "value.lastModifiedAt",
        processStatus: "value.processStatus",
        version: "value.version",
        zip_fileId: "value.zip_fileId",
        extrinsic_fileId: "value.extrinsic_fileId",
        intrinsic_fileId: "value.intrinsic_fileId",
        output_fileId: "value.output_fileId",
        id: "value.id",
      }}
    />
  );
});

test("renders SettingManager", () => {
  render(<SettingManager info={{ id: "465465" }} />);
});

test("renders Signup", () => {
  render(<Signup />);
});
