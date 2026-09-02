using System.Text.Json.Serialization;

namespace VehicleHub.Models.DTOs;

public class ApiResponse<T>
{
    [JsonPropertyName("success")]
    public bool Success { get; set; } = true;

    [JsonPropertyName("message")]
    public string? Message { get; set; }

    [JsonPropertyName("data")]
    public T? Data { get; set; }
}

public class BaseApiResponse
{
    [JsonPropertyName("success")]
    public bool Success { get; set; } = true;

    [JsonPropertyName("message")]
    public string? Message { get; set; }
}

public class AdminStatsDto
{
    [JsonPropertyName("totalUsers")]
    public int TotalUsers { get; set; }

    [JsonPropertyName("buyers")]
    public int Buyers { get; set; }

    [JsonPropertyName("sellers")]
    public int Sellers { get; set; }

    [JsonPropertyName("verifiedSellers")]
    public int VerifiedSellers { get; set; }

    [JsonPropertyName("totalListings")]
    public int TotalListings { get; set; }

    [JsonPropertyName("availableListings")]
    public int AvailableListings { get; set; }

    [JsonPropertyName("soldListings")]
    public int SoldListings { get; set; }

    [JsonPropertyName("totalMessages")]
    public int TotalMessages { get; set; }
}
