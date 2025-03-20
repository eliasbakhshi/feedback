using backend.Services;
using backend.UserDataAccess;
using backend.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.AllowAnyOrigin()
                                .AllowAnyMethod()
                                .AllowAnyHeader();
                      });
});

builder.Services.AddLogging();
builder.Services.AddSingleton<DBManager>();
builder.Services.AddSingleton<EmailService>();
builder.Services.AddHttpClient<RecaptchaService>();
builder.Services.AddSingleton<RecaptchaService>();
builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));

var app = builder.Build();

app.UseCors(MyAllowSpecificOrigins);

app.UseAuthorization();
app.MapControllers();

app.Run();
