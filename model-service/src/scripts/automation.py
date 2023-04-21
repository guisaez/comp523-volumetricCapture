import os
import subprocess
import click

@click.command()
@click.option("--name", default="EM_input", help="Name for EasyMocap input.")
@click.option("--openpose", default="./openpose", help="Path to openpose.")
@click.option("--cihp", default="./models/CIHP_PGN", help="Path to CIHP_PGN.")
@click.option("--raw_path")
@click.option("--intri_path")
@click.option("--extri_path")
@click.argument("projectid")
def automate(name, openpose, cihp, raw_path, intri_path, extri_path, projectid):
    """Automates the volumetric capture workflow. Creates 3D meshes from raw images."""
    ### Run MakeDatasets
    try:
        # Store output in CIHP_PGN so test_pgn.py does not need to be modified
        data_path = 'data/' + projectid
        output = subprocess.check_output(
            "python scripts/make_dataset.py " + data_path + " " + "CIHP2 " + data_path
        , shell=True)
        print(output)
    except:
        # We would need a cleanup function. And/Or define a checkpoint
        return RuntimeError("Error creating dataset")

    ### Run CIHP_PGN
    """
    try:
        # CD into CIHP_PGN so relative paths in test_pgn is correct
        if(cihp is None):
            cihp = "/models/CIHP"
        os.chdir(cihp)
        subprocess.check_output("python test_pgn.py " + projectid, shell=True)
        # CD back to main directory
        os.chdir("../../")
    except:
        return RuntimeError("CIHP_PGN Error")
    """
    
    ### Run EasyMocap
    try:
        # Create input structure for EasyMocap
        subprocess.check_output(
            "python scripts/raw_to_easymocap.py "
            + data_path
            + " "
            + name
            + " "
            + data_path + "/intrinsic.yml"
            + " "
            + data_path + "/extrinsic.yml"
        )
    except:
        return RuntimeError("Error creating EasyMocap input")
    """
    try:
        # Generate OpenPose parameters
        subprocess.check_output(
            "python ./EasyMocap/scripts/preprocess/extract_video.py "
            + name
            + " --openpose "
            + openpose
            + " --handface",
            shell=True,
        )
        # Generate SMPL keypoints from EasyMocap
        # subprocess.check_output(
        #    "python ./EasyMocap/apps/demo/mv1p.py " + name + " --out " + name + "/output/smpl --vis_det --vis_repro --undis --sub_vis 1 2 3 4 --vis_smpl",
        #    shell=True
        # )
        # Deactivate venv
        subprocess.check_output("deactivate", shell=True)
    except:
        return RuntimeError("EasyMocap Error")

    ### Run Neuralbody
    try:
        # Activate Neuralbody env
        subprocess.check_output("source NEURAL_ENV/bin/activate", shell=True)

        # Deactivate venv
        subprocess.check_output("deactivate", shell=True)
    except:
        return RuntimeError("Neuralbody Error")
    """

if __name__ == "__main__":
    automate()
