FROM nvidia/cuda:10.0-cudnn7-devel-ubuntu18.04

ARG DEBIAN_FRONTEND=noninteractive

ENV TZ=America/New_York

RUN apt-get update

# Install necessary packages
RUN apt-get install -y curl python3.7 python3-pip git cmake wget libopencv-dev tzdata \
    libboost-all-dev libprotobuf-dev protobuf-compiler libgoogle-glog-dev libgflags-dev \
    libhdf5-dev liblmdb-dev libatlas-base-dev libatlas-cpp-0.6-dev ffmpeg locales-all && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install NVIDIA Container Toolkit
ENV PATH /usr/local/nvidia/bin:$PATH
ENV LD_LIBRARY_PATH /usr/local/nvidia/lib64:/usr/local/cuda/lib64:$LD_LIBRARY_PATH
RUN curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | apt-key add - && \
    distribution=$(. /etc/os-release;echo $ID$VERSION_ID) && \
    curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | tee /etc/apt/sources.list.d/nvidia-docker.list && \
    apt-get update && \
    apt-get install -y --no-install-recommends nvidia-container-toolkit && \
    rm -rf /var/lib/apt/lists/*

# Set the default locale to UTF-8
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

# Install Python dependencies globally.
<<<<<<< HEAD
RUN python3.7 -m pip install click 
RUN pip3 install --no-cache-dir virtualenv Pillow
=======
RUN pip3 install --no-cache-dir virtualenv click Pillow Flask
>>>>>>> 4f771c91a6ac9dc0c8a147078d7af56f0b1feb50

# Install and build OpenPose
RUN git clone https://github.com/CMU-Perceptual-Computing-Lab/openpose.git

RUN cd openpose && \
    git submodule update --init --recursive

RUN cd openpose && \
    mkdir build && \
    cd build

RUN cd openpose/build && cmake ..
RUN cd openpose/build make -j`nproc`

RUN rm /bin/sh && ln -s /bin/bash /bin/sh

COPY /setup /app/env

# Setup virtual environments
RUN cd app/env && \
    virtualenv -p python3.7 CIHP_ENV && \
    virtualenv -p python3.7 EASY_ENV && \
    virtualenv -p python3.7 NEURAL_ENV

# Install Dpenedencies for CIHP_ENV
RUN cd app/env/ && \
    source CIHP_ENV/bin/activate && \
    pip3 install -r cihp-env-reqs.txt && \
    pip3 install -r cihp-env-reqs.pip && \
    deactivate

# Install Dpenedencies for EASY_ENV
RUN cd app/env/ && \
    source EASY_ENV/bin/activate && \
    pip3 install -r easy-env-reqs.txt && \
    pip3 install -r easy-neural-env-reqs.txt && \
    deactivate

ENV SKLEARN_ALLOW_DEPRECATED_SKLEARN_PACKAGE_INSTALL=True

# Install Depeneencies for Neural_ENV
RUN cd /app/env/ && \
    source NEURAL_ENV/bin/activate && \
    pip3 install -r neural-env-reqs.txt && \
    pip3 install torch==1.4.0 && \
    deactivate

# Install compatible cmake version for Neuralbody
RUN apt-get update && apt-get install -y libssl-dev && \
    curl -sLo cmake.tar.gz https://github.com/Kitware/CMake/releases/download/v3.20.1/cmake-3.20.1.tar.gz && \
    tar -xvf cmake.tar.gz && \
    cd cmake-3.20.1 && \
    ./configure && \
    make -j4 && make install
RUN apt-get update && apt-get install -y libboost-dev && \
    rm -rf /var/lib/apt/lists/*

# Install spconv for Neuralbody
RUN source /app/env/NEURAL_ENV/bin/activate && \    
    cd /app && \
    git clone https://github.com/traveller59/spconv --recursive && \ 
    cd spconv && \
    git checkout abf0acf30f5526ea93e687e3f424f62d9cd8313a && \
    git submodule update --init --recursive && \
    apt-get update && apt-get install -y libpython3.7-dev && \
    python3.7 setup.py bdist_wheel && \
    pip3 install ./dist/spconv-1.2.1-cp37-cp37m-linux_x86_64.whl && \
    deactivate


COPY /app/src /app/src

# Finish EasyMocap setup
RUN cd /app/src/models/EasyMocap && \
    /app/env/EASY_ENV/bin/python3.7 setup.py develop

WORKDIR /app

CMD ["/bin/bash"]

# TRY

# docker build -t volumetric-capture --build-arg BASE_IMAGE=nvidia/cuda:10.0-cudnn7-devel-ubuntu18.04 --build-arg RUNTIME=nvidia .
# docker run --gpus all -it --rm volumetric-capture

# This will not work on macOS
