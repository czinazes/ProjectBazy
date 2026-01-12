using System.Text.Json;
using StackExchange.Redis;
using URLShortender.Models;

namespace URLShortender.Infrastructure;

public class UserRepository
{
    private readonly IDatabase _dataBase;

    public UserRepository(IConnectionMultiplexer connection)
    {
        _dataBase = connection.GetDatabase();
    }

    private static string UserKey(string email) => $"user:{email}";

    private static readonly JsonSerializerOptions SerializerOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    public async Task<UserRecord?> GetUserAsync(string email)
    {
        var user = await _dataBase.StringGetAsync(UserKey(email));
        if (!user.HasValue)
        {
            return null;
        }

        var payload = (string)user!;
        if (string.IsNullOrEmpty(payload))
        {
            return null;
        }

        return JsonSerializer.Deserialize<UserRecord>(payload, SerializerOptions);
    }

    public Task SaveUserAsync(UserRecord user)
    {
        var payload = JsonSerializer.Serialize(user, SerializerOptions);
        return _dataBase.StringSetAsync(UserKey(user.Email), payload);
    }

    public Task UpdateUserAsync(UserRecord user, string? previousEmail)
    {
        var tasks = new List<Task>
        {
            SaveUserAsync(user)
        };

        if (!string.IsNullOrWhiteSpace(previousEmail) && !string.Equals(previousEmail, user.Email, StringComparison.OrdinalIgnoreCase))
        {
            tasks.Add(_dataBase.KeyDeleteAsync(UserKey(previousEmail)));
        }

        return Task.WhenAll(tasks);
    }
}
