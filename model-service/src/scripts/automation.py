import os
import shutil
import subprocess
import click
from pathlib import Path

WORK_DIR = Path.cwd()

@click.command()
@click.option(
    "--mocap_dst",
    default="/app/src/data/mocap_input",
    help="Destination for EasyMocap input.",
)
@click.option(
    "--neural_dst",
    default="/app/src/data/neural_input",
    help="Destination for Neuralbody input.",
)
@click.option("--openpose", default="/app/src/openpose", help="Path to openpose.")
@click.option("--cihp", default="/app/src/models/CIHP_PGN", help="Path to CIHP_PGN.")
@click.option("--mocap", default="/app/src/models/EasyMocap", help="Path to EasyMocap.")
@click.option(
    "--neural", default="/app/src/models/neuralbody", help="Path to Neuralbody."
)
@click.option("--raw_path", default="/app/src/data/", help="Path to raw images.")
@click.option(
    "--intri_path",
   default="/app/src/data/intri.yml",
    help="Path to intri.yml camera config file",
)
@click.option(
    "--extri_path",
    default="/app/src/data/extri.yml",
    help="Path to extri.yml camera config file",
)
@click.argument("projectid")
def automate(
    mocap_dst,
    neural_dst,
    openpose,
    cihp,
    mocap,
    neural,
    raw_path,
    intri_path,
    extri_path,
    projectid
):
    """Automates the volumetric capture workflow. Creates 3D meshes from raw images."""
    print(WORK_DIR)
    ### Run MakeDatasets
    try:
        click.echo("Running CIHP_PGN")
        # Store output in CIHP_PGN so test_pgn.py does not need to be modified
        subprocess.check_output(
            "python scripts/make_dataset.py --delete "
            + raw_path + projectid
            + " CIHP2 "
            + raw_path + projectid,
            shell=True,
        )
        click.echo("Created dataset")
    except Exception as e:
        return e
    """
    ### Run CIHP_PGN
    try:
        # CD into CIHP_PGN so relative paths in test_pgn are correct
        os.chdir(cihp)
        subprocess.check_output(
            "python test_pgn.py " + projectid, shell=True
        )
        # CD back to main directory
        os.chdir(WORK_DIR)
    except Exception as e:
        return e
    """
    
    ### Run EasyMocap
    try:
        click.echo("Running EasyMocap")
        # Create input structure for EasyMocap
        # Separate raw images by camera
        subprocess.check_output(
            "python scripts/separate.py "
            + raw_path + projectid
            + " "
            + raw_path + projectid,
            shell=True,
        )
        # Turn raw images into video by camera
        cams = [x for x in Path(raw_path + projectid + "/cams").iterdir() if x.is_dir()]
        click.echo(cams)
        for cam in cams:
            click.echo(str(cam))
            subprocess.check_output(
                " python scripts/raw_to_easymocap.py "
                + str(cam)
                + " "
                + raw_path + projectid + "/mocap_input",
                shell=True,
            )

        # Move yml files into input directory
        shutil.move(raw_path + projectid + "/intri.yml", raw_path + projectid + "/mocap_input")
        shutil.move(raw_path + projectid + "/extri.yml", raw_path + projectid + "/mocap_input")
    except Exception as e:
        return e
    
    try:
        # Generate OpenPose parameters
        output = subprocess.check_output(
            "python "
            + mocap
            + "/scripts/preprocess/extract_video.py "
            + raw_path + projectid + "/mocap_input"
            + " --openpose "
            + openpose
            + " --handface",
            shell=True,
        )
        # CD into EasyMocap before running
        os.chdir(mocap)
        # Generate SMPL keypoints from EasyMocap
        subprocess.check_output(
            "python apps/demo/mv1p.py "
            + raw_path + projectid + "/mocap_input"
            + " --out "
            + raw_path + projectid + "/mocap_input"
            + "/output/smpl --vis_det --vis_repro --undis --sub_vis 1 2 3 4 --vis_smpl",
            shell=True,
        )
        
        
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
        subprocess.Popen(["python", fpath, "--src", raw_path + projectid + "/mocap_input/output/smpl/smpl", "--dst", raw_path + projectid + "/neural_input"]).wait()
    except Exception as e:
        return e
    
    ### Run Neuralbody
    try:
        # Setup input for Neuralbody
        click.echo("Preparing data for Neuralbody...")
        # Create directory for CIHP mask
        Path.mkdir(Path(neural_dst, "mask_cihp"), parents=True)
        # Replace config file for neuralbody
        shutil.move(raw_path + projectid + "/multi_view_custom.yaml", Path(neural, "configs"))
        env = "python"
        # Rename and place raw images into neural_input
        subprocess.Popen([env, "/app/src/scripts/prep_neuralbody.py"]).wait()
        # Finish setup my separating CIHP mask by camera and renaming files
        src = str(Path(cihp, "output/cihp_edge_maps"))
        dst = str(Path(raw_path + projectid + "/neural_input", "mask_cihp"))
        subprocess.Popen([env, "/app/src/scripts/separate.py", src, dst]).wait()
        subprocess.Popen([env, "/app/src/scripts/prep_neuralbody.py", "--raw_path", dst, "--dst", dst]).wait()
        # Move intri and extri yml files into neural_input
        shutil.move("/app/src/data/mocap_input/intri.yml", neural_dst)
        shutil.move("/app/src/data/mocap_input/extri.yml", neural_dst)
        # Generate annots.npy file
        click.echo("Generating annots.npy...")
        subprocess.Popen([env, "/app/src/scripts/get_annots.py", neural_dst]).wait()
        # Begin training of NeRF model
        os.chdir(neural)
        subprocess.Popen([env, "./train_net.py", "--cfg_file", "./configs/multi_view_custom.yaml", "exp_name", "neuralbodydata", "resume", "False"]).wait()
        click.echo("Finished training.")
        # Generate meshes
        subprocess.Popen([env, "./run.py", "--type", "visualize", "--cfg_file", "./configs/multi_view_custom.yaml", "exp_name", "neuralbodydata", "vis_mesh", "True", "mesh_th", "10"]).wait()
        
    except:
        return RuntimeError("Neuralbody Error")
    


if __name__ == "__main__":
    automate()
