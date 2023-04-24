FROM nvidia/cuda:11.1.1-cudnn8-devel-ubuntu18.04

ARG DEBIAN_FRONTEND=noninteractive

ENV TZ=America/New_York
ENV CUDA_HOME="/usr/local/cuda-11.1"

# Set the default locale to UTF-8
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

# Install requirements for container
RUN apt-get update && apt-get install -y curl \
    python3.7-dev \
    python3-pip \
    python3-venv \
    git \
    cmake \
    wget \
    libopencv-dev \
    tzdata \
    libboost-all-dev \
    libboost-dev \
    libssl-dev \
    libprotobuf-dev \
    protobuf-compiler \
    libgoogle-glog-dev \
    libgflags-dev \
    libhdf5-dev  \
    liblmdb-dev \
    libatlas-base-dev \
    libatlas-cpp-0.6-dev  \
    ffmpeg \
    freeglut3-dev \
    locales-all && \
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

RUN curl -sLo cmake.tar.gz https://github.com/Kitware/CMake/releases/download/v3.20.1/cmake-3.20.1.tar.gz && \
    tar -xvf cmake.tar.gz && \
    cd cmake-3.20.1 && \
    ./configure && \
    make -j4 && make install

RUN curl -sLo cmake.tar.gz https://github.com/Kitware/CMake/releases/download/v3.20.1/cmake-3.20.1.tar.gz && \
    tar -xvf cmake.tar.gz && \
    cd cmake-3.20.1 && \
    ./configure && \
    make -j4 && make install


# Install and build OpenPose
WORKDIR /app/src

RUN git clone https://github.com/CMU-Perceptual-Computing-Lab/openpose.git

RUN cd openpose && \
    git submodule update --init --recursive

RUN cd openpose && \
    mkdir build && \
    cd build

RUN cd openpose/build && cmake -DUSE_CUDNN=OFF .. 
RUN cd openpose/build && make -j`nproc`

# Switch to Bash
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

WORKDIR /

RUN apt update && wget https://github.com/mmatl/travis_debs/raw/master/xenial/mesa_18.3.3-0.deb && \
    dpkg -i ./mesa_18.3.3-0.deb || true && apt install -y -f

# Install Node
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y nodejs

# Add symlink to python
RUN python3.7 -m pip install --upgrade pip
RUN ln -s -f /usr/bin/python3.7 /usr/bin/python

# Create virtual environment
RUN pip install virtualenv

WORKDIR /app

COPY requirements.txt .

RUN virtualenv -p python3.7 venv

RUN cd /app/venv/ && \
    source bin/activate && \
    pip install --upgrade pip && \
    cd .. && \
    pip install -r requirements.txt && \
    deactivate

RUN cd /app/venv/ && \
    source bin/activate && \
    pip install torch==1.9.1+cu111 torchvision==0.10.1+cu111 torchaudio==0.9.1 -f https://download.pytorch.org/whl/torch_stable.html && \
    deactivate

RUN git clone https://github.com/mmatl/pyopengl.git --depth=1 && \
    source /app/venv/bin/activate && \
    pip uninstall -y pyopengl && \
    pip install ./pyopengl && \
    deactivate

#RUN rm -rf pyopengl
#RUN rm -rf pyopengl

ENV PATH /app/venv/bin:$PATH

WORKDIR /app

COPY package.json .

COPY src/models /app/src/models
RUN cd /app/src/models/EasyMocap && \
    python setup.py develop

WORKDIR /app

RUN npm install -only=prod

ENV PYOPENGL_PLATFORM=osmesa

COPY . .

CMD ["npm", "start"]
