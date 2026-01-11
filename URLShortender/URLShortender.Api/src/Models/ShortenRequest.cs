namespace URLShortender.Models
{
    public class ShortenRequest
    {
        public string Url { get; set; } =  string.Empty;
        public int? LifetimeHours { get; set; }
    }
}
