using StackExchange.Redis;

namespace URLShortender.Infrastructure;

public class TokenRepository
{
    private readonly IDatabase _dataBase;

    public TokenRepository(IConnectionMultiplexer connection)
    {
        _dataBase = connection.GetDatabase();
    }

    private static string TokenKey(string token) => $"token:{token}";

    public Task SaveTokenAsync(string token, string email, TimeSpan ttl)
    {
        return _dataBase.StringSetAsync(TokenKey(token), email, ttl);
    }

    public async Task<string?> GetEmailByTokenAsync(string token)
    {
        var value = await _dataBase.StringGetAsync(TokenKey(token));
        return value.HasValue ? value.ToString() : null;
    }

    public Task DeleteTokenAsync(string token)
    {
        return _dataBase.KeyDeleteAsync(TokenKey(token));
    }
}
