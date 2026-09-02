using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ServerCSharp.Models
{
    public class User
    {
        [Key]
        [JsonPropertyName("id")]
        public string Id { get; set; } = string.Empty;

        [Required]
        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [JsonPropertyName("email")]
        public string Email { get; set; } = string.Empty;

        [Required]
        [JsonPropertyName("passwordHash")]
        public string PasswordHash { get; set; } = string.Empty;

        [JsonPropertyName("phone")]
        public string Phone { get; set; } = string.Empty;

        [JsonPropertyName("address")]
        public string Address { get; set; } = string.Empty;

        [JsonPropertyName("role")]
        public string Role { get; set; } = "buyer";

        [JsonPropertyName("verifiedSeller")]
        public bool VerifiedSeller { get; set; } = false;

        [Column(TypeName = "text[]")]
        [JsonPropertyName("wishlist")]
        public List<string> Wishlist { get; set; } = new List<string>();

        [JsonPropertyName("createdAt")]
        public string CreatedAt { get; set; } = string.Empty;

        [JsonPropertyName("updatedAt")]
        public string UpdatedAt { get; set; } = string.Empty;
    }
}
