using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VehicleHub.Models;
using VehicleHub.Models.DTOs;
using VehicleHub.Services;

namespace VehicleHub.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CarsController : ControllerBase
{
    private readonly IDataService _dataService;
    private readonly IWebHostEnvironment _env;

    public CarsController(IDataService dataService, IWebHostEnvironment env)
    {
        _dataService = dataService;
        _env = env;
    }

    private string? GetCurrentUserId()
    {
        return User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("id")?.Value;
    }

    private string? GetCurrentUserRole()
    {
        return User.FindFirst(ClaimTypes.Role)?.Value ?? User.FindFirst("role")?.Value;
    }

    [HttpGet]
    public async Task<IActionResult> GetCars([FromQuery] CarQueryParameters parameters)
    {
        var cars = await _dataService.GetCarsAsync();

        // 1. Status filter
        if (!string.IsNullOrEmpty(parameters.Status))
        {
            cars = cars.Where(c => c.Status.Equals(parameters.Status, StringComparison.OrdinalIgnoreCase)).ToList();
        }
        else
        {
            cars = cars.Where(c => c.Status != "Deleted").ToList();
        }

        // 2. Multi-field keyword search
        if (!string.IsNullOrWhiteSpace(parameters.Keyword))
        {
            var q = parameters.Keyword.Trim();
            cars = cars.Where(c =>
                c.Title.Contains(q, StringComparison.OrdinalIgnoreCase) ||
                c.Description.Contains(q, StringComparison.OrdinalIgnoreCase) ||
                c.Make.Contains(q, StringComparison.OrdinalIgnoreCase) ||
                c.Model.Contains(q, StringComparison.OrdinalIgnoreCase) ||
                c.Location.Contains(q, StringComparison.OrdinalIgnoreCase)
            ).ToList();
        }

        // 3. Categorical Filters
        if (!string.IsNullOrWhiteSpace(parameters.Make))
            cars = cars.Where(c => c.Make.Equals(parameters.Make.Trim(), StringComparison.OrdinalIgnoreCase)).ToList();

        if (!string.IsNullOrWhiteSpace(parameters.Model))
            cars = cars.Where(c => c.Model.Contains(parameters.Model.Trim(), StringComparison.OrdinalIgnoreCase)).ToList();

        if (!string.IsNullOrWhiteSpace(parameters.FuelType))
            cars = cars.Where(c => c.FuelType.Equals(parameters.FuelType.Trim(), StringComparison.OrdinalIgnoreCase)).ToList();

        if (!string.IsNullOrWhiteSpace(parameters.Transmission))
            cars = cars.Where(c => c.Transmission.Equals(parameters.Transmission.Trim(), StringComparison.OrdinalIgnoreCase)).ToList();

        if (!string.IsNullOrWhiteSpace(parameters.Condition))
            cars = cars.Where(c => c.Condition.Equals(parameters.Condition.Trim(), StringComparison.OrdinalIgnoreCase)).ToList();

        if (!string.IsNullOrWhiteSpace(parameters.Location))
            cars = cars.Where(c => c.Location.Contains(parameters.Location.Trim(), StringComparison.OrdinalIgnoreCase)).ToList();

        // 4. Numerical Range Filters
        if (parameters.MinPrice.HasValue)
            cars = cars.Where(c => c.Price >= parameters.MinPrice.Value).ToList();

        if (parameters.MaxPrice.HasValue)
            cars = cars.Where(c => c.Price <= parameters.MaxPrice.Value).ToList();

        if (parameters.MinYear.HasValue)
            cars = cars.Where(c => c.Year >= parameters.MinYear.Value).ToList();

        if (parameters.MaxYear.HasValue)
            cars = cars.Where(c => c.Year <= parameters.MaxYear.Value).ToList();

        if (parameters.MinMileage.HasValue)
            cars = cars.Where(c => c.Mileage >= parameters.MinMileage.Value).ToList();

        if (parameters.MaxMileage.HasValue)
            cars = cars.Where(c => c.Mileage <= parameters.MaxMileage.Value).ToList();

        // 5. Sorting
        cars = parameters.Sort switch
        {
            "price_asc" => cars.OrderBy(c => c.Price).ToList(),
            "price_desc" => cars.OrderByDescending(c => c.Price).ToList(),
            "year_newest" => cars.OrderByDescending(c => c.Year).ToList(),
            "year_oldest" => cars.OrderBy(c => c.Year).ToList(),
            "mileage_low" => cars.OrderBy(c => c.Mileage).ToList(),
            "mileage_high" => cars.OrderByDescending(c => c.Mileage).ToList(),
            _ => cars.OrderByDescending(c => c.CreatedAt).ToList()
        };

        // 6. Pagination
        var page = Math.Max(1, parameters.Page);
        var limit = Math.Max(1, parameters.Limit);
        var total = cars.Count;
        var totalPages = (int)Math.Ceiling((double)total / limit);
        var paginated = cars.Skip((page - 1) * limit).Take(limit).ToList();

        return Ok(new PaginatedCarsResponse
        {
            Success = true,
            Cars = paginated,
            Pagination = new PaginationMetadata
            {
                Page = page,
                Limit = limit,
                Total = total,
                TotalPages = totalPages == 0 ? 1 : totalPages
            }
        });
    }

