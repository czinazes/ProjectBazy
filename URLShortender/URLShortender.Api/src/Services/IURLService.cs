namespace URLShortender.Services;

public interface IURLService
{
    Task<string> CreateShortCodeAsync(string url);
    Task<string?> GetOriginalUrlAsync(string code, bool incrementClicks);
    Task<long> GetClicksAsync(string code);
}