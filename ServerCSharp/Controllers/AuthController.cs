using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using ServerCSharp.Models;
using ServerCSharp.Data;
using BCrypt.Net;

namespace ServerCSharp.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        // In a real app this would be in appsettings.json
        private readonly string _jwtSecret = Environment.GetEnvironmentVariable("JWT_SECRET") ?? "vehicle_hub_dev_secret_key_2026_super_secret";

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (string.IsNullOrEmpty(dto.Name) || string.IsNullOrEmpty(dto.Email) || string.IsNullOrEmpty(dto.Password))
            {
                return BadRequest(new { success = false, message = "Name, email, and password are required" });
            }

            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == dto.Email.ToLower());
            if (existingUser != null)
            {
                return Conflict(new { success = false, message = "Email is already registered" });
            }

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            var newUser = new User
            {
                Id = $"user-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}",
                Name = dto.Name,
                Email = dto.Email.ToLower(),
                PasswordHash = passwordHash,
                Phone = dto.Phone ?? "",
                Address = dto.Address ?? "",
                Role = dto.Role == "seller" ? "seller" : "buyer",
                VerifiedSeller = false,
                Wishlist = new List<string>(),
                CreatedAt = DateTime.UtcNow.ToString("O"),
                UpdatedAt = DateTime.UtcNow.ToString("O")
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            string token = GenerateJwtToken(newUser);

            var userDto = MapToDto(newUser);

            return Created("", new AuthResponseDto
            {
                Success = true,
                Token = token,
                User = userDto
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            if (string.IsNullOrEmpty(dto.Email) || string.IsNullOrEmpty(dto.Password))
            {
                return BadRequest(new { success = false, message = "Email and password are required" });
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == dto.Email.ToLower());
            if (user == null)
            {
                return Unauthorized(new { success = false, message = "Invalid credentials" });
            }

            bool isMatch = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);
            if (!isMatch)
            {
                return Unauthorized(new { success = false, message = "Invalid credentials" });
            }

            string token = GenerateJwtToken(user);
            var userDto = MapToDto(user);

            return Ok(new AuthResponseDto
            {
                Success = true,
                Token = token,
                User = userDto
            });
        }

        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtSecret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim("id", user.Id),
                    new Claim("email", user.Email),
                    new Claim("role", user.Role),
                    new Claim("name", user.Name)
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private UserDto MapToDto(User user)
        {
            return new UserDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Phone = user.Phone,
                Address = user.Address,
                Role = user.Role,
                VerifiedSeller = user.VerifiedSeller,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt
            };
        }
    }
}
