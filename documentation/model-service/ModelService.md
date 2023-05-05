# Model Service

## Table of Contents
* #### [Installation](#installation-1)
* #### [Folder Structure](#folder-structure-1)
* #### [Running Tests](#running-tests-1)
* #### [Scripts](#scripts-1)
---

## Installation
### Setting Up  Docker Environment
1. Install [Docker](https://docs.docker.com/engine/install/).
2. Place `raw` images, `intri.yml`, and `extri.yml` files into `volumetricCapture/model-service/src/data/ProjectID` before building Docker Image. If changes are made to these files after building, the image must be built again.
5. Make modifications to `multi_view_custom.yaml` in `volumetricCapture/model-service/src/data` to configure Neuralbody.
6. Build Docker Image by running:
```
docker build -t volumetric-capture --build-arg BASE_IMAGE=nvidia/cuda:11.1.1-cudnn8-devel-ubuntu18.04 --build-arg RUNTIME=nvidia .
```
* This image contains many dependencies and will take time to build depending on download speed.
* This image will only work with a GPU compatible with CUDA 11.

---
## Folder Structure
All scripts testing was performed on the following structure.
```
comp523-volumetricCapture
└── model-service
    ├── setup
    └── src
        └── data
            └──ProjectID
                ├── 1_Cam1_1234.png
                ├── 2_Cam1_1234.png
                ├── ...
                ├── multi_view_custom.yaml
                ├── intri.yml
                └── extri.yml
        ├── scripts
        └── models
            ├── CIHP_PGN
            ├── EasyMocap
            └── Neuralbody
```

---
## Running Tests

1. Make sure you reviewed the [Folder Structure](#folder-structure-1).
2. Start Docker Image by running the following command in your terminal
```
docker run --ipc=host --gpus all -it --rm volumetric-capture
```
3. In your terminal, go to the project directory and run
```shell
python3 scripts/automation.py ProjectID
```
4. Results will be saved within `app/src/data/ProjectID/final_output` after running.

---
## Scripts

All scripts make use of the python `click` package to provide a CLI. To learn more about options and arguments for each script use the `--help` option when calling the script.

* `automation.py`: This script works by creating subprocesses to run all necessary scripts to manipulate the data and run it through CIHP, EasyMocap, and Neuralbody. The `click` defaults within this script correspond to the Docker image. To run this file without Docker, you must provide each option when calling the script with the full path. Also the `env` variable must be changed on lines 29, 58, and 158 to the path to the python executable for each model's virtual environment.

* `separate.py`: This script takes images in `src` and places them in `dst` separated by camera. The file name must be in the format specified within the script for it to work.

* `raw_to_easymocap.py`: This script makes use of `ffmpeg` to turn the frames for each camera into a video for use by EasyMocap.

* `prep_neuralbody.py`: This script renames images into the format required for Neuralbody.

* `make_dataset.py`: This script takes raw images as input and creates the necessary dataset structure for use by CIHP. The raw images are rotated 90 degrees to orient them properly as well.

* `easymocap_to_neuralbody.py`: This script converts output from EasyMocap into the proper input structure required by Neuralbody.

* `get_annots.py`: This script is provided by Neuralbody to generate the annots.npy files before running. A CLI was added with `click` to take an argument `src` for the input directory.