    [HttpGet("compare")]
    public async Task<IActionResult> CompareCars([FromQuery] string? ids)
    {
        if (string.IsNullOrWhiteSpace(ids))
        {
            return BadRequest(new { success = false, message = "Comparison requires vehicle IDs" });
        }

        var idList = ids.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries).Distinct().ToList();
        if (idList.Count < 2 || idList.Count > 4)
        {
            return BadRequest(new { success = false, message = "Comparison requires between 2 and 4 valid vehicle IDs" });
        }

        var allCars = await _dataService.GetCarsAsync();
        var allUsers = await _dataService.GetUsersAsync();

        var matchedCars = new List<Car>();
        foreach (var id in idList)
        {
            var car = allCars.FirstOrDefault(c => c.Id == id);
            if (car != null)
            {
                var seller = allUsers.FirstOrDefault(u => u.Id == car.SellerId);
                car.Seller = seller != null ? new SellerSummaryDto
                {
                    Id = seller.Id,
                    Name = seller.Name,
                    Phone = seller.Phone,
                    VerifiedSeller = seller.VerifiedSeller
                } : null;
                matchedCars.Add(car);
            }
        }

        if (matchedCars.Count < 2)
        {
            return BadRequest(new { success = false, message = "Could not find enough matching vehicles to compare" });
        }

        var minPrice = matchedCars.Min(c => c.Price);
        var minMileage = matchedCars.Min(c => c.Mileage);
        var maxYear = matchedCars.Max(c => c.Year);

        return Ok(new ComparisonResponse
        {
            Success = true,
            Cars = matchedCars,
            Highlights = new ComparisonHighlightsDto
            {
                LowestPrice = minPrice,
                LowestMileage = minMileage,
                NewestYear = maxYear
            }
        });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetCarById(string id)
    {
        var cars = await _dataService.GetCarsAsync();
        var car = cars.FirstOrDefault(c => c.Id == id);
        if (car == null) return NotFound(new { success = false, message = "Vehicle not found" });

        var users = await _dataService.GetUsersAsync();
        var seller = users.FirstOrDefault(u => u.Id == car.SellerId);
        car.Seller = seller != null ? new SellerSummaryDto
        {
            Id = seller.Id,
            Name = seller.Name,
            Phone = seller.Phone,
            VerifiedSeller = seller.VerifiedSeller
        } : null;

        return Ok(new { success = true, car });
    }

