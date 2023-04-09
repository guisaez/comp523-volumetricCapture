# Volumetric Capture

## Table of Contents
* #### [Installation](#installation-1)
* #### [Folder Structure](#folder-structure-1)
* #### [Running Tests](#running-tests-1)
---
## Installation
### Setting Up  Docker Environment
1. Install [Docker](https://docs.docker.com/engine/install/)
2. From inside project directory run
```
git submodule update --init --recursive
```
3. Follow step `0.1` in [this](https://github.com/zju3dv/EasyMocap/blob/master/doc/installation.md) guide to download and place the necessary SMPL models for EasyMocap. This must be done before building Docker Image.
4. Place `raw` images, `intri.yml`, and `extri.yml` files into `volumetricCapture/app/src/data` 
5. Build Docker Image by running
```
docker build -t volumetric-capture --build-arg BASE_IMAGE=nvidia/cuda:10.0-cudnn7-devel-ubuntu18.04 --build-arg RUNTIME=nvidia .
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

<<<<<<< HEAD
---
## Running Tests
=======
### [Authentication Service](./documentation/auth-service/AuthenticationService.md)

### Running Tests
>>>>>>> 4f771c91a6ac9dc0c8a147078d7af56f0b1feb50

1. Make sure you reviewed the [Folder Structure](#folder-structure-1).
2. Start Docker Image by running the following command in your terminal
```
docker run --gpus all -it --rm volumetric-capture
```
3. In your terminal, go to the project directory and run
```shell
python scripts/automation.py path/to/raw path/to/intri.yml path/to/extri.yml 
```
