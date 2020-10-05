import boto3
s3 = boto3.resource('s3')
BUCKET_NAME = 'listent'
bucket = s3.Bucket(BUCKET_NAME)


# fileobj: file like object
# key: path of where to put the file, or simply filename also works
# returns public url to the uploaded file
def upload(fileobj, key):
    # ref https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/s3.html#S3.Client.upload_fileobj
    bucket.upload_fileobj(fileobj, key)
    return "https://{0}.s3.amazonaws.com/{1}".format(BUCKET_NAME, key)


if __name__ == '__main__':
    with open('test-upload.txt', 'rb') as f:
        print(upload(f, 'a/b/bla.txt'))