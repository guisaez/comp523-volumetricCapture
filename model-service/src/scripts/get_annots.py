import cv2
import numpy as np
import glob
import os
import sys
import json
import click
from pathlib import Path


@click.command()
@click.argument("src")
def cli(src):
    """Generate annots for Neuralbody from SRC directory."""
    cams = get_cams(src)
    img_paths = get_img_paths(src)

    annot = {}
    annot["cams"] = cams

    ims = []
    for img_path in img_paths:
        data = {}
        data["ims"] = img_path.tolist()
        ims.append(data)
    annot["ims"] = ims

    np.save(os.path.join(src, "annots.npy"), annot)
    np.save(os.path.join(src, "annots_python2.npy"), annot, fix_imports=True)


def get_cams(data_dir):
    intri_path = os.path.join(data_dir, "intri.yml")
    extri_path = os.path.join(data_dir, "extri.yml")
    assert os.path.exists(intri_path)
    assert os.path.exists(extri_path)

    intri = cv2.FileStorage(intri_path, cv2.FILE_STORAGE_READ)
    extri = cv2.FileStorage(extri_path, cv2.FILE_STORAGE_READ)
    cams = {"K": [], "D": [], "R": [], "T": []}
    for i in range(1, 5):
        cams["K"].append(intri.getNode(f"K_{i}").mat())
        cams["D"].append(intri.getNode(f"dist_{i}").mat().T)
        cams["R"].append(extri.getNode(f"Rot_{i}").mat())
        cams["T"].append(extri.getNode(f"T_{i}").mat() * 1000)
    return cams


def get_img_paths(data_dir):
    all_ims = []
    for i in range(4):
        i = i + 1
        data_root = "Cam{}".format(i)
        ims = Path(data_dir, data_root).glob("*.png")
        ims = [os.path.relpath(x, data_dir) for x in ims]
        ims = np.array(sorted(ims))
        all_ims.append(ims)
    num_img = min([len(ims) for ims in all_ims])
    all_ims = [ims[:num_img] for ims in all_ims]
    all_ims = np.stack(all_ims, axis=1)
    return all_ims


if __name__ == "__main__":
    cli()
