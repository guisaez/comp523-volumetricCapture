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
@click.option("--openpose", default="/openpose", help="Path to openpose.")
@click.option("--cihp", default="/app/src/models/CIHP_PGN", help="Path to CIHP_PGN.")
@click.option("--mocap", default="/app/src/models/EasyMocap", help="Path to EasyMocap.")
@click.option(
    "--neural", default="/app/src/models/neuralbody", help="Path to Neuralbody."
)
@click.option("--raw_path", default="/app/src/data", help="Path to raw images.")
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
):
    """Automates the volumetric capture workflow. Creates 3D meshes from raw images."""
    ### Run MakeDatasets
    try:
        click.echo("Running CIHP_PGN")
        # Store output in CIHP_PGN so test_pgn.py does not need to be modified
        subprocess.check_output(
            "/app/env/CIHP_ENV/bin/python3.7 scripts/make_dataset.py --delete "
            + raw_path
            + " CIHP "
            + cihp,
            shell=True,
        )
        click.echo("Created dataset")
    except:
        # We would need a cleanup function. And/Or define a checkpoint
        return RuntimeError("Error creating dataset")

    ### Run CIHP_PGN
    try:
        # CD into CIHP_PGN so relative paths in test_pgn are correct
        os.chdir(cihp)
        #subprocess.check_output(
        #    "/app/env/CIHP_ENV/bin/python3.7 test_pgn.py", shell=True
        #)
        # CD back to main directory
        os.chdir(WORK_DIR)
    except:
        return RuntimeError("CIHP_PGN Error")

    ### Run EasyMocap
    try:
        click.echo("Running EasyMocap")
        # Create input structure for EasyMocap
        # Separate raw images by camera
        subprocess.check_output(
            "/app/env/EASY_ENV/bin/python3.7 scripts/separate.py "
            + raw_path
            + " "
            + raw_path,
            shell=True,
        )
        # Turn raw images into video by camera
        cams = [x for x in Path(raw_path).iterdir() if x.is_dir()]
        click.echo(cams)
        for cam in cams:
            subprocess.check_output(
                "/app/env/EASY_ENV/bin/python3.7 scripts/raw_to_easymocap.py "
                + str(cam)
                + " "
                + mocap_dst,
                shell=True,
            )

        # Move yml files into input directory
        shutil.move(intri_path, mocap_dst)
        shutil.move(extri_path, mocap_dst)
    except:
        return RuntimeError("Error creating EasyMocap input")
    try:
        # Generate OpenPose parameters
        subprocess.check_output(
            "/app/env/EASY_ENV/bin/python3.7 "
            + mocap
            + "/scripts/preprocess/extract_video.py "
            + mocap_dst
            + " --openpose "
            + openpose
            + " --handface",
            shell=True,
        )
        # CD into EasyMocap before running
        os.chdir(mocap)
        # Generate SMPL keypoints from EasyMocap
        subprocess.check_output(
            "/app/env/EASY_ENV/bin/python3.7 ./apps/demo/mv1p.py "
            + mocap_dst
            + " --out "
            + mocap_dst
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
        subprocess.check_output(
            "/app/env/NEURAL_ENV/bin/python3.7 " + fpath, shell=True
        )
    except:
        return RuntimeError("EasyMocap Error")

    ### Run Neuralbody
    try:
        # Setup input for Neuralbody
        click.echo("Preparing data for Neuralbody...")
        # Create directory for CIHP mask
        Path.mkdir(Path(neural_dst, "mask_cihp"), parents=True)
        # Replace config file for neuralbody
        shutil.move("/app/src/multi_view_custom.yaml", Path(neural, "configs"))
        env = "/app/env/NEURAL_ENV/bin/python3.7"
        # Rename and place raw images into neural_input
        subprocess.Popen([env, "/app/src/scripts/prep_neuralbody.py"]).wait()
        # Finish setup my separating CIHP mask by camera and renaming files
        src = str(Path(cihp, "output/cihp_edge_maps"))
        dst = str(Path(neural_dst, "mask_cihp"))
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
        #subprocess.Popen([env, "./train_net.py", "--cfg_file", "./configs/multi_view_custom.yaml", "exp_name", "neuralbodyformat", "resume", "False"]).wait()
        subprocess.check_output("/app/env/NEURAL_ENV/bin/python3.7 ./train_net.py --cfg_file ./configs/multi_view_custom.yaml exp_name neuralbodyformat resume False", shell=True)
        # Generate meshes
        # subprocess.Popen([env, "./run.py", "--type", "visualize", "--cfg_file", "./configs/multi_view_custom.yaml", "exp_name", "test", "vis_mesh", "True", "mesh_th", "10"]).wait()
        # subprocess.check_output("/app/env/NEURAL_ENV/bin/python3.7 ./run.py --type visualize --cfg_file ./configs/multi_view_custom.yaml exp_name test vis_mesh True mesh_th 10", shell=True)

    except:
        return RuntimeError("Neuralbody Error")


if __name__ == "__main__":
    automate()
