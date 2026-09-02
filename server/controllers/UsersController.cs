using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VehicleHub.Models;
using VehicleHub.Models.DTOs;
using VehicleHub.Services;

namespace VehicleHub.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IDataService _dataService;
    private readonly IPasswordHasher _passwordHasher;

    public UsersController(IDataService dataService, IPasswordHasher passwordHasher)
    {
        _dataService = dataService;
        _passwordHasher = passwordHasher;
    }

    private string? GetCurrentUserId()
    {
        return User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("id")?.Value;
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetProfile()
    {
        var userId = GetCurrentUserId();
        if (string.IsNullOrEmpty(userId)) return Unauthorized(new { success = false, message = "Unauthorized" });

        var users = await _dataService.GetUsersAsync();
        var user = users.FirstOrDefault(u => u.Id == userId);
        if (user == null) return NotFound(new { success = false, message = "User not found" });

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

        return Ok(new { success = true, user = safeUser });
    }

    [HttpPut("me")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        var userId = GetCurrentUserId();
        if (string.IsNullOrEmpty(userId)) return Unauthorized(new { success = false, message = "Unauthorized" });

        var users = await _dataService.GetUsersAsync();
        var user = users.FirstOrDefault(u => u.Id == userId);
        if (user == null) return NotFound(new { success = false, message = "User not found" });

        if (!string.IsNullOrEmpty(request.Name)) user.Name = request.Name;
        if (request.Phone != null) user.Phone = request.Phone;
        if (request.Address != null) user.Address = request.Address;
        user.UpdatedAt = DateTime.UtcNow;

        await _dataService.SaveUsersAsync(users);

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

        return Ok(new { success = true, user = safeUser });
    }

    [HttpPut("me/password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        var userId = GetCurrentUserId();
        if (string.IsNullOrEmpty(userId)) return Unauthorized(new { success = false, message = "Unauthorized" });

        var users = await _dataService.GetUsersAsync();
        var user = users.FirstOrDefault(u => u.Id == userId);
        if (user == null) return NotFound(new { success = false, message = "User not found" });

        if (!_passwordHasher.VerifyPassword(request.CurrentPassword, user.PasswordHash))
        {
            return BadRequest(new { success = false, message = "Current password is incorrect" });
        }

        user.PasswordHash = _passwordHasher.HashPassword(request.NewPassword);
        user.UpdatedAt = DateTime.UtcNow;
        await _dataService.SaveUsersAsync(users);

        return Ok(new { success = true, message = "Password updated successfully" });
    }

    // --- WISHLIST ENDPOINTS ---

    [HttpGet("me/wishlist")]
    public async Task<IActionResult> GetWishlist()
    {
        var userId = GetCurrentUserId();
        if (string.IsNullOrEmpty(userId)) return Unauthorized(new { success = false, message = "Unauthorized" });

        var users = await _dataService.GetUsersAsync();
        var user = users.FirstOrDefault(u => u.Id == userId);
        if (user == null) return NotFound(new { success = false, message = "User not found" });

        var cars = await _dataService.GetCarsAsync();
        var wishlistIds = user.Wishlist ?? new List<string>();

        var validCars = new List<Car>();
        var validIds = new List<string>();

        foreach (var carId in wishlistIds)
        {
            var car = cars.FirstOrDefault(c => c.Id == carId && c.Status != "Deleted");
            if (car != null)
            {
                validCars.Add(car);
                validIds.Add(carId);
            }
        }

        if (validIds.Count != wishlistIds.Count)
        {
            user.Wishlist = validIds;
            user.UpdatedAt = DateTime.UtcNow;
            await _dataService.SaveUsersAsync(users);
        }

        return Ok(new { success = true, wishlist = validCars, wishlistIds = validIds });
    }

    [HttpPost("me/wishlist/{carId}")]
    public async Task<IActionResult> AddToWishlist(string carId)
    {
        var userId = GetCurrentUserId();
        if (string.IsNullOrEmpty(userId)) return Unauthorized(new { success = false, message = "Unauthorized" });

        var cars = await _dataService.GetCarsAsync();
        var car = cars.FirstOrDefault(c => c.Id == carId && c.Status != "Deleted");
        if (car == null) return NotFound(new { success = false, message = "Vehicle not found" });

        var users = await _dataService.GetUsersAsync();
        var user = users.FirstOrDefault(u => u.Id == userId);
        if (user == null) return NotFound(new { success = false, message = "User not found" });

        user.Wishlist ??= new List<string>();
        if (!user.Wishlist.Contains(carId))
        {
            user.Wishlist.Add(carId);
            user.UpdatedAt = DateTime.UtcNow;
            await _dataService.SaveUsersAsync(users);
        }

        return Ok(new { success = true, message = "Vehicle added to wishlist", wishlist = user.Wishlist });
    }

    [HttpDelete("me/wishlist/{carId}")]
    public async Task<IActionResult> RemoveFromWishlist(string carId)
    {
        var userId = GetCurrentUserId();
        if (string.IsNullOrEmpty(userId)) return Unauthorized(new { success = false, message = "Unauthorized" });

        var users = await _dataService.GetUsersAsync();
        var user = users.FirstOrDefault(u => u.Id == userId);
        if (user == null) return NotFound(new { success = false, message = "User not found" });

        if (user.Wishlist != null)
        {
            user.Wishlist.Remove(carId);
            user.UpdatedAt = DateTime.UtcNow;
            await _dataService.SaveUsersAsync(users);
        }

        return Ok(new { success = true, message = "Vehicle removed from wishlist", wishlist = user.Wishlist ?? new List<string>() });
    }
}
