import os
import shutil
import subprocess
import click
from pathlib import Path


@click.command()
@click.option(
    "--mocap_dst", default="/app/src/data/mocap_input", help="Name for EasyMocap input."
)
@click.option("--openpose", default="/openpose", help="Path to openpose.")
@click.option("--cihp", default="/app/src/models/CIHP_PGN", help="Path to CIHP_PGN.")
@click.option("--mocap", default="/app/src/models/EasyMocap", help="Path to EasyMocap")
@click.option("--raw_path", default="/app/src/data/raw", help="Path to raw images.")
@click.option(
    "--intri_path", default="/app/src/data", help="Path to intri.yml camera config file"
)
@click.option(
    "--extri_path", default="/app/src/data", help="Path to extri.yml camera config file"
)
def automate(mocap_dst, openpose, cihp, mocap, raw_path, intri_path, extri_path):
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
        work_dir = os.getcwd()
        os.chdir(cihp)
        # subprocess.check_output("/app/env/CIHP_ENV/bin/python3.7 test_pgn.py", shell=True)
        # CD back to main directory
        os.chdir(work_dir)
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
        os.chdir("-")
    except:
        return RuntimeError("EasyMocap Error")

    ### Run Neuralbody
    try:
        # Activate Neuralbody env
        subprocess.check_output("source /app/env/NEURAL_ENV/bin/activate", shell=True)

    except:
        return RuntimeError("Neuralbody Error")


if __name__ == "__main__":
    automate()
