using URLShortender.Models;

namespace URLShortender.Services;

public interface IAuthService
{
    Task<AuthResult> RegisterAsync(RegisterRequest request);
    Task<AuthResult> LoginAsync(LoginRequest request);
}

public class AuthResult
{
    public bool Success { get; private set; }
    public string? Error { get; private set; }
    public AuthResponse? Response { get; private set; }

    public static AuthResult Fail(string error) => new() { Success = false, Error = error };

    public static AuthResult Ok(AuthResponse response) => new() { Success = true, Response = response };
}
