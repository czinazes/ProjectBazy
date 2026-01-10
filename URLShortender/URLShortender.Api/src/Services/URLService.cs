using System.CodeDom.Compiler;
using System.Security.Cryptography;
using System.Text;
using URLShortender.Infrastructure;

namespace URLShortender.Services;

public class URLService : IURLService
{
    private readonly RedisUrlRepository _redisUrlRepository;

    public URLService(RedisUrlRepository redisUrlRepository)
    {
        _redisUrlRepository = redisUrlRepository;
    }
    public async Task<string> CreateShortCodeAsync(string url)
    {
        var code = GenerateCode(url);
        await _redisUrlRepository.SaveUrlAsync(code, url);
        return code;
    }

    private static string GenerateCode(string url)
    {
        using var sha256 = SHA256.Create();
        var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(url + Guid.NewGuid()));
        var shortenedBytes = Convert.ToBase64String(bytes).Replace("+", "").Replace("/", "")
            .Replace("=", "").Substring(0,9);
        return shortenedBytes;
    }

    public async Task<string?> GetOriginalUrlAsync(string code, bool incrementClicks)
    {
        var url = await _redisUrlRepository.GetUrlAsync(code);
        if (url == null)
        {
            return null;
        }

        if (incrementClicks)
        {
            await _redisUrlRepository.IncrementClicksAsync(code);
        }
        return url;
    }

    public Task<long> GetClicksAsync(string code)
    {
        return _redisUrlRepository.GetClicksAsync(code);
    }
}