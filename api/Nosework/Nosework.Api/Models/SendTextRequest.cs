namespace Nosework.Api.Models
{
    public sealed class SendTextRequest
    {
        public required int OrderId { get; init; }
        public string? Message { get; init; }
    }
}

