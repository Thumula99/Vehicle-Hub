using System.Text.Json.Serialization;

namespace VehicleHub.Models.DTOs;

public class CarQueryParameters
{
    public string? Keyword { get; set; }
    public string? Make { get; set; }
    public string? Model { get; set; }
    public string? FuelType { get; set; }
    public string? Transmission { get; set; }
    public string? Condition { get; set; }
    public string? Location { get; set; }
    public string? Status { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public int? MinYear { get; set; }
    public int? MaxYear { get; set; }
    public decimal? MinMileage { get; set; }
    public decimal? MaxMileage { get; set; }
    public string Sort { get; set; } = "newest";
    public int Page { get; set; } = 1;
    public int Limit { get; set; } = 12;
}

public class PaginatedCarsResponse
{
    [JsonPropertyName("success")]
    public bool Success { get; set; } = true;

    [JsonPropertyName("cars")]
    public List<Car> Cars { get; set; } = new();

    [JsonPropertyName("pagination")]
    public PaginationMetadata Pagination { get; set; } = new();
}

public class PaginationMetadata
{
    [JsonPropertyName("page")]
    public int Page { get; set; }

    [JsonPropertyName("limit")]
    public int Limit { get; set; }

    [JsonPropertyName("total")]
    public int Total { get; set; }

    [JsonPropertyName("totalPages")]
    public int TotalPages { get; set; }
}

public class CreateCarRequest
{
    public string Title { get; set; } = string.Empty;
    public string Make { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public int Year { get; set; }
    public decimal Price { get; set; }
    public decimal Mileage { get; set; }
    public string FuelType { get; set; } = "Petrol";
    public string Transmission { get; set; } = "Automatic";
    public string Condition { get; set; } = "Used";
    public string? BodyType { get; set; }
    public int? EngineCapacity { get; set; }
    public string? Color { get; set; }
    public string Location { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Features { get; set; } // Comma-separated or JSON list
    public List<IFormFile>? Images { get; set; }
}

public class UpdateCarRequest
{
    public string? Title { get; set; }
    public string? Make { get; set; }
    public string? Model { get; set; }
    public int? Year { get; set; }
    public decimal? Price { get; set; }
    public decimal? Mileage { get; set; }
    public string? FuelType { get; set; }
    public string? Transmission { get; set; }
    public string? Condition { get; set; }
    public string? BodyType { get; set; }
    public int? EngineCapacity { get; set; }
    public string? Color { get; set; }
    public string? Location { get; set; }
    public string? Description { get; set; }
    public string? Status { get; set; }
    public string? Features { get; set; }
    public string? ExistingImages { get; set; } // Comma-separated or JSON list of existing image URLs to keep
    public List<IFormFile>? Images { get; set; } // New image files to append
}

public class UpdateCarStatusRequest
{
    [JsonPropertyName("status")]
    public string Status { get; set; } = "Available";
}

public class ComparisonHighlightsDto
{
    [JsonPropertyName("lowestPrice")]
    public decimal? LowestPrice { get; set; }

    [JsonPropertyName("lowestMileage")]
    public decimal? LowestMileage { get; set; }

    [JsonPropertyName("newestYear")]
    public int? NewestYear { get; set; }
}

public class ComparisonResponse
{
    [JsonPropertyName("success")]
    public bool Success { get; set; } = true;

    [JsonPropertyName("cars")]
    public List<Car> Cars { get; set; } = new();

    [JsonPropertyName("highlights")]
    public ComparisonHighlightsDto Highlights { get; set; } = new();

    [JsonPropertyName("message")]
    public string? Message { get; set; }
}
