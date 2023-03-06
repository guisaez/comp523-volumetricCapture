## Project Setup

### Creating an Anaconda Virtual Environment

1. Installation [Link](https://docs.anaconda.com/anaconda/install/index.html)
2. Once anaconda is installed run the following command on your terminal.
```shell
conda env create -f environment.yml
```
3. Verify the env has been created
```shell
conda env list
```
4. Activate environment
```shell
conda activate conda_env
```




### Notes:
1. You can remove the environment with the following command.
```shell
conda remove --name conda_env
```
2. Deactivating the environment.
```shell
conda deactivate
```
