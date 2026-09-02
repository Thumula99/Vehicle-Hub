using Microsoft.AspNetCore.SignalR;
using VehicleHub.Models;
using VehicleHub.Services;

namespace VehicleHub.Hubs;

public class ChatHub : Hub
{
    private static readonly Dictionary<string, string> ActiveUsers = new(); // userId -> connectionId
    private readonly IDataService _dataService;

    public ChatHub(IDataService dataService)
    {
        _dataService = dataService;
    }

    public Task RegisterUser(string userId)
    {
        if (!string.IsNullOrEmpty(userId))
        {
            lock (ActiveUsers)
            {
                ActiveUsers[userId] = Context.ConnectionId;
            }
        }
        return Task.CompletedTask;
    }

    public async Task JoinConversation(string conversationId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, conversationId);
    }

    public async Task SendMessage(string conversationId, string senderId, string receiverId, string carId, string messageText)
    {
        var now = DateTime.UtcNow;
        var newMessage = new Message
        {
            Id = $"msg-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}",
            ConversationId = conversationId,
            SenderId = senderId,
            ReceiverId = receiverId,
            CarId = carId,
            Text = messageText,
            Read = false,
            CreatedAt = now
        };

        // Persist message
        var messages = await _dataService.GetMessagesAsync();
        messages.Add(newMessage);
        await _dataService.SaveMessagesAsync(messages);

        // Update conversation
        var conversations = await _dataService.GetConversationsAsync();
        var conv = conversations.FirstOrDefault(c => c.Id == conversationId);
        if (conv != null)
        {
            conv.LastMessage = messageText;
            conv.LastMessageAt = now;
            await _dataService.SaveConversationsAsync(conversations);
        }

        // Broadcast to group room
        await Clients.Group(conversationId).SendAsync("receiveMessage", newMessage);

        // Push notification if receiver is connected
        string? receiverConnId;
        lock (ActiveUsers)
        {
            ActiveUsers.TryGetValue(receiverId, out receiverConnId);
        }

        if (!string.IsNullOrEmpty(receiverConnId))
        {
            await Clients.Client(receiverConnId).SendAsync("newNotification", new
            {
                type = "chat",
                title = "New Message",
                message = messageText.Length > 30 ? messageText[..30] + "..." : messageText,
                conversationId
            });
        }
    }

    public async Task Typing(string conversationId, string userId)
    {
        await Clients.OthersInGroup(conversationId).SendAsync("userTyping", new { userId });
    }

    public async Task StopTyping(string conversationId, string userId)
    {
        await Clients.OthersInGroup(conversationId).SendAsync("userStoppedTyping", new { userId });
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        lock (ActiveUsers)
        {
            var item = ActiveUsers.FirstOrDefault(kv => kv.Value == Context.ConnectionId);
            if (!string.IsNullOrEmpty(item.Key))
            {
                ActiveUsers.Remove(item.Key);
            }
        }
        return base.OnDisconnectedAsync(exception);
    }
}
