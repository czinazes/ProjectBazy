using System.Net.Mail;
using System.Security.Cryptography;
using URLShortender.Infrastructure;
using URLShortender.Models;

namespace URLShortender.Services;

public class AuthService : IAuthService
{
    private readonly UserRepository _userRepository;
    private readonly TokenRepository _tokenRepository;
    private static readonly TimeSpan TokenTtl = TimeSpan.FromDays(7);

    public AuthService(UserRepository userRepository, TokenRepository tokenRepository)
    {
        _userRepository = userRepository;
        _tokenRepository = tokenRepository;
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

        var response = BuildResponse(user);
        await _tokenRepository.SaveTokenAsync(response.Token, user.Email, TokenTtl);

        return AuthResult.Ok(response);
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

        var response = BuildResponse(user);
        await _tokenRepository.SaveTokenAsync(response.Token, user.Email, TokenTtl);

        return AuthResult.Ok(response);
    }

    public async Task<UserRecord?> GetUserByTokenAsync(string token)
    {
        if (string.IsNullOrWhiteSpace(token))
        {
            return null;
        }

        var email = await _tokenRepository.GetEmailByTokenAsync(token);
        if (string.IsNullOrWhiteSpace(email))
        {
            return null;
        }

        return await _userRepository.GetUserAsync(email);
    }

    public async Task<AuthResult> UpdateProfileAsync(string token, UpdateProfileRequest request)
    {
        var user = await GetUserByTokenAsync(token);
        if (user == null)
        {
            return AuthResult.Fail("Brak autoryzacji");
        }

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

        if (!string.Equals(email, user.Email, StringComparison.OrdinalIgnoreCase))
        {
            var existingUser = await _userRepository.GetUserAsync(email);
            if (existingUser != null)
            {
                return AuthResult.Fail("Użytkownik o tym e-mailu już istnieje");
            }
        }

        var previousEmail = user.Email;
        user.Name = name;
        user.Email = email;

        await _userRepository.UpdateUserAsync(user, previousEmail);
        await _tokenRepository.SaveTokenAsync(token, user.Email, TokenTtl);

        return AuthResult.Ok(new AuthResponse
        {
            Token = token,
            User = new AuthUser
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email
            }
        });
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
