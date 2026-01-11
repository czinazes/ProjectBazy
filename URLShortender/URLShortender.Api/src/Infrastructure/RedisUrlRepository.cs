using StackExchange.Redis;

namespace URLShortender.Infrastructure;

public class RedisUrlRepository
{
    private readonly IDatabase _dataBase;

    public RedisUrlRepository(IConnectionMultiplexer connection)
    {
        _dataBase = connection.GetDatabase();
    }
    private static string UrlKey(string Code) => $"url:{Code}";
    private static string ClickKey(string Code) => $"clicks:{Code}";

    public Task SaveUrlAsync(string code, string url, TimeSpan? ttl)
    {
        Expiration expiry = ttl.HasValue ? new Expiration(ttl.Value) : default;

        return Task.WhenAll(
            _dataBase.StringSetAsync(UrlKey(code), url, expiry: expiry),
            _dataBase.StringSetAsync(ClickKey(code), 0, expiry: expiry)
        );
    }

    public async Task<string?> GetUrlAsync(string Code)
    {
        var url = await _dataBase.StringGetAsync(UrlKey(Code));
        return url.HasValue ? url.ToString() : null;
    }

    public Task<bool> UrlExistsAsync(string Code)
    {
        return _dataBase.KeyExistsAsync(UrlKey(Code));
    }

    public Task<long> IncrementClicksAsync(string Code)
    {
        return _dataBase.StringIncrementAsync(ClickKey(Code));
    }

    public async Task<long> GetClicksAsync(string Code)
    {
        var val = await _dataBase.StringGetAsync(ClickKey(Code));
        if (val.HasValue && long.TryParse((string?)val, out var clicks))
        {
            return clicks;
        }
        return 0;
    }
}
