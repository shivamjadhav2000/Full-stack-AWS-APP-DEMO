import { unmarshall } from '@aws-sdk/util-dynamodb';
import { EC2 } from '@aws-sdk/client-ec2';

const ec2 = new EC2({ region: 'us-east-2' }); // Replace with your desired region

export const handler = async (event, context) => {
  try {
    // Extract necessary information from the DynamoDB event (assuming a single INSERT record)
    const record = event.Records[0];
    if (record.eventName !== 'INSERT') {
      console.log('Ignoring non-INSERT events.');
      return { statusCode: 200, body: 'Only INSERT events are processed.' };
    }

    const newImage = unmarshall(record.dynamodb.NewImage);
    console.log('New image data:', newImage);

    // Validate data existence before creating VM (adjust based on your DynamoDB schema)
    if (!newImage) {
      console.error('Missing required data in DynamoDB trigger.');
      return { statusCode: 400, body: 'Data validation failed.' };
    }

    // Extract instance type and user script from DynamoDB data
    const userScript = `
    #!/usr/bin/env python
    
    print("Hello, World!")
    `;

    const encodedUserData = Buffer.from(userScript).toString('base64');
    // Create EC2 instance parameters (consider adding more parameters as needed)
    const params = {
      ImageId: 'ami-0900fe555666598a2', // Replace with appropriate AMI ID for your region and needs
      InstanceType: "t2.micro",
      MaxCount: 1,
      MinCount: 1,
      SecurityGroupIds: [
        "sg-080b8993d2b44831a"
      ],
      SubnetId: "subnet-0c954981639af97d1",
      UserData: encodedUserData
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
