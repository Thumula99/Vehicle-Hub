using System.Text.Json;
using VehicleHub.Models;

namespace VehicleHub.Services;

public interface IDataService
{
    Task<List<User>> GetUsersAsync();
    Task SaveUsersAsync(List<User> users);

    Task<List<Car>> GetCarsAsync();
    Task SaveCarsAsync(List<Car> cars);

    Task<List<Message>> GetMessagesAsync();
    Task SaveMessagesAsync(List<Message> messages);

    Task<List<Conversation>> GetConversationsAsync();
    Task SaveConversationsAsync(List<Conversation> conversations);

    Task<List<Notification>> GetNotificationsAsync();
    Task SaveNotificationsAsync(List<Notification> notifications);
}

public class DataService : IDataService
{
    private readonly string _dataDir;
    private static readonly SemaphoreSlim _lock = new(1, 1);
    private readonly JsonSerializerOptions _jsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
        WriteIndented = true
    };

    public DataService(IWebHostEnvironment env)
    {
        _dataDir = Path.Combine(env.ContentRootPath, "data");
        if (!Directory.Exists(_dataDir))
        {
            Directory.CreateDirectory(_dataDir);
        }
    }

    private async Task<List<T>> ReadJsonAsync<T>(string filename)
    {
        await _lock.WaitAsync();
        try
        {
            var filePath = Path.Combine(_dataDir, filename);
            if (!File.Exists(filePath))
            {
                return new List<T>();
            }

            var content = await File.ReadAllTextAsync(filePath);
            if (string.IsNullOrWhiteSpace(content))
            {
                return new List<T>();
            }

            return JsonSerializer.Deserialize<List<T>>(content, _jsonOptions) ?? new List<T>();
        }
        finally
        {
            _lock.Release();
        }
    }

    private async Task WriteJsonAsync<T>(string filename, List<T> data)
    {
        await _lock.WaitAsync();
        try
        {
            var filePath = Path.Combine(_dataDir, filename);
            var tempPath = $"{filePath}.tmp";

            var json = JsonSerializer.Serialize(data, _jsonOptions);
            await File.WriteAllTextAsync(tempPath, json);

            File.Move(tempPath, filePath, overwrite: true);
        }
        finally
        {
            _lock.Release();
        }
    }

    public Task<List<User>> GetUsersAsync() => ReadJsonAsync<User>("users.json");
    public Task SaveUsersAsync(List<User> users) => WriteJsonAsync("users.json", users);

    public Task<List<Car>> GetCarsAsync() => ReadJsonAsync<Car>("cars.json");
    public Task SaveCarsAsync(List<Car> cars) => WriteJsonAsync("cars.json", cars);

    public Task<List<Message>> GetMessagesAsync() => ReadJsonAsync<Message>("messages.json");
    public Task SaveMessagesAsync(List<Message> messages) => WriteJsonAsync("messages.json", messages);

    public Task<List<Conversation>> GetConversationsAsync() => ReadJsonAsync<Conversation>("conversations.json");
    public Task SaveConversationsAsync(List<Conversation> conversations) => WriteJsonAsync("conversations.json", conversations);

    public Task<List<Notification>> GetNotificationsAsync() => ReadJsonAsync<Notification>("notifications.json");
    public Task SaveNotificationsAsync(List<Notification> notifications) => WriteJsonAsync("notifications.json", notifications);
}
