FROM alpine 

RUN apk add ansible gcc python3-dev py3-pip libc-dev libffi-dev openssl-dev openssh
RUN pip3 install --upgrade paramiko
COPY entrypoint /entrypoint

ENTRYPOINT ["/entrypoint"]
