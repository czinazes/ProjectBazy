using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Http;
using StackExchange.Redis;
using URLShortender.Infrastructure;
using URLShortender.Models;
using URLShortender.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<RedisOptions>(builder.Configuration.GetSection("Redis"));
builder.Services.Configure<AppOptions>(builder.Configuration.GetSection("AppOptions"));

builder.Services.AddSingleton<IConnectionMultiplexer>(serviceProvider =>
    {
        var redisOptions = serviceProvider.GetRequiredService<IOptions<RedisOptions>>().Value;
        var configString = $"{redisOptions.Host}:{redisOptions.Port}";
        return ConnectionMultiplexer.Connect(configString);
    });

builder.Services.AddSingleton<RedisUrlRepository>();
builder.Services.AddScoped<IURLService,URLService>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(); 

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy
            .WithOrigins("http://localhost:5173") // frontend
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

//Swagger
app.UseSwagger();
app.UseSwaggerUI();

app.UseCors();

app.MapGet("/", () => "URL Shortener API działa 🚀");

app.MapPost("/api/shortender", async (
    ShortenRequest request,
    IURLService urlService,
    HttpContext httpContext) =>
{
    if (String.IsNullOrWhiteSpace(request.Url))
    {
        return Results.BadRequest(new { error = "Url is required" });
    }

    if (!Uri.TryCreate(request.Url, UriKind.Absolute, out _))
    {
        return Results.BadRequest(new { error = "Url is invalid" });
    }

    var code = await urlService.CreateShortCodeAsync(request.Url);
    var baseUrl = $"{httpContext.Request.Scheme}://{httpContext.Request.Host}";
    var shortUrl = $"{baseUrl}/{code}";

    var response = new ShortenResponse
    {
        ShortCode = code,
        ShortUrl = shortUrl
    };
    return Results.Ok(response);
});

app.MapGet("/{code}", async (string code, IURLService urlService) =>
{
    var url = await urlService.GetOriginalUrlAsync(code, incrementClicks: true);
    if (url == null)
    {
        return Results.BadRequest(new { error = "Code not found" });
    }
    return Results.Redirect(url, permanent:false);
});

app.MapGet("/api/stats/{code}", async (string code, IURLService urlService) =>
{
    var url = await urlService.GetOriginalUrlAsync(code, incrementClicks: false);
    if (url == null)
    {
        return Results.NotFound("Code not found");
    }
    var clicks = await urlService.GetClicksAsync(code);

    return Results.Ok(new
    {
        shortCode = code,
        originalUrl = url,
        clicks
    });
});
    
app.Run();
