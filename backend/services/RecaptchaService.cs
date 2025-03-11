// filepath: /e:/projects/feedback/backend/services/RecaptchaService.cs
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

public class RecaptchaService
{
    private readonly HttpClient _httpClient;
    private readonly string _secretKey;

    public RecaptchaService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _secretKey = configuration["Recaptcha:SecretKey"] ?? throw new ArgumentNullException(nameof(configuration), "Recaptcha secret key is not configured.");

    }

    public async Task<bool> VerifyRecaptchaAsync(string? token)
    {

        if (string.IsNullOrEmpty(token))
        {
            return false;
        }

        var response = await _httpClient.PostAsync(
            $"https://www.google.com/recaptcha/api/siteverify?secret={_secretKey}&response={token}",
            null);

        if (!response.IsSuccessStatusCode)
        {
            return false;
        }


        var jsonResponse = await response.Content.ReadAsStringAsync();

        var recaptchaResponse = JsonSerializer.Deserialize<RecaptchaResponse>(jsonResponse);

        return recaptchaResponse?.success ?? false;
    }
}

public class RecaptchaResponse
{
    public bool success { get; set; }
    public string? challenge_ts { get; set; } // Make nullable
    public string? hostname { get; set; } // Make nullable
    public string[]? ErrorCodes { get; set; } // Make nullable
}
