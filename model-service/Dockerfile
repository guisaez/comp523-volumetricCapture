FROM nvidia/cuda:11.1.1-cudnn8-devel-ubuntu18.04

ARG DEBIAN_FRONTEND=noninteractive

ENV TZ=America/New_York

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

# Set the default locale to UTF-8
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

# Install and build OpenPose
RUN git clone https://github.com/CMU-Perceptual-Computing-Lab/openpose.git

RUN cd openpose && \
    git submodule update --init --recursive

RUN cd openpose && \
    mkdir build && \
    cd build

RUN cd openpose/build && cmake .. -DGPU_MODE=GPU
RUN cd openpose/build make -j`nproc`

RUN rm /bin/sh && ln -s /bin/bash /bin/sh

RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y nodejs

RUN apt update && wget https://github.com/mmatl/travis_debs/raw/master/xenial/mesa_18.3.3-0.deb && \
    dpkg -i ./mesa_18.3.3-0.deb || true && apt install -y -f

RUN python3.7 -m pip install --upgrade pip
RUN ln -s -f /usr/bin/python3.7 /usr/bin/python

RUN pip install virtualenv

WORKDIR /app

COPY package.json .
COPY requirements.txt .

RUN virtualenv -p python3.7 venv

RUN cd /app/venv/ && \
    source bin/activate && \
    cd .. && \
    pip install -r requirements.txt && \
    deactivate

RUN git clone https://github.com/mmatl/pyopengl.git --depth=1 && \
    source /app/venv/bin/activate && \
    pip uninstall -y pyopengl && \
    pip install ./pyopengl

ENV PYOPENGL_PLATFORM=osmesa

RUN ln -s -f /app/venv/bin/python3.7 /usr/bin/python

RUN npm install -only=prod

COPY . .

WORKDIR /app

CMD ["npm", "start"]

#CMD ["/bin/bash"]