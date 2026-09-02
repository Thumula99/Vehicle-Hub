using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using VehicleHub.Models;

namespace VehicleHub.Services;

public interface ITokenService
{
    string GenerateJwtToken(User user);
    ClaimsPrincipal? ValidateToken(string token);
}

public class TokenService : ITokenService
{
    private readonly IConfiguration _configuration;

    public TokenService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string GenerateJwtToken(User user)
    {
        var secret = _configuration["Jwt:Secret"] ?? "VehicleHub_Secret_Key_For_Jwt_Authentication_2026_DotNet8_Must_Be_Long";
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var expiryDays = int.TryParse(_configuration["Jwt:ExpiryInDays"], out var d) ? d : 7;

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Name, user.Name),
            new(ClaimTypes.Role, user.Role),
            new("role", user.Role),
            new("id", user.Id)
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"] ?? "VehicleHubApi",
            audience: _configuration["Jwt:Audience"] ?? "VehicleHubClient",
            claims: claims,
            expires: DateTime.UtcNow.AddDays(expiryDays),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public ClaimsPrincipal? ValidateToken(string token)
    {
        var secret = _configuration["Jwt:Secret"] ?? "VehicleHub_Secret_Key_For_Jwt_Authentication_2026_DotNet8_Must_Be_Long";
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));

        var handler = new JwtSecurityTokenHandler();
        try
        {
            var principal = handler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = key,
                ValidateIssuer = false,
                ValidateAudience = false,
                ClockSkew = TimeSpan.Zero
            }, out _);

            return principal;
        }
        catch
        {
            return null;
        }
    }
}
