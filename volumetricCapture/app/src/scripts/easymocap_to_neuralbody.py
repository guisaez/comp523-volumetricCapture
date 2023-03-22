import os
import sys
import json
from pathlib import Path

import numpy as np
import torch
from tqdm import tqdm

sys.path.append("..\\")
from smplmodel.body_model import SMPLlayer

def load_SMPL_from_json(params_file: str):
    easymocap_params = json.load(open(params_file))[0]
    poses = np.array(easymocap_params['poses'])
    Rh = np.array(easymocap_params['Rh'])
    Th = np.array(easymocap_params['Th'])
    shapes = np.array(easymocap_params['shapes'])

    # the params of neural body
    params = {'poses': poses, 'Rh': Rh, 'Th': Th, 'shapes': shapes}

    # The newlly fitted SMPL parameters consider pose blend shapes.
    new_params = True

    ## create smpl model
    # model_folder = 'data/zju_mocap/smplx'
    model_folder = r'C:\Users\Bhargav\Documents\Volumetric_Capture\volumetric-capture-multirepo\EasyMocap\data\smplx'
    device = torch.device('cpu')
    body_model = SMPLlayer(os.path.join(model_folder, 'smpl'),
                        gender='neutral',
                        device=device,
                        regressor_path=os.path.join(model_folder,
                                                    'J_regressor_body25.npy'))
    body_model.to(device)

    ## load SMPL zju
    vertices = body_model(return_verts=True,
                        return_tensor=False,
                        new_params=new_params,
                        **params)
    return params, vertices

# PR idea: if given dir, convert all .json in dir, if given .json, just convert that file
#     - specify output dir
if __name__ == "__main__":
    params_dir = r"C:\Users\Bhargav\Documents\Volumetric_Capture\volumetric-capture-multirepo\EasyMocap\data\RIL_test_1\output\smpl\smpl"
    out_dir = r"C:\Users\Bhargav\Documents\Volumetric_Capture\volumetric-capture-multirepo\neuralbody\RIL_test_1"

    pathlist = Path(params_dir).glob('*.json')
    pathlist = list(pathlist)  # convert form list to generator
    for path in tqdm(pathlist):
        params, vertices = load_SMPL_from_json(str(path))

        params_out_dir = os.path.join(out_dir, 'params')
        vertices_out_dir = os.path.join(out_dir, 'vertices')
        os.makedirs(params_out_dir, exist_ok=True)
        os.makedirs(vertices_out_dir, exist_ok=True)
        np.save(os.path.join(params_out_dir, path.stem + '.npy'), params)
        np.save(os.path.join(vertices_out_dir, path.stem + '.npy'), vertices)
