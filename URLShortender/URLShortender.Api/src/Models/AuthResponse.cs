namespace URLShortender.Models;

public class AuthResponse
{
    public string Token { get; set; } = string.Empty;
    public AuthUser User { get; set; } = new();
}

public class AuthUser
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}
