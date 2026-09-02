using System.Text.Json.Serialization;

namespace VehicleHub.Models;

public class Conversation
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("carId")]
    public string? CarId { get; set; }

    [JsonPropertyName("buyerId")]
    public string BuyerId { get; set; } = string.Empty;

    [JsonPropertyName("sellerId")]
    public string SellerId { get; set; } = string.Empty;

    [JsonPropertyName("lastMessage")]
    public string LastMessage { get; set; } = string.Empty;

    [JsonPropertyName("lastMessageAt")]
    public DateTime LastMessageAt { get; set; } = DateTime.UtcNow;

    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [JsonPropertyName("partner")]
    public UserSummaryDto? Partner { get; set; }

    [JsonPropertyName("car")]
    public CarSummaryDto? Car { get; set; }

    [JsonPropertyName("unreadCount")]
    public int UnreadCount { get; set; }
}

public class UserSummaryDto
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("role")]
    public string Role { get; set; } = string.Empty;
}

public class CarSummaryDto
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;

    [JsonPropertyName("price")]
    public decimal Price { get; set; }

    [JsonPropertyName("image")]
    public string? Image { get; set; }
}
