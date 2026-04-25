namespace Nosework.Api.Services
{
    public interface ISmsSender
    {
        Task SendAsync(string toPhoneNumber, string message, CancellationToken cancellationToken = default);
    }
}

