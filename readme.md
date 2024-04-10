# Lovus Project Readme Documentation
## Dependencies

  for this project i have used the following aws services:-
  ```
  1. Iam
  2. S3 buckets
  3. DynamoDB
  4. DynamoDB Streams 
  5. Lambda
  6. Cloud Watch
  7. Ec2
  ```
## How To Get Started With This Project

  ### Front End
  Dependencies:-
  i.  nodejs
  ii. npm
  Run  :- ```npm install```
  build: ```npm run buid```

  Must use Backend APi URL:-  'https://gd1urnjh12.execute-api.us-east-2.amazonaws.com/prod/'

## Backend 
```I have used aws sevices which are scallable and efficient and solve uses serverles machanisi```
### Dependencies:-
  1. aws sdk v3
  2. nano id
  3. boto3
### folder structure
## Lambdas

1. getsignedUrl
    
    this script consists of getting the signed url using s3 client which lets frontend to send/upload file to the server automatically

2. DynamoDBLambda

    this script consist of a module dependency nanoid you must upload the zip to the lambda service when asked for upload file in create lambda service. this script is responsible for creating an record in the dynamodb with 
    
    ``` {_id:nanoid,text:input_text,filePath:filePath}
      zip -r lambda.zip /lambda/DynamoDBLambda* 
    ```

3. DynamoDbinsertTrigger
    
    this script is resonsible for trigger which happens which the record is inserted which then creats an vm in ec2 and privide the startup script to it which handles the post logic after insertion of the record 
      which is :-

      1.create vm in ec2

      2.add user data stactically defined in code

4. vmscript

      this sript is resonsible for running the business logic post creating vm
      
      1.which is reading the record with id from dynamodb 

      2.reading the file from s3

      3.creating new file in /tmp/output.txt and append input_text 

      3.creating new file in s3 with name outputFile.txt

      4.updating record in dynamodb

      5.terminating the instance in ec2

## security groups and roles

### dynamo_trigger-role-460zcmck	
    AWS Service: lambda

### ec2-s3-and-dynamodb-full-access	
    AWS Service: ec2
    this role must have access to :-
    ```
    permissions:-

    AmazonDynamoDBFullAccess
    AmazonEC2FullAccess
    AmazonS3FullAccess

    this can still optimised by giving least priviliges like read and write for s3 read and wirte for dynamodb ...
    ```

### getsignedurl-role-yonnc3s8	
    AWS Service: lambda
    ```
    this role must have access to s3:-

    permissions:- 

    -> AmazonS3FullAccess
    -> AWSLambdaBasicExecutionRole-0e0e8d94

    although this role acess can be optimised by only given it the access to read and write which i will do but initially ia have given full access to get started
    ```

### lambdaDynamodbFullaccess	
    AWS Service: lambda
    this role is for lambda function to use dynamodb 
    ```
    permissions:-
    
    AmazonDynamoDBFullAccess
    ```
### S3FullAccessForLambda	
    AWS Service: lambda

    this role is for lambda which gives full access of s3 
    ```
    permissions:-

    AmazonS3FullAccess
    ```

### scriptlambda-role-2zy4zsn8
  this role is for a specific lambda called script which needs more permission since it is delealing with dynamodb, ec2, s3 
  ```
  permissions:-

  AmazonDynamoDBFullAccess

  AmazonS3FullAccess
  
  AWSLambdaBasicExecutionRole-0907dcde
  ```






