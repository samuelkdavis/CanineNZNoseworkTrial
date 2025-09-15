using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;
using Amazon.Runtime;
using System.Threading.Tasks;

namespace Nosework.Core
{
    public class DogRepository
    {
        private readonly IAmazonDynamoDB dynamoClient;
        private readonly string? _tableName;

        public DogRepository(IAmazonDynamoDB dynamoClient, string? tableName = null)
        {
            this.dynamoClient = dynamoClient;
            _tableName = tableName;
        }

        public async Task Create(Dog dog)
        {
            var item = new Dictionary<string, AttributeValue>
            {
                ["Id"] = new AttributeValue { S = dog.Id.ToString() },
                ["DogName"] = new AttributeValue { S = dog.DogName },
                ["HandlerName"] = new AttributeValue { S = dog.HandlerName },
                ["Class"] = new AttributeValue { S = dog.Class },
                ["Order"] = new AttributeValue { N = Convert.ToString(dog.Order) },
                ["PhoneNumber"] = new AttributeValue { S = dog.PhoneNumber },
                ["Email"] = new AttributeValue { S = dog.Email }
            };

            var request = new PutItemRequest
            {
                TableName = _tableName,
                Item = item
            };

            await dynamoClient.PutItemAsync(request);
        }

        public async Task Delete()
        {

            Dictionary<string, AttributeValue>? lastEvaluatedKey = null;
            do
            {
                var scanRequest = new ScanRequest
                {
                    TableName = _tableName,
                    ProjectionExpression = "Id",
                    ExclusiveStartKey = lastEvaluatedKey
                };
                var scanResponse = await dynamoClient.ScanAsync(scanRequest);

                foreach (var item in scanResponse.Items)
                {
                    var deleteRequest = new DeleteItemRequest
                    {
                        TableName = _tableName,
                        Key = new Dictionary<string, AttributeValue>
                    {
                        { "Id", item["Id"] }
                    }
                    };

                    await dynamoClient.DeleteItemAsync(deleteRequest);
                }
                lastEvaluatedKey = scanResponse.LastEvaluatedKey;
            } while(lastEvaluatedKey != null && lastEvaluatedKey.Count > 0);

        }

        public async Task<List<Dog>> Read()
        {
            var dogs = new List<Dog>();
            Dictionary<string, AttributeValue>? lastEvaluatedKey = null;

            do
            {
                var request = new ScanRequest
                {
                    TableName = _tableName,
                    ExclusiveStartKey = lastEvaluatedKey
                };

                var response = await dynamoClient.ScanAsync(request);

                dogs.AddRange(response.Items.Select(item => new Dog
                {
                    Id = Guid.Parse(item["Id"].S),
                    DogName = item["DogName"].S,
                    HandlerName = item["HandlerName"].S,
                    Class = item["Class"].S,
                    Order = int.Parse(item["Order"].N),
                    PhoneNumber = item["PhoneNumber"].S,
                    Email = item["Email"].S
                }));

                lastEvaluatedKey = response.LastEvaluatedKey;
            }
            while (lastEvaluatedKey != null && lastEvaluatedKey.Count > 0);

            return dogs;
        }

    }
}
