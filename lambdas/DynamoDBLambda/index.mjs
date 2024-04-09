import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { nanoid } from 'nanoid';
const dynamodbClient = new DynamoDBClient({ region: "us-east-2" });


export const handler = async (event) => {
  const tableName = "filedatabase";
  const { text, filePath } = event.queryStringParameters;

  // Generate unique ID using nanoid
  const id = nanoid();

  // Create DynamoDB item
  const params = {
    TableName: tableName,
    Item: {
      id: { S: id },
      text: { S: text },
      filePath: { S: filePath }
    }
  };

  try {
    // Put item into DynamoDB
    const data = await dynamodbClient.send(new PutItemCommand(params));
    console.log("Item inserted:", data);

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ message: "Item inserted successfully", id: id })
    };
  } catch (err) {
    console.error("Error inserting item:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error inserting item" })
    };
  }
};
