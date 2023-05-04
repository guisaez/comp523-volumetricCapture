FROM nvidia/cuda:11.1.1-cudnn8-devel-ubuntu18.04

ARG DEBIAN_FRONTEND=noninteractive

ENV TZ=America/New_York

RUN apt-get update

# Install necessary packages
RUN apt-get install -y curl python3.7 python3-pip git wget libopencv-dev tzdata \
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
RUN python3.7 -m pip install click 
RUN pip3 install --no-cache-dir virtualenv Pillow

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
    pip3 install torch==1.9.1+cu111 torchvision==0.10.1+cu111 torchaudio==0.9.1 -f https://download.pytorch.org/whl/torch_stable.html && \
    pip3 install -r easy-env-reqs.txt && \
    pip3 install -r easy-neural-env-reqs.txt && \
    deactivate

ENV SKLEARN_ALLOW_DEPRECATED_SKLEARN_PACKAGE_INSTALL=True

# Install Depeneencies for Neural_ENV
RUN cd /app/env/ && \
    source NEURAL_ENV/bin/activate && \
    pip3 install -r neural-env-reqs.txt && \
    pip3 install torch==1.9.1+cu111 torchvision==0.10.1+cu111 torchaudio==0.9.1 -f https://download.pytorch.org/whl/torch_stable.html && \
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

# Install and build OpenPose for EasyMocap
RUN git clone https://github.com/CMU-Perceptual-Computing-Lab/openpose.git

RUN cd openpose && \
    git submodule update --init --recursive

RUN cd openpose && \
    mkdir build && \
    cd build && \
    cmake -DUSE_CUDNN=OFF ..
RUN cd openpose/build && make -j`nproc`


# Install spconv for Neuralbody
RUN source /app/env/NEURAL_ENV/bin/activate && \
    pip3 install --upgrade pip && \  
    python3.7 -m pip install spconv-cu111 && \
    deactivate

# Setup pyrender for EasyMocap visualization
RUN source /app/env/EASY_ENV/bin/activate && \
    pip3 install pyrender==0.1.35

RUN apt-get update && apt-get install -y freeglut3-dev
RUN apt update && wget https://github.com/mmatl/travis_debs/raw/master/xenial/mesa_18.3.3-0.deb && \
    dpkg -i ./mesa_18.3.3-0.deb || true && apt install -y -f

RUN git clone https://github.com/mmatl/pyopengl.git --depth=1 && \
    source /app/env/EASY_ENV/bin/activate && \
    pip3 uninstall -y pyopengl && \
    pip3 install ./pyopengl
    
ENV PYOPENGL_PLATFORM=osmesa

WORKDIR /app

COPY package.json .

COPY src/models /app/src/models
RUN cd /app/src/models/EasyMocap && \
    /app/env/EASY_ENV/bin/python3.7 setup.py develop

WORKDIR /app

# Install Node
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y nodejs

RUN npm install -only=prod

COPY . .

RUN source /app/env/NEURAL_ENV/bin/activate && \
    pip3 install scikit-learn && \
    pip3 install protobuf==3.20.1


ENV CUDA_HOME="/usr/local/cuda-11.1"
RUN source /app/env/NEURAL_ENV/bin/activate && python3 -m pip install --upgrade pip && \
    pip3 install imageio pillow && pip3 install --upgrade pillow imageio
    
WORKDIR /app

CMD ["npm", "start"]

#CMD ["/bin/bash"]

# This will not work on macOS and requires cuda 11 compatabile GPU
