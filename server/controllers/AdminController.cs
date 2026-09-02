using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VehicleHub.Models;
using VehicleHub.Models.DTOs;
using VehicleHub.Services;

namespace VehicleHub.Controllers;

[ApiController]
[Authorize(Roles = "admin")]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly IDataService _dataService;

    public AdminController(IDataService dataService)
    {
        _dataService = dataService;
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _dataService.GetUsersAsync();
        var safeUsers = users.Select(u => new SafeUserDto
        {
            Id = u.Id,
            Name = u.Name,
            Email = u.Email,
            Phone = u.Phone,
            Address = u.Address,
            Role = u.Role,
            VerifiedSeller = u.VerifiedSeller,
            Wishlist = u.Wishlist,
            CreatedAt = u.CreatedAt,
            UpdatedAt = u.UpdatedAt
        }).ToList();

        return Ok(new { success = true, users = safeUsers });
    }

    public class VerifySellerRequest
    {
        public bool VerifiedSeller { get; set; }
    }

    [HttpPatch("users/{id}/verify-seller")]
    public async Task<IActionResult> VerifySeller(string id, [FromBody] VerifySellerRequest request)
    {
        var users = await _dataService.GetUsersAsync();
        var user = users.FirstOrDefault(u => u.Id == id);
        if (user == null) return NotFound(new { success = false, message = "User not found" });

        user.VerifiedSeller = request.VerifiedSeller;
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

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var users = await _dataService.GetUsersAsync();
        var cars = await _dataService.GetCarsAsync();
        var messages = await _dataService.GetMessagesAsync();

        var stats = new AdminStatsDto
        {
            TotalUsers = users.Count,
            Buyers = users.Count(u => u.Role == "buyer"),
            Sellers = users.Count(u => u.Role == "seller"),
            VerifiedSellers = users.Count(u => u.VerifiedSeller),
            TotalListings = cars.Count,
            AvailableListings = cars.Count(c => c.Status == "Available"),
            SoldListings = cars.Count(c => c.Status == "Sold"),
            TotalMessages = messages.Count
        };

        return Ok(new { success = true, stats });
    }
}
