using System.Text.Json;
using StackExchange.Redis;
using URLShortender.Models;

namespace URLShortender.Infrastructure;

public class UserLinkRepository
{
    private readonly IDatabase _dataBase;

    public UserLinkRepository(IConnectionMultiplexer connection)
    {
        _dataBase = connection.GetDatabase();
    }

    private static string LinkKey(string userId) => $"userlinks:{userId}";

    private static readonly JsonSerializerOptions SerializerOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    public Task AddLinkAsync(string userId, LinkRecord link)
    {
        var payload = JsonSerializer.Serialize(link, SerializerOptions);
        return _dataBase.ListRightPushAsync(LinkKey(userId), payload);
    }

    public async Task<IReadOnlyList<LinkRecord>> GetLinksAsync(string userId)
    {
        var values = await _dataBase.ListRangeAsync(LinkKey(userId), 0, -1);
        var links = new List<LinkRecord>(values.Length);

        foreach (var value in values)
        {
            if (!value.HasValue)
            {
                continue;
            }

            var link = JsonSerializer.Deserialize<LinkRecord>(value.ToString(), SerializerOptions);
            if (link != null)
            {
                links.Add(link);
            }
        }

        return links;
    }
}
