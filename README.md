# Volumetric Capture

## Table of Contents
* ### [Run in Development Environment](#installation-1)
* ### [Folder Structure](#folder-structure-1)
* ### [Running Tests](#running-tests-1)
* ### [Authentication Service](./documentation/auth-service/AuthenticationService.md)
---


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
docker run --gpus all -it --rm volumetric-capture
```
3. In your terminal, go to the project directory and run
```shell
python scripts/automation.py
```
