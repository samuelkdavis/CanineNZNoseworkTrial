using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;
using System.Threading.Tasks;

namespace Nosework.Core
{
    public class Class1
    {
        public async Task SaveStuffToDynamo()
        {
            var amazonDynamoDB = new AmazonDynamoDBClient();

            var item = new Dictionary<string, AttributeValue>
            {
                ["pk"] = new AttributeValue { S = "The Great Gatsby" },
                ["author"] = new AttributeValue { S = "F. Scott Fitzgerald" },
                ["year"] = new AttributeValue { N = "1925" }
            };

            //todo inject table name
            var request = new PutItemRequest
            {
                TableName = "DogSports-noseworkdatastoreGlobalTableE91B90A5-VBH9U1RWKHCS",
                Item = item
            };

            await amazonDynamoDB.PutItemAsync(request);

        }
    }
}
