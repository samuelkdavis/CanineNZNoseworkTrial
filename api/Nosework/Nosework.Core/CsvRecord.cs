namespace Nosework.Core
{
    public class CsvRecord
    {
        public required string DogName { get; set; }
        public required string HandlerName { get; set; }
        public required string Class { get; set; }
        public int Order { get; set; }
        public required string PhoneNumber { get; set; }
        public required string Email { get; set; }
    }
}