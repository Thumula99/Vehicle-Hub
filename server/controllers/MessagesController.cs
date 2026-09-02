using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VehicleHub.Models;
using VehicleHub.Models.DTOs;
using VehicleHub.Services;

namespace VehicleHub.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class MessagesController : ControllerBase
{
    private readonly IDataService _dataService;

    public MessagesController(IDataService dataService)
    {
        _dataService = dataService;
    }

    private string? GetCurrentUserId()
    {
        return User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("id")?.Value;
    }

    [HttpGet("conversations")]
    public async Task<IActionResult> GetConversations()
    {
        var userId = GetCurrentUserId();
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var conversations = await _dataService.GetConversationsAsync();
        var userConvs = conversations.Where(c => c.BuyerId == userId || c.SellerId == userId).ToList();

        var users = await _dataService.GetUsersAsync();
        var cars = await _dataService.GetCarsAsync();
        var messages = await _dataService.GetMessagesAsync();

        foreach (var conv in userConvs)
        {
            var otherUserId = conv.BuyerId == userId ? conv.SellerId : conv.BuyerId;
            var otherUser = users.FirstOrDefault(u => u.Id == otherUserId);
            var car = cars.FirstOrDefault(c => c.Id == conv.CarId);
            var unread = messages.Count(m => m.ConversationId == conv.Id && m.ReceiverId == userId && !m.Read);

            conv.Partner = otherUser != null ? new UserSummaryDto
            {
                Id = otherUser.Id,
                Name = otherUser.Name,
                Role = otherUser.Role
            } : null;

            conv.Car = car != null ? new CarSummaryDto
            {
                Id = car.Id,
                Title = car.Title,
                Price = car.Price,
                Image = car.Images.Count > 0 ? car.Images[0] : null
            } : null;

            conv.UnreadCount = unread;
        }

        return Ok(new { success = true, conversations = userConvs });
    }

    [HttpGet("{conversationId}")]
    public async Task<IActionResult> GetConversationMessages(string conversationId)
    {
        var userId = GetCurrentUserId();
        var conversations = await _dataService.GetConversationsAsync();
        var conv = conversations.FirstOrDefault(c => c.Id == conversationId);

        if (conv == null) return NotFound(new { success = false, message = "Conversation not found" });

        if (conv.BuyerId != userId && conv.SellerId != userId)
        {
            return StatusCode(403, new { success = false, message = "Forbidden: You are not part of this conversation" });
        }

        var messages = await _dataService.GetMessagesAsync();
        var convMessages = messages.Where(m => m.ConversationId == conversationId).OrderBy(m => m.CreatedAt).ToList();

        return Ok(new { success = true, messages = convMessages });
    }

    [HttpPost]
    public async Task<IActionResult> SendMessage([FromBody] SendMessageRequest request)
    {
        var userId = GetCurrentUserId();
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var conversations = await _dataService.GetConversationsAsync();
        var conv = conversations.FirstOrDefault(c => c.CarId == request.CarId &&
            ((c.BuyerId == userId && c.SellerId == request.ReceiverId) ||
             (c.BuyerId == request.ReceiverId && c.SellerId == userId)));

        var now = DateTime.UtcNow;
        if (conv == null)
        {
            conv = new Conversation
            {
                Id = $"conv-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}",
                CarId = request.CarId,
                BuyerId = userId,
                SellerId = request.ReceiverId,
                LastMessage = request.Message,
                LastMessageAt = now,
                CreatedAt = now
            };
            conversations.Add(conv);
        }
        else
        {
            conv.LastMessage = request.Message;
            conv.LastMessageAt = now;
        }
        await _dataService.SaveConversationsAsync(conversations);

        var newMessage = new Message
        {
            Id = $"msg-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}",
            ConversationId = conv.Id,
            SenderId = userId,
            ReceiverId = request.ReceiverId,
            CarId = request.CarId,
            Text = request.Message,
            Read = false,
            CreatedAt = now
        };

        var messages = await _dataService.GetMessagesAsync();
        messages.Add(newMessage);
        await _dataService.SaveMessagesAsync(messages);

        return StatusCode(201, new SendMessageResponse
        {
            Success = true,
            Message = newMessage,
            ConversationId = conv.Id
        });
    }

    [HttpPut("{conversationId}/read")]
    public async Task<IActionResult> MarkRead(string conversationId)
    {
        var userId = GetCurrentUserId();
        var messages = await _dataService.GetMessagesAsync();

        var updated = false;
        foreach (var m in messages.Where(m => m.ConversationId == conversationId && m.ReceiverId == userId && !m.Read))
        {
            m.Read = true;
            updated = true;
        }

        if (updated)
        {
            await _dataService.SaveMessagesAsync(messages);
        }

        return Ok(new { success = true, message = "Messages marked as read" });
    }

    [HttpGet("unread/count")]
    public async Task<IActionResult> GetUnreadCount()
    {
        var userId = GetCurrentUserId();
        var messages = await _dataService.GetMessagesAsync();
        var count = messages.Count(m => m.ReceiverId == userId && !m.Read);

        return Ok(new UnreadCountResponse { Success = true, UnreadCount = count });
    }
}
