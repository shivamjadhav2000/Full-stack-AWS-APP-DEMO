import { unmarshall } from '@aws-sdk/util-dynamodb';
import { EC2 } from '@aws-sdk/client-ec2';

const ec2 = new EC2({ region: 'us-east-2' });

export const handler = async (event, context) => {
  try {
    const record = event.Records[0];
    if (record.eventName !== 'INSERT') {
      console.log('Ignoring non-INSERT events.');
      return { statusCode: 200, body: 'Only INSERT events are processed.' };
    }

    const newImage = unmarshall(record.dynamodb.NewImage);
    const recordId = newImage.id
    const tableName = 'filedatabase'
    console.log('New image data:', newImage);

    if (!newImage) {
      console.error('Missing required data in DynamoDB trigger.');
      return { statusCode: 400, body: 'Data validation failed.' };
    }

    const bucketName = 'myawsbucket0028'
    const objectKey = 'script.py'
    const userData = `#!/bin/bash
        # Install Python3 and pip (if not already installed)
        sudo yum update
        sudo yum install python3 pip -y
        sudo pip3 install --upgrade pip 
        pip install boto3
        # Download Python script from S3
        echo "hellooooo" > /tmp/he33o.txt
        echo ${bucketName} > /tmp/bucketname.txt
        echo ${objectKey} > /tpm/objectKey.txt
        echo s3://${bucketName}/${objectKey} > /tmp/completepath.txt
        aws s3 cp s3://${bucketName}/${objectKey} /tmp/script.py 
        # Execute Python script with parameters
        echo command /tmp/script.py ${recordId} ${tableName} > loggggs.txt
        python3 /tmp/script.py ${recordId} ${tableName} ${recordId}
        `;
    const iamRoleArn = 'arn:aws:iam::058264531320:instance-profile/ec2-s3-and-dynamodb-full-access'
    const tags = [
      {
        Key: 'Name',
        Value: recordId
      },
    ];
    const encodedUserData = Buffer.from(userData).toString('base64');
    const params = {
      ImageId: 'ami-0900fe555666598a2',
      InstanceType: "t2.micro",
      MaxCount: 1,
      MinCount: 1,
      SecurityGroupIds: [
        "sg-0c7b28c9ba6ddee7c"
      ],
      SubnetId: "subnet-0c954981639af97d1",
      UserData: encodedUserData,
      TagSpecifications: [
        {
          ResourceType: "instance",
          Tags: tags
        }
      ],
      IamInstanceProfile: {
        Arn: iamRoleArn
      },
    };

    // Create the EC2 instance
    const data = await ec2.runInstances(params);
    console.log('Instance created:', data.Instances[0].InstanceId);

    return { statusCode: 200, body: 'VM creation process completed successfully!' };
  } catch (err) {
    console.error('Error creating instance:', err);
    return { statusCode: 500, body: 'Error creating VM. Please check CloudWatch logs for details.' };
  }
};
