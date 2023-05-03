import os
import shutil
import subprocess
import click
from pathlib import Path

WORK_DIR = Path.cwd()


@click.command()
@click.option(
    "--neural_dst",
    default="neural_input",
    help="Destination name for Neuralbody input.",
)
@click.option("--openpose", default="/openpose", help="Path to openpose.")
@click.option("--cihp", default="/app/src/models/CIHP_PGN", help="Path to CIHP_PGN.")
@click.option("--mocap", default="/app/src/models/EasyMocap", help="Path to EasyMocap.")
@click.option(
    "--neural", default="/app/src/models/neuralbody", help="Path to Neuralbody."
)
@click.option("--raw_path", default="/app/src/data/", help="Path to raw images.")
@click.argument("projectid")
def automate(neural_dst, openpose, cihp, mocap, neural, raw_path, projectid):
    """Automates the volumetric capture workflow. Creates 3D meshes from raw images."""

    ### Run MakeDatasets
    try:
        env = "/app/env/CIHP_ENV/bin/python3.7"
        click.echo("Running CIHP_PGN")
        # Store output in CIHP_PGN so test_pgn.py does not need to be modified
        subprocess.Popen(
            [
                env,
                "/app/src/scripts/make_dataset.py",
                "--delete",
                raw_path + projectid,
                "CIHP",
                raw_path + projectid,
            ]
        ).wait()
        click.echo("Created dataset")
    except Exception as e:
        raise e

    ### Run CIHP_PGN
    try:
        # CD into CIHP_PGN so relative paths in test_pgn are correct
        os.chdir(cihp)
        subprocess.Popen([env, "test_pgn.py", projectid]).wait()
        # CD back to main directory
        os.chdir(WORK_DIR)
    except Exception as e:
        raise e

    ### Run EasyMocap
    try:
        env = "/app/env/EASY_ENV/bin/python3.7"
        click.echo("Running EasyMocap")
        # Create input structure for EasyMocap
        # Separate raw images by camera
        subprocess.Popen(
            [
                env,
                "/app/src/scripts/separate.py",
                raw_path + projectid,
                raw_path + projectid,
            ]
        ).wait()
        # Turn raw images into video by camera
        dst = Path(raw_path, projectid, "mocap_input")
        cams = [
            x
            for x in Path(raw_path, projectid).iterdir()
            if x.is_dir() and "Cam" in x.name
        ]
        click.echo(cams)
        for cam in cams:
            click.echo(str(cam))
            subprocess.Popen(
                [env, "/app/src/scripts/raw_to_easymocap.py", str(cam), str(dst)]
            ).wait()

        # Move yml files into input directory
        shutil.move(str(Path(raw_path, projectid, "intri.yml")), dst)
        shutil.move(str(Path(raw_path, projectid, "extri.yml")), dst)
    except Exception as e:
        raise e

    try:
        # Generate OpenPose parameters
        subprocess.Popen(
            [
                env,
                mocap + "/scripts/preprocess/extract_video.py",
                str(dst),
                "--openpose",
                openpose,
                "--handface",
            ]
        ).wait()
        # CD into EasyMocap before running
        os.chdir(mocap)
        # Generate SMPL keypoints from EasyMocap
        subprocess.Popen(
            [
                env,
                "apps/demo/mv1p.py",
                str(dst),
                "--out",
                str(dst) + "/output/smpl",
                "--vis_det",
                "--vis_repro",
                "--undis",
                "--sub_vis",
                "1",
                "2",
                "3",
                "4",
                "--vis_smpl",
            ]
        ).wait()
        os.chdir(WORK_DIR)
        # Convert parameters to neuralbody format
        click.echo("Converting EasyMocap parameters to neuralbody format...")
        # Replace neuralbody script before running
        dst = neural + "/zju_smpl"
        fpath = dst + "/easymocap_to_neuralbody.py"
        if Path(fpath).exists():
            # Remove old file if it exists
            os.remove(fpath)
        shutil.move("/app/src/scripts/easymocap_to_neuralbody.py", dst)
        # Run easymocap_to_neuralbody script
        subprocess.Popen(
            [
                env,
                fpath,
                "--src",
                raw_path + projectid + "/mocap_input/output/smpl/smpl",
                "--dst",
                raw_path + projectid + "/neural_input",
            ]
        ).wait()
    except Exception as e:
        raise e

    ### Run Neuralbody
    try:
        # Setup input for Neuralbody
        click.echo("Preparing data for Neuralbody...")
        # Create directory for CIHP mask
        Path.mkdir(Path(raw_path, projectid, "neural_input", "mask_cihp"), parents=True)
        # Replace config file for neuralbody
        shutil.move(
            str(Path(raw_path, projectid, "multi_view_custom.yaml")),
            Path(neural, "configs"),
        )
        env = "/app/env/NEURAL_ENV/bin/python3.7"
        neural_dst = str(Path(raw_path, projectid, "neural_input"))
        # Rename and place raw images into neural_input
        subprocess.Popen(
            [
                env,
                "/app/src/scripts/prep_neuralbody.py",
                "--raw_path",
                raw_path + projectid,
                "--dst",
                neural_dst,
            ]
        ).wait()
        # Finish setup by separating CIHP mask by camera and renaming files
        src = str(Path(raw_path, projectid, "CIHP_output", "cihp_parsing_maps"))
        dst = str(Path(neural_dst, "mask_cihp"))
        subprocess.Popen([env, "/app/src/scripts/separate.py", src, dst]).wait()
        subprocess.Popen(
            [
                env,
                "/app/src/scripts/prep_neuralbody.py",
                "--raw_path",
                dst,
                "--dst",
                dst,
            ]
        ).wait()
        # Move intri and extri yml files into neural_input
        shutil.move(raw_path + projectid + "/mocap_input/intri.yml", neural_dst)
        shutil.move(raw_path + projectid + "/mocap_input/extri.yml", neural_dst)
        # Generate annots.npy file
        click.echo("Generating annots.npy...")
        subprocess.Popen([env, "/app/src/scripts/get_annots.py", neural_dst]).wait()
        # Begin training of NeRF model
        os.chdir(neural)
        subprocess.Popen(
            [
                env,
                "./train_net.py",
                "--cfg_file",
                "./configs/multi_view_custom.yaml",
                "exp_name",
                "neuralbodydata",
                "resume",
                "False",
            ]
        ).wait()
        click.echo("Finished training.")
        # Generate meshes
        subprocess.Popen(
            [
                env,
                "./run.py",
                "--type",
                "visualize",
                "--cfg_file",
                "./configs/multi_view_custom.yaml",
                "exp_name",
                "neuralbodydata",
                "vis_mesh",
                "True",
                "mesh_th",
                "10",
            ]
        ).wait()
        # Place meshes in data directory
        src = neural + "/data/result/if_nerf/neuralbodydata/mesh"
        dst = Path(raw_path, projectid, "final_output")
        shutil.copytree(src, dst)

    except Exception as e:
        raise e


if __name__ == "__main__":
    automate()
