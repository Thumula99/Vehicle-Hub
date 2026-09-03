using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

namespace ServerCSharp.Services
{
    public class JsonStorageService
    {
        private readonly string _dataDirectory;
        private static readonly SemaphoreSlim _semaphore = new SemaphoreSlim(1, 1);

        public JsonStorageService()
        {
            // Point to the existing Node.js server/data folder
            _dataDirectory = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "server", "data"));
        }

        public async Task<List<T>> ReadDataAsync<T>(string filename)
        {
            string filePath = Path.Combine(_dataDirectory, filename);
            if (!File.Exists(filePath))
            {
                return new List<T>();
            }

            await _semaphore.WaitAsync();
            try
            {
                string json = await File.ReadAllTextAsync(filePath);
                if (string.IsNullOrWhiteSpace(json))
                {
                    return new List<T>();
                }
                return JsonSerializer.Deserialize<List<T>>(json) ?? new List<T>();
            }
            finally
            {
                _semaphore.Release();
            }
        }

        public async Task WriteDataAsync<T>(string filename, List<T> data)
        {
            string filePath = Path.Combine(_dataDirectory, filename);
            
            await _semaphore.WaitAsync();
            try
            {
                var options = new JsonSerializerOptions { WriteIndented = true };
                string json = JsonSerializer.Serialize(data, options);
                await File.WriteAllTextAsync(filePath, json);
            }
            finally
            {
                _semaphore.Release();
            }
        }
    }
}
