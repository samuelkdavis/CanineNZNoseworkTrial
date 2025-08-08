using Amazon.Runtime;
using Amazon.Runtime.CredentialManagement;

namespace Nosework.Tests
{
    internal static class TestHelpers
    {
        internal static AWSCredentials LoadAwsCredentials(string profile)
        {
            var chain = new CredentialProfileStoreChain();
            if (!chain.TryGetAWSCredentials(profile, out var credentials))
                throw new Exception($"Failed to find the {profile} profile");
            return credentials;
        }
    }
}