    [Authorize]
    [HttpGet("seller/my-listings")]
    public async Task<IActionResult> GetSellerListings()
    {
        var userId = GetCurrentUserId();
        var role = GetCurrentUserRole();

        if (role != "seller" && role != "admin")
        {
            return StatusCode(403, new { success = false, message = "Forbidden: Insufficient permissions" });
        }

        var cars = await _dataService.GetCarsAsync();
        var sellerCars = cars.Where(c => c.SellerId == userId).OrderByDescending(c => c.CreatedAt).ToList();

        return Ok(new { success = true, cars = sellerCars });
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> CreateCar([FromForm] CreateCarRequest request)
    {
        var userId = GetCurrentUserId();
        var role = GetCurrentUserRole();

        if (role != "seller" && role != "admin")
        {
            return StatusCode(403, new { success = false, message = "Forbidden: Only sellers can create vehicle listings" });
        }

        if (string.IsNullOrWhiteSpace(request.Title) || string.IsNullOrWhiteSpace(request.Make) ||
            string.IsNullOrWhiteSpace(request.Model) || request.Year <= 1900 || request.Price <= 0)
        {
            return BadRequest(new { success = false, message = "Required vehicle fields are missing or invalid" });
        }

        var imagePaths = new List<string>();
        if (request.Images != null && request.Images.Count > 0)
        {
            var uploadDir = Path.Combine(_env.ContentRootPath, "uploads");
            if (!Directory.Exists(uploadDir)) Directory.CreateDirectory(uploadDir);

            foreach (var file in request.Images.Take(8))
            {
                if (file.Length > 0 && file.Length <= 5 * 1024 * 1024)
                {
                    var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
                    var allowedExts = new[] { ".jpg", ".jpeg", ".png", ".webp" };
                    if (allowedExts.Contains(ext))
                    {
                        var fileName = $"car-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}-{Guid.NewGuid():N}{ext}";
                        var filePath = Path.Combine(uploadDir, fileName);

                        using var stream = new FileStream(filePath, FileMode.Create);
                        await file.CopyToAsync(stream);
                        imagePaths.Add($"/uploads/{fileName}");
                    }
                }
            }
        }

        var featureList = new List<string>();
        if (!string.IsNullOrWhiteSpace(request.Features))
        {
            featureList = request.Features
                .Split(new[] { ',', ';' }, StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                .Distinct()
                .ToList();
        }

        var now = DateTime.UtcNow;
        var newCar = new Car
        {
            Id = $"car-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}",
            SellerId = userId!,
            Title = request.Title.Trim(),
            Make = request.Make.Trim(),
            Model = request.Model.Trim(),
            Year = request.Year,
            Price = request.Price,
            Mileage = request.Mileage,
            FuelType = string.IsNullOrWhiteSpace(request.FuelType) ? "Petrol" : request.FuelType.Trim(),
            Transmission = string.IsNullOrWhiteSpace(request.Transmission) ? "Automatic" : request.Transmission.Trim(),
            Condition = string.IsNullOrWhiteSpace(request.Condition) ? "Used" : request.Condition.Trim(),
            BodyType = request.BodyType?.Trim(),
            EngineCapacity = request.EngineCapacity,
            Color = request.Color?.Trim(),
            Location = request.Location.Trim(),
            Description = request.Description.Trim(),
            Features = featureList,
            Images = imagePaths,
            Status = "Available",
            CreatedAt = now,
            UpdatedAt = now
        };

        var cars = await _dataService.GetCarsAsync();
        cars.Add(newCar);
        await _dataService.SaveCarsAsync(cars);

        return StatusCode(201, new { success = true, car = newCar });
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCar(string id, [FromForm] UpdateCarRequest request)
    {
        var userId = GetCurrentUserId();
        var role = GetCurrentUserRole();

        var cars = await _dataService.GetCarsAsync();
        var car = cars.FirstOrDefault(c => c.Id == id);
        if (car == null) return NotFound(new { success = false, message = "Vehicle not found" });

        if (role != "admin" && car.SellerId != userId)
        {
            return StatusCode(403, new { success = false, message = "Forbidden: You do not own this listing" });
        }

        if (!string.IsNullOrWhiteSpace(request.Title)) car.Title = request.Title.Trim();
        if (!string.IsNullOrWhiteSpace(request.Make)) car.Make = request.Make.Trim();
        if (!string.IsNullOrWhiteSpace(request.Model)) car.Model = request.Model.Trim();
        if (request.Year.HasValue && request.Year.Value > 1900) car.Year = request.Year.Value;
        if (request.Price.HasValue && request.Price.Value >= 0) car.Price = request.Price.Value;
        if (request.Mileage.HasValue && request.Mileage.Value >= 0) car.Mileage = request.Mileage.Value;
        if (!string.IsNullOrWhiteSpace(request.FuelType)) car.FuelType = request.FuelType.Trim();
        if (!string.IsNullOrWhiteSpace(request.Transmission)) car.Transmission = request.Transmission.Trim();
        if (!string.IsNullOrWhiteSpace(request.Condition)) car.Condition = request.Condition.Trim();
        if (!string.IsNullOrWhiteSpace(request.BodyType)) car.BodyType = request.BodyType.Trim();
        if (request.EngineCapacity.HasValue) car.EngineCapacity = request.EngineCapacity.Value;
        if (!string.IsNullOrWhiteSpace(request.Color)) car.Color = request.Color.Trim();
        if (request.Location != null) car.Location = request.Location.Trim();
        if (request.Description != null) car.Description = request.Description.Trim();
        if (!string.IsNullOrWhiteSpace(request.Status))
        {
            var allowed = new[] { "Available", "Pending", "Sold" };
            if (allowed.Contains(request.Status.Trim(), StringComparer.OrdinalIgnoreCase))
            {
                car.Status = request.Status.Trim();
            }
        }

        if (request.Features != null)
        {
            car.Features = request.Features
                .Split(new[] { ',', ';' }, StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                .Distinct()
                .ToList();
        }

        // Image Handling
        var finalImages = new List<string>();
        if (!string.IsNullOrWhiteSpace(request.ExistingImages))
        {
            var existingList = request.ExistingImages
                .Split(new[] { ',', ';' }, StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                .ToList();
            finalImages.AddRange(existingList.Where(img => car.Images.Contains(img)));
        }
        else if (request.ExistingImages == null)
        {
            // If existingImages was not supplied in form, keep existing by default
            finalImages.AddRange(car.Images);
        }

        if (request.Images != null && request.Images.Count > 0)
        {
            var uploadDir = Path.Combine(_env.ContentRootPath, "uploads");
            if (!Directory.Exists(uploadDir)) Directory.CreateDirectory(uploadDir);

            foreach (var file in request.Images)
            {
                if (finalImages.Count >= 8) break;
                if (file.Length > 0 && file.Length <= 5 * 1024 * 1024)
                {
                    var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
                    var allowedExts = new[] { ".jpg", ".jpeg", ".png", ".webp" };
                    if (allowedExts.Contains(ext))
                    {
                        var fileName = $"car-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}-{Guid.NewGuid():N}{ext}";
                        var filePath = Path.Combine(uploadDir, fileName);

                        using var stream = new FileStream(filePath, FileMode.Create);
                        await file.CopyToAsync(stream);
                        finalImages.Add($"/uploads/{fileName}");
                    }
                }
            }
        }

        car.Images = finalImages;
        car.UpdatedAt = DateTime.UtcNow;

        await _dataService.SaveCarsAsync(cars);

        return Ok(new { success = true, car });
    }

    [Authorize]
    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateCarStatus(string id, [FromBody] UpdateCarStatusRequest request)
    {
        var userId = GetCurrentUserId();
        var role = GetCurrentUserRole();

        var allowed = new[] { "Available", "Pending", "Sold" };
        if (string.IsNullOrWhiteSpace(request.Status) || !allowed.Contains(request.Status, StringComparer.OrdinalIgnoreCase))
        {
            return BadRequest(new { success = false, message = "Status must be Available, Pending, or Sold" });
        }

        var cars = await _dataService.GetCarsAsync();
        var car = cars.FirstOrDefault(c => c.Id == id);
        if (car == null) return NotFound(new { success = false, message = "Vehicle not found" });

        if (role != "admin" && car.SellerId != userId)
        {
            return StatusCode(403, new { success = false, message = "Forbidden: You do not own this listing" });
        }

        car.Status = request.Status;
        car.UpdatedAt = DateTime.UtcNow;
        await _dataService.SaveCarsAsync(cars);

        return Ok(new { success = true, car });
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCar(string id)
    {
        var userId = GetCurrentUserId();
        var role = GetCurrentUserRole();

        var cars = await _dataService.GetCarsAsync();
        var car = cars.FirstOrDefault(c => c.Id == id);
        if (car == null) return NotFound(new { success = false, message = "Vehicle not found" });

        if (role != "admin" && car.SellerId != userId)
        {
            return StatusCode(403, new { success = false, message = "Forbidden: You do not own this listing" });
        }

        cars.Remove(car);
        await _dataService.SaveCarsAsync(cars);

        return Ok(new { success = true, message = "Listing deleted successfully" });
    }
}
