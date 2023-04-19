FROM nvidia/cuda:11.1.1-cudnn8-devel-ubuntu18.04

ARG DEBIAN_FRONTEND=noninteractive

ENV TZ=America/New_York

RUN apt-get update

RUN apt-get install -y curl python3.7 python3-pip git cmake wget libopencv-dev tzdata \
    libboost-all-dev libprotobuf-dev protobuf-compiler libgoogle-glog-dev libgflags-dev \
    libhdf5-dev liblmdb-dev libatlas-base-dev libatlas-cpp-0.6-dev ffmpeg locales-all && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -

RUN apt-get install -y nodejs

WORKDIR /app

COPY package.json .
COPY requirements.txt .

RUN npm install -only=prod
RUN pip3 install -r requirements.txt

COPY . .

CMD ["npm", "start" ]