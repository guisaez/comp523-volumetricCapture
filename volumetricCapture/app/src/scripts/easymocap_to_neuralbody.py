import os
import sys
import json
import click
from pathlib import Path

import numpy as np
import torch
from tqdm import tqdm

sys.path.append("..\\")
from smplmodel.body_model import SMPLlayer


@click.command()
@click.option(
    "--src",
    default="/app/src/data/mocap_input/output/smpl/smpl",
    help="Source for EasyMocap SMPL output.",
)
@click.option(
    "--dst",
    default="/app/src/data/neural_input",
    help="Destination for neuralbody input.",
)
@click.option(
    "--smplx_path",
    default="/app/src/models/EasyMocap/data/smplx",
    help="Path to SMPL models.",
)
def cli(src, dst, smplx_path):
    """Convert EasyMocap ouput into input for Neuralbody."""
    pathlist = Path(src).glob("*.json")
    pathlist = list(pathlist)  # convert form list to generator
    for path in tqdm(pathlist):
        params, vertices = load_SMPL_from_json(str(path), smplx_path)

        params_out_dir = Path(dst, "params")
        vertices_out_dir = Path(dst, "vertices")
        Path.mkdir(params_out_dir, parents=True, exist_ok=True)
        Path.mkdir(vertices_out_dir, parents=True, exist_ok=True)
        np.save(Path(params_out_dir, path.stem + ".npy"), params)
        np.save(Path(vertices_out_dir, path.stem + ".npy"), vertices)


def load_SMPL_from_json(params_file: str, model_folder: str):
    easymocap_params = json.load(open(params_file))[0]
    poses = np.array(easymocap_params["poses"])
    Rh = np.array(easymocap_params["Rh"])
    Th = np.array(easymocap_params["Th"])
    shapes = np.array(easymocap_params["shapes"])

    # the params of neural body
    params = {"poses": poses, "Rh": Rh, "Th": Th, "shapes": shapes}

    # The newlly fitted SMPL parameters consider pose blend shapes.
    new_params = True

    ## create smpl model
    device = torch.device("cpu")
    body_model = SMPLlayer(
        os.path.join(model_folder, "smpl"),
        gender="neutral",
        device=device,
        regressor_path=os.path.join(model_folder, "J_regressor_body25.npy"),
    )
    body_model.to(device)

    ## load SMPL zju
    vertices = body_model(
        return_verts=True, return_tensor=False, new_params=new_params, **params
    )
    return params, vertices


if __name__ == "__main__":
    cli()
