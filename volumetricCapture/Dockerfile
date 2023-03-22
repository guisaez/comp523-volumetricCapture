FROM nvidia/cuda:10.0-cudnn7-devel-ubuntu18.04

ARG DEBIAN_FRONTEND=noninteractive

ENV TZ=America/New_York

RUN apt-get update && \
    apt-get install -y tzdata

RUN apt-get install -y python3.7 python3-pip git cmake wget libopencv-dev \
    libboost-all-dev libprotobuf-dev protobuf-compiler libgoogle-glog-dev libgflags-dev \
    libhdf5-dev liblmdb-dev libatlas-base-dev libatlas-cpp-0.6-dev ffmpeg \
    && rm -rf /var/lib/apt/lists/*

RUN pip3 install virtualenv click Pillow

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

RUN cd app/env && \
    virtualenv -p python3.7 CIHP_ENV && \
    virtualenv -p python3.7 EASY_ENV && \
    virtualenv -p python3.7 NEURAL_ENV

RUN cd app/env/ && \
    source CIHP_ENV/bin/activate && \
    pip3 install -r cihp-env-reqs.txt && \
    pip3 install -r cihp-env-reqs.pip && \
    deactivate

RUN cd app/env/ && \
    source EASY_ENV/bin/activate && \
    pip3 install -r easy-env-reqs.txt && \
    pip3 install -r easy-neural-env-reqs.txt && \
    deactivate

ENV SKLEARN_ALLOW_DEPRECATED_SKLEARN_PACKAGE_INSTALL=True


WORKDIR /app

COPY /app/src /app/src

CMD ["/bin/bash"]