using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;
using Amazon.Runtime;
using System.Threading.Tasks;

namespace Nosework.Core
{
    public class Class1
    {
        private readonly AWSCredentials _credentials;
        private readonly AmazonDynamoDBClient dynamoClient;

        public Class1(AmazonDynamoDBClient dynamoClient)
        {
            this.dynamoClient = dynamoClient;
        }
        public async Task SaveStuffToDynamo()
        {
            var item = new Dictionary<string, AttributeValue>
            {
                ["pk"] = new AttributeValue { S = "The Great Gatsby2: the gatsbying" },
                ["author"] = new AttributeValue { S = "F. Scott Fitzgerald" },
                ["year"] = new AttributeValue { N = "1925" }
            };

            //todo inject table name
            var request = new PutItemRequest
            {
                TableName = "DogSports-noseworkdatastoreGlobalTableE91B90A5-VBH9U1RWKHCS",
                Item = item
            };

            await dynamoClient.PutItemAsync(request);

        }
    }
}
