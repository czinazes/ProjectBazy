using System.Net.Mail;
using System.Security.Cryptography;
using URLShortender.Infrastructure;
using URLShortender.Models;

namespace URLShortender.Services;

public class AuthService : IAuthService
{
    private readonly UserRepository _userRepository;

    public AuthService(UserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<AuthResult> RegisterAsync(RegisterRequest request)
    {
        var name = request.Name.Trim();
        var email = NormalizeEmail(request.Email);

        if (string.IsNullOrWhiteSpace(name))
        {
            return AuthResult.Fail("Imię jest wymagane");
        }

        if (!IsValidEmail(email))
        {
            return AuthResult.Fail("Nieprawidłowy adres e-mail");
        }

        if (request.Password.Length < 8)
        {
            return AuthResult.Fail("Hasło musi mieć minimum 8 znaków");
        }

        var existingUser = await _userRepository.GetUserAsync(email);
        if (existingUser != null)
        {
            return AuthResult.Fail("Użytkownik o tym e-mailu już istnieje");
        }

        var (hash, salt) = PasswordHasher.HashPassword(request.Password);
        var user = new UserRecord
        {
            Id = Guid.NewGuid().ToString("N"),
            Name = name,
            Email = email,
            PasswordHash = hash,
            PasswordSalt = salt,
            CreatedAt = DateTimeOffset.UtcNow
        };

        await _userRepository.SaveUserAsync(user);

        return AuthResult.Ok(BuildResponse(user));
    }

    public async Task<AuthResult> LoginAsync(LoginRequest request)
    {
        var email = NormalizeEmail(request.Email);

        if (!IsValidEmail(email))
        {
            return AuthResult.Fail("Nieprawidłowy adres e-mail");
        }

        var user = await _userRepository.GetUserAsync(email);
        if (user == null)
        {
            return AuthResult.Fail("Nieprawidłowy e-mail lub hasło");
        }

        if (!PasswordHasher.VerifyPassword(request.Password, user.PasswordHash, user.PasswordSalt))
        {
            return AuthResult.Fail("Nieprawidłowy e-mail lub hasło");
        }

        return AuthResult.Ok(BuildResponse(user));
    }

    private static string NormalizeEmail(string email)
    {
        return email.Trim().ToLowerInvariant();
    }

    private static bool IsValidEmail(string email)
    {
        try
        {
            _ = new MailAddress(email);
            return true;
        }
        catch
        {
            return false;
        }
    }

    private static AuthResponse BuildResponse(UserRecord user)
    {
        return new AuthResponse
        {
            Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32)),
            User = new AuthUser
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email
            }
        };
    }
}
