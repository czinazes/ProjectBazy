namespace URLShortender.Infrastructure;

public class RedisOptions
{
    public string Host { get; set; } = "localhost";
    public int Port { get; set; } = 6379;
}