using System.Text.Json.Serialization;

namespace VehicleHub.Models;

public class Message
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("conversationId")]
    public string ConversationId { get; set; } = string.Empty;

    [JsonPropertyName("senderId")]
    public string SenderId { get; set; } = string.Empty;

    [JsonPropertyName("receiverId")]
    public string ReceiverId { get; set; } = string.Empty;

    [JsonPropertyName("carId")]
    public string? CarId { get; set; }

    [JsonPropertyName("message")]
    public string Text { get; set; } = string.Empty;

    [JsonPropertyName("read")]
    public bool Read { get; set; } = false;

    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
