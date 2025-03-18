var builder = WebApplication.CreateBuilder(args);

var startup = new Startup(builder.Configuration);

startup.ConfigureServices(builder.Services);

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

builder.Services.AddHttpClient<RecaptchaService>();
builder.Services.AddSingleton<RecaptchaService>();

var app = builder.Build();

app.UseCors(MyAllowSpecificOrigins);

startup.Configure(app, builder.Environment);

app.UseAuthorization();
app.MapControllers();

app.Run();
