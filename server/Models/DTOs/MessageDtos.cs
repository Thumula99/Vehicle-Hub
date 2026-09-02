using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace VehicleHub.Models.DTOs;

public class SendMessageRequest
{
    [Required]
    [JsonPropertyName("receiverId")]
    public string ReceiverId { get; set; } = string.Empty;

    [Required]
    [JsonPropertyName("carId")]
    public string CarId { get; set; } = string.Empty;

    [Required]
    [JsonPropertyName("message")]
    public string Message { get; set; } = string.Empty;
}

public class SendMessageResponse
{
    [JsonPropertyName("success")]
    public bool Success { get; set; } = true;

    [JsonPropertyName("message")]
    public Message Message { get; set; } = new();

    [JsonPropertyName("conversationId")]
    public string ConversationId { get; set; } = string.Empty;
}

public class UnreadCountResponse
{
    [JsonPropertyName("success")]
    public bool Success { get; set; } = true;

    [JsonPropertyName("unreadCount")]
    public int UnreadCount { get; set; }
}
