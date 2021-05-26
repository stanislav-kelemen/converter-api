import * as AWS from "aws-sdk";

AWS.config.update({ region: "us-east-1" });

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export default function populate(TableName: string, data: any[]) {
  data.forEach((Item) => {
    const params = {
      TableName,
      Item,
    };

    dynamoDb.put(params, (err) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.error(
          `Unable to add item to table ${TableName}. Error JSON:`,
          JSON.stringify(err, null, 2)
        );
      } else {
        // eslint-disable-next-line no-console
        console.log(
          `Item is successfully added to ${TableName}: ${JSON.stringify(
            Item,
            null,
            2
          )}`
        );
      }
    });
  });
}
