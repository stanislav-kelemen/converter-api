import * as AWS from "aws-sdk";

const client = new AWS.DynamoDB.DocumentClient();

function getAll(params, method: 'query' | 'scan'): Promise<AWS.DynamoDB.DocumentClient.ItemList> {
  const newParams = { ...params };

  return new Promise((resolve, reject) => {
    function onGet() {
      client[method](newParams, (err, data) => {
        if (err) {
          reject(err);
        } else {
          let items = data.Items;

          if (typeof data.LastEvaluatedKey != "undefined") {
            newParams.ExclusiveStartKey = data.LastEvaluatedKey;
            items = items.concat(client[method](newParams, onGet));
          }

          resolve(items);
        }
      });
    }

    onGet();
  });
}

export default {
  get: (params, err = null) => client.get(params, err = null).promise(),
  put: (params, err = null) => client.put(params, err = null).promise(),
  query: (params, err = null) => client.query(params, err = null).promise(),
  queryAll: (params): Promise<AWS.DynamoDB.DocumentClient.ItemList> => getAll(params, 'query'),
  update: (params) => client.update(params).promise(),
  delete: (params, err = null) => client.delete(params, err = null).promise(),
  scan: (params, onScan) => client.scan(params, onScan),
  scanAll: (params) => getAll(params, 'scan'),
  batchGet: (params) => client.batchGet(params).promise(),
};
