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
3. Place `raw` images folder and `intri.yml` and `extri.yml` files into `volumetricCapture/app/src/data` 
4. Build Docker Image by running
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
        └── raw
            ├── 1_Cam1_1234.png
            ├── 2_Cam1_1234.png
            └── ...
        ├── intri.yml
        ├── extri.yml
        ├── scripts
        └── models
            ├── CIHP_PGN
            ├── EasyMocap
            └── Neuralbody
```
The raw images may be placed anywhere on the file system, but the correct path must be given to `automation.py`

---
## Running Tests

1. Make sure you reviewed the [Folder Structure](#folder-structure).
2. Start Docker Image by running the following command in your terminal
```
docker run --gpus all -it --rm volumetric-capture
```
3. In your terminal, go to the project directory and run
```shell
python scripts/automation.py path/to/raw path/to/intri.yml path/to/extri.yml 
```
