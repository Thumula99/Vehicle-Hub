using Microsoft.AspNetCore.Mvc;
using VehicleHub.Models;
using VehicleHub.Models.DTOs;
using VehicleHub.Services;

namespace VehicleHub.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IDataService _dataService;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ITokenService _tokenService;

    public AuthController(
        IDataService dataService,
        IPasswordHasher passwordHasher,
        ITokenService tokenService)
    {
        _dataService = dataService;
        _passwordHasher = passwordHasher;
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, message = "Invalid registration data" });

        var users = await _dataService.GetUsersAsync();
        var existingUser = users.FirstOrDefault(u => u.Email.Equals(request.Email, StringComparison.OrdinalIgnoreCase));
        if (existingUser != null)
        {
            return Conflict(new { success = false, message = "Email is already registered" });
        }

        var now = DateTime.UtcNow;
        var newUser = new User
        {
            Id = $"user-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}",
            Name = request.Name,
            Email = request.Email.ToLowerInvariant(),
            PasswordHash = _passwordHasher.HashPassword(request.Password),
            Phone = request.Phone ?? string.Empty,
            Address = request.Address ?? string.Empty,
            Role = request.Role.ToLowerInvariant() == "seller" ? "seller" : "buyer",
            VerifiedSeller = false,
            Wishlist = new List<string>(),
            CreatedAt = now,
            UpdatedAt = now
        };

        users.Add(newUser);
        await _dataService.SaveUsersAsync(users);

        var token = _tokenService.GenerateJwtToken(newUser);

        var safeUser = new SafeUserDto
        {
            Id = newUser.Id,
            Name = newUser.Name,
            Email = newUser.Email,
            Phone = newUser.Phone,
            Address = newUser.Address,
            Role = newUser.Role,
            VerifiedSeller = newUser.VerifiedSeller,
            Wishlist = newUser.Wishlist,
            CreatedAt = newUser.CreatedAt,
            UpdatedAt = newUser.UpdatedAt
        };

        return StatusCode(201, new AuthResponse
        {
            Success = true,
            Token = token,
            User = safeUser
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, message = "Email and password are required" });

        var users = await _dataService.GetUsersAsync();
        var user = users.FirstOrDefault(u => u.Email.Equals(request.Email, StringComparison.OrdinalIgnoreCase));

        if (user == null || !_passwordHasher.VerifyPassword(request.Password, user.PasswordHash))
        {
            return Unauthorized(new { success = false, message = "Invalid email or password" });
        }

        var token = _tokenService.GenerateJwtToken(user);

        var safeUser = new SafeUserDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Phone = user.Phone,
            Address = user.Address,
            Role = user.Role,
            VerifiedSeller = user.VerifiedSeller,
            Wishlist = user.Wishlist,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt
        };

        return Ok(new AuthResponse
        {
            Success = true,
            Token = token,
            User = safeUser
        });
    }
}
