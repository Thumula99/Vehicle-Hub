using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using ServerCSharp.Models;
using ServerCSharp.Data;
using BCrypt.Net;

namespace ServerCSharp.Controllers
{
    [ApiController]
    [Route("api/users")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserController(AppDbContext context)
        {
            _context = context;
        }

        private string GetCurrentUserId()
        {
            return User.FindFirst("id")?.Value ?? string.Empty;
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetMe()
        {
            string userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            
            if (user == null)
            {
                return NotFound(new { success = false, message = "User not found" });
            }

            return Ok(new { success = true, user = MapToDto(user) });
        }

        [HttpPut("me")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
        {
            string userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return NotFound(new { success = false, message = "User not found" });
            }

            if (!string.IsNullOrEmpty(dto.Name)) user.Name = dto.Name;
            if (dto.Phone != null) user.Phone = dto.Phone;
            if (dto.Address != null) user.Address = dto.Address;
            
            user.UpdatedAt = DateTime.UtcNow.ToString("O");

            await _context.SaveChangesAsync();

            return Ok(new { success = true, user = MapToDto(user) });
        }

        [HttpPut("me/password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            if (string.IsNullOrEmpty(dto.CurrentPassword) || string.IsNullOrEmpty(dto.NewPassword))
            {
                return BadRequest(new { success = false, message = "Current and new password are required" });
            }

            string userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return NotFound(new { success = false, message = "User not found" });
            }

            bool isMatch = BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash);
            if (!isMatch)
            {
                return BadRequest(new { success = false, message = "Current password is incorrect" });
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            user.UpdatedAt = DateTime.UtcNow.ToString("O");

            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Password updated successfully" });
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
