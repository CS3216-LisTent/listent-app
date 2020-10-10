import os
import boto3
from api.main.config import BUCKET_NAME

s3 = boto3.resource('s3')
bucket = s3.Bucket(BUCKET_NAME)


# fileobj: file like object
# key: path of where to put the file, or simply filename also works
# returns public url to the uploaded file
def upload(fileobj, key):
    # ref https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/s3.html#S3.Client.upload_fileobj
    bucket.upload_fileobj(fileobj, key)
    return "https://{0}.s3.amazonaws.com/{1}".format(BUCKET_NAME, key)


def upload_file(filepath, key):
    print(filepath)
    filetype = filepath.split('.')[-1]
    with open(filepath, 'rb') as f:
        link = upload(f, f'{key}.{filetype}')
        return link


def save_file(directory, file):
    filename = file.filename
    filepath = os.path.join(directory, filename)
    file.save(filepath)
    return filepath
