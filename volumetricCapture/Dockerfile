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
RUN pip3 install --no-cache-dir virtualenv click Pillow Flask

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
RUN cd app/env/ && \
    source NEURAL_ENV/bin/activate && \
    pip3 install -r neural-env-reqs.txt && \
    deactivate

WORKDIR /app

COPY /app/src /app/src

CMD ["/bin/bash"]

# TRY

# docker build -t volumetric-capture --build-arg BASE_IMAGE=nvidia/cuda:10.0-cudnn7-devel-ubuntu18.04 --build-arg RUNTIME=nvidia .
# docker run --gpus all -it --rm volumetric-capture

# This will not work on macOS