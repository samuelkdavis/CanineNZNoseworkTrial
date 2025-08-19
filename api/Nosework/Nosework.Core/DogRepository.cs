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
                ["Order"] = new AttributeValue { N = Convert.ToString(dog.Order)},
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

    }
}
