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

    public Task SaveUrlAsync(string Code, string Url)
    {
        var tasks = new Task[]
        {
            _dataBase.StringSetAsync(UrlKey(Code), Url),
            _dataBase.StringSetAsync(ClickKey(Code), 0)
        };
        return Task.WhenAll(tasks);
    }

    public async Task<string?> GetUrlAsync(string Code)
    {
        var url = await _dataBase.StringGetAsync(UrlKey(Code));
        return url.HasValue ? url.ToString() : null;
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