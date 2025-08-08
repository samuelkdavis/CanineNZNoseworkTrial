using Amazon.DynamoDBv2;
using Amazon.Runtime;
using Amazon.Runtime.CredentialManagement;
using Amazon.S3;
using Nosework.Core;
using System.Threading.Tasks;

namespace Nosework.Tests
{
    public class UnitTest1
    {
        [Fact]
        public async Task Test1()
        {
            var profileName = "developer";

            var credentials = LoadAwsCredentials(profileName);

            var s3Client = new AmazonS3Client(credentials);
            var buckets=  await s3Client.ListBucketsAsync();
            var dynamoClient = new AmazonDynamoDBClient(credentials);

            var myClass = new Class1(dynamoClient);
            await myClass.SaveStuffToDynamo();
        }

        static AWSCredentials LoadAwsCredentials(string profile)
        {
            var chain = new CredentialProfileStoreChain();
            if (!chain.TryGetAWSCredentials(profile, out var credentials))
                throw new Exception($"Failed to find the {profile} profile");
            return credentials;
        }
    }
}