namespace Nosework.Api.Services
{
    public sealed class LoggingSmsSender : ISmsSender
    {
        private readonly ILogger<LoggingSmsSender> _logger;

        public LoggingSmsSender(ILogger<LoggingSmsSender> logger)
        {
            _logger = logger;
        }

        public Task SendAsync(string toPhoneNumber, string message, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("SMS (dev) to {PhoneNumber}: {Message}", toPhoneNumber, message);
            return Task.CompletedTask;
        }
    }
}

