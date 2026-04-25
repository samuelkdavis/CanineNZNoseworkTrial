namespace Nosework.Api.Models
{
    public sealed class SendTextRequest
    {
        public required string OrderId { get; init; }
        public string? Message { get; init; }
    }
}

