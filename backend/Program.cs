using backend.Tests;
var builder = WebApplication.CreateBuilder(args);

bool debug = true;

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

// Kör test funktionen

if (debug)
    TestRunner.RunAllTests();


app.Run();
