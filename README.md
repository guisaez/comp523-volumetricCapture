# Volumetric Capture

## Table of Contents
* #### [Installation](#installation-1)
* #### [Folder Structure](#folder-structure-1)
* #### [Running Tests](#running-tests-1)
* #### [Authentication Service](./documentation/auth-service/AuthenticationService.md)
* #### [Client Service](./documentation/client/ClientServiceDocumentation.md)
* #### [Acknowledgements](#acknowledgements-1)
---
## Installation
### Setting Up  Docker Environment
1. Install [Docker](https://docs.docker.com/engine/install/).
2. From inside project directory run:
```
git submodule update --init --recursive
```
3. Download the pre-trained model for CIHP [here](https://github.com/Engineering-Course/CIHP_PGN) and store in `volumetricCapture/app/src/models/CIHP_PGN/checkpoint`.
4. Follow step `0.1` in [this](https://github.com/zju3dv/EasyMocap/blob/master/doc/installation.md) guide to download and place the necessary SMPL models for EasyMocap. This must be done before building Docker Image.
4. Place `raw` images, `intri.yml`, and `extri.yml` files into `volumetricCapture/app/src/data` before building Docker Image. If changes are made to these files after building, the image must be rebuilt.
5. Make modifications to `multi_view_custom.yaml` in `volumetricCapture/app/src/data` to configure Neuralbody.
6. Build Docker Image by running:
```
docker build -t volumetric-capture --build-arg BASE_IMAGE=nvidia/cuda:11.1.1-cudnn8-devel-ubuntu18.04 --build-arg RUNTIME=nvidia .
```

---
## Folder Structure
All scripts testing was performed on the following structure.
```
comp523-volumetricCapture
└── volumetricCapture
    ├── setup
    └── app/src
        └── data
            ├── 1_Cam1_1234.png
            ├── 2_Cam1_1234.png
            ├── ...
            ├── intri.yml
            └── extri.yml
        ├── scripts
        └── models
            ├── CIHP_PGN
            ├── EasyMocap
            └── Neuralbody
```
The raw images may be placed anywhere on the file system, but the correct path must be given to `automation.py` using the `--raw_path` option.

---
## Running Tests

1. Make sure you reviewed the [Folder Structure](#folder-structure-1).
2. Start Docker Image by running the following command in your terminal
```
docker run --ipc=host --gpus all -it --rm volumetric-capture
```
3. In your terminal, go to the project directory and run
```shell
python3 scripts/automation.py 
```

---
## Acknowledgements

This project would not have been possible without the following repositories:

* [CIHP_PGN](https://github.com/Engineering-Course/CIHP_PGN) was used to create segmented images.
* [EasyMocap](https://github.com/zju3dv/EasyMocap) was used for SMPL keypoints.
* [Neuralbody](https://github.com/zju3dv/neuralbody) was used to create 3D meshes.
* SMPL models were obtained from the following websites from MPII [SMPL-X model](https://github.com/vchoutas/smplx):  
  * [SMPL](https://smpl.is.tue.mpg.de/) (male and female models)
  * [SMPL](https://smplify.is.tue.mpg.de/) (gender neutral model)
  * [SMPL+H](https://mano.is.tue.mpg.de/)
  * [SMPL-X](https://smpl-x.is.tue.mpg.de/)