using System.Text.Json.Serialization;

namespace VehicleHub.Models;

public class Car
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("sellerId")]
    public string SellerId { get; set; } = string.Empty;

    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;

    [JsonPropertyName("make")]
    public string Make { get; set; } = string.Empty;

    [JsonPropertyName("model")]
    public string Model { get; set; } = string.Empty;

    [JsonPropertyName("year")]
    public int Year { get; set; }

    [JsonPropertyName("price")]
    public decimal Price { get; set; }

    [JsonPropertyName("mileage")]
    public decimal Mileage { get; set; }

    [JsonPropertyName("fuelType")]
    public string FuelType { get; set; } = "Petrol";

    [JsonPropertyName("transmission")]
    public string Transmission { get; set; } = "Automatic";

    [JsonPropertyName("condition")]
    public string Condition { get; set; } = "Used";

    [JsonPropertyName("location")]
    public string Location { get; set; } = string.Empty;

    [JsonPropertyName("description")]
    public string Description { get; set; } = string.Empty;

    [JsonPropertyName("images")]
    public List<string> Images { get; set; } = new();

    [JsonPropertyName("status")]
    public string Status { get; set; } = "Available"; // "Available", "Pending", "Sold", "Deleted"

    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [JsonPropertyName("updatedAt")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    [JsonPropertyName("seller")]
    public SellerSummaryDto? Seller { get; set; }
}

public class SellerSummaryDto
{
    [JsonPropertyName("id")]
    public string? Id { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("phone")]
    public string? Phone { get; set; }

    [JsonPropertyName("verifiedSeller")]
    public bool VerifiedSeller { get; set; }
}
