import os
import subprocess
import click

@click.command()
@click.option("--name", default="EM_input", help="Name for EasyMocap input.")
@click.option("--openpose", default="./openpose", help="Path to openpose.")
@click.argument("raw_path")
@click.argument("cihp_path")
@click.argument("intri_path")
@click.argument("extri_path")
def automate(name, openpose, raw_path, cihp_path, intri_path, extri_path):
    """Automates the volumetric capture workflow. Creates 3D meshes from raw images."""
    ### Run MakeDatasets
    try:
        # Store output in CIHP_PGN so test_pgn.py does not need to be modifie
        subprocess.check_output("python scripts/make_dataset.py --delete " + raw_path + " CIHP " + cihp_path)
    except:
        # We would need a cleanup function. And/Or define a checkpoint
        return RuntimeError("Error creating dataset")

    ### Run CIHP_PGN
    try:
        # CD into CIHP_PGN so relative paths in test_pgn is correct
        os.chdir(cihp_path)
        subprocess.check_output("python test_pgn.py", shell=True)
        # CD back to main directory
        os.chdir("..")
    except:
        return RuntimeError("CIHP_PGN Error")

    ### Run EasyMocap
    try:
        # Create input structure for EasyMocap
        subprocess.check_output("python scripts/raw_to_easymocap.py " + raw_path + " " + name + " " + intri_path + " " + extri_path)
    except:
        return RuntimeError("Error creating EasyMocap input")
    #try:
        # Generate OpenPose parameters
        #subprocess.check_output(
        #    "python ./EasyMocap/scripts/preprocess/extract_video.py " + name + " --openpose " + openpose + " --handface",
        #    shell=True
       # )
        # Generate SMPL keypoints from EasyMocap
        #subprocess.check_output(
        #    "python ./EasyMocap/apps/demo/mv1p.py " + name + " --out " + name + "/output/smpl --vis_det --vis_repro --undis --sub_vis 1 2 3 4 --vis_smpl",
        #    shell=True
        #)
    #except:
        #return RuntimeError("EasyMocap Error")


if __name__ == "__main__":
    automate()
