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
            var modeRaw = _configuration["Sms:Mode"] ?? "Direct"; // "Direct" | "Topic"
            var mode = modeRaw.Trim().ToLowerInvariant();
            var smsType = _configuration["Sms:Type"]; // "Transactional" | "Promotional"
            var senderId = _configuration["Sms:SenderId"]; // 1-11 alphanumeric (region-dependent)
            var smsTopicArn = _configuration["Sns:SmsTopicArn"];

            var request = new PublishRequest
            {
                Message = message,
                MessageAttributes = new Dictionary<string, MessageAttributeValue>()
            };

            if (mode == "topic")
            {
                if (string.IsNullOrWhiteSpace(smsTopicArn))
                {
                    throw new InvalidOperationException("Sms:Mode is 'Topic' but Sns:SmsTopicArn is not configured.");
                }
                request.TopicArn = smsTopicArn;
            }
            else
            {
                // Direct-to-phone SMS (no topic required). Expects E.164 phone numbers.
                request.PhoneNumber = toPhoneNumber;
            }

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

            _logger.LogInformation(
                "Publishing SMS via SNS. Mode={Mode} Target={Target}",
                mode == "topic" ? "Topic" : "Direct",
                mode == "topic" ? smsTopicArn : toPhoneNumber
            );
            PublishResponse response;
            try
            {
                response = await _sns.PublishAsync(request, cancellationToken);
            }
            catch (Amazon.SimpleNotificationService.Model.AuthorizationErrorException ex)
            {
                _logger.LogError(ex, "SNS authorization error — check IAM permissions and SMS sandbox.");
                throw new InvalidOperationException($"SMS not authorized: {ex.Message}", ex);
            }
            catch (Amazon.SimpleNotificationService.Model.InvalidParameterException ex)
            {
                _logger.LogError(ex, "SNS invalid parameter — phone number may be malformed or unverified in sandbox.");
                throw new InvalidOperationException($"SMS invalid parameter: {ex.Message}", ex);
            }
            catch (Amazon.SimpleNotificationService.Model.KMSDisabledException ex)
            {
                _logger.LogError(ex, "SNS KMS error.");
                throw new InvalidOperationException($"SMS KMS error: {ex.Message}", ex);
            }

            if (response.HttpStatusCode != System.Net.HttpStatusCode.OK)
            {
                _logger.LogError(
                    "Failed to publish SNS message. Status={Status} MessageId={MessageId}",
                    response.HttpStatusCode,
                    response.MessageId
                );
                throw new InvalidOperationException($"Failed to publish SNS message. Status={response.HttpStatusCode}");
            }

            _logger.LogInformation(
                "SNS publish succeeded. MessageId={MessageId}",
                response.MessageId
            );
        }
    }
}

