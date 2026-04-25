using Amazon.SimpleNotificationService;
using Amazon.SimpleNotificationService.Model;

namespace Nosework.Api.Services
{
    public sealed class SnsSmsSender : ISmsSender
    {
        private readonly IAmazonSimpleNotificationService _sns;
        private readonly IConfiguration _configuration;
        private readonly ILogger<SnsSmsSender> _logger;

        public SnsSmsSender(
            IAmazonSimpleNotificationService sns,
            IConfiguration configuration,
            ILogger<SnsSmsSender> logger)
        {
            _sns = sns;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task SendAsync(string toPhoneNumber, string message, CancellationToken cancellationToken = default)
        {
            var smsType = _configuration["Sms:Type"]; // "Transactional" | "Promotional"
            var senderId = _configuration["Sms:SenderId"]; // 1-11 alphanumeric (region-dependent)

            var request = new PublishRequest
            {
                PhoneNumber = toPhoneNumber,
                Message = message,
                MessageAttributes = new Dictionary<string, MessageAttributeValue>()
            };

            if (!string.IsNullOrWhiteSpace(smsType))
            {
                request.MessageAttributes["AWS.SNS.SMS.SMSType"] = new MessageAttributeValue
                {
                    DataType = "String",
                    StringValue = smsType
                };
            }

            if (!string.IsNullOrWhiteSpace(senderId))
            {
                request.MessageAttributes["AWS.SNS.SMS.SenderID"] = new MessageAttributeValue
                {
                    DataType = "String",
                    StringValue = senderId
                };
            }

            _logger.LogInformation("Publishing SMS via SNS to {PhoneNumber}", toPhoneNumber);
            await _sns.PublishAsync(request, cancellationToken);
        }
    }
}

