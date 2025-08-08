using Amazon.DynamoDBv2;
using Amazon.Runtime;
using Amazon.Runtime.CredentialManagement;
using Amazon.S3;
using Nosework.Core;
using System.Threading.Tasks;

namespace Nosework.Tests
{
    public class DogRepositoryTests
    {
        [Fact]
        public async Task Test1()
        {
            //arrange
            var profileName = "developer";

            var credentials = TestHelpers.LoadAwsCredentials(profileName);

            var s3Client = new AmazonS3Client(credentials);
            var buckets=  await s3Client.ListBucketsAsync();
            var dynamoClient = new AmazonDynamoDBClient(credentials);

            var dog = new Dog
            {
                Id = Guid.NewGuid(),
                DogName = "Rum Ham",
                HandlerName = "Frank Reynolds",
                Class = "Novice",
                Order = 2,
                PhoneNumber = "0211133181",
                Email = "samuelkdavis@gmail.com"
            };
            //act
            var dogRepository = new DogRepository(dynamoClient, "DogSports-noseworkdatastoredogs6D336E12-HV1NY32291RK");
            await dogRepository.Create(dog);

            //assert
        }
    }
}