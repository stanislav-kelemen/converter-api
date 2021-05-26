import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";

export const main = handler(async () => (
  await dynamoDb.scanAll({
    TableName: process.env.banks,
    ExpressionAttributeNames: {
      "#name": "name",
    },
    ProjectionExpression: 'bankId, #name',
  })
));
