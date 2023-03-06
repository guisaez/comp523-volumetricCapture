import cv2
import numpy as np
import glob
import os
import sys
import json


# data_dir = r'/home/bhargavb/neuralbody/RIL_test_1'
data_dir = sys.argv[1]

def get_cams():
    intri_path = os.path.join(data_dir, 'intri.yml')
    extri_path = os.path.join(data_dir, 'extri.yml')
    assert os.path.exists(intri_path)
    assert os.path.exists(extri_path)

    intri = cv2.FileStorage(intri_path, cv2.FILE_STORAGE_READ)
    extri = cv2.FileStorage(extri_path, cv2.FILE_STORAGE_READ)
    cams = {'K': [], 'D': [], 'R': [], 'T': []}
    for i in range(1,5):
        cams['K'].append(intri.getNode(f'K_{i}').mat())
        cams['D'].append(intri.getNode(f'dist_{i}').mat().T)
        cams['R'].append(extri.getNode(f'Rot_{i}').mat())
        cams['T'].append(extri.getNode(f'T_{i}').mat() * 1000)
    return cams


def get_img_paths():
    all_ims = []
    for i in range(4):
        i = i + 1
        data_root = 'Camera_D415{}'.format(i)
        ims = glob.glob(os.path.join(data_dir, data_root, '*.jpg'))
        ims = [os.path.relpath(x, data_dir) for x in ims]
        ims = np.array(sorted(ims))
        all_ims.append(ims)
    num_img = min([len(ims) for ims in all_ims])
    all_ims = [ims[:num_img] for ims in all_ims]
    all_ims = np.stack(all_ims, axis=1)
    return all_ims


cams = get_cams()
img_paths = get_img_paths()

annot = {}
annot['cams'] = cams

ims = []
for img_path in img_paths:
    data = {}
    data['ims'] = img_path.tolist()
    ims.append(data)
annot['ims'] = ims

np.save(os.path.join(data_dir, 'annots.npy'), annot)
np.save(os.path.join(data_dir, 'annots_python2.npy'), annot, fix_imports=True)