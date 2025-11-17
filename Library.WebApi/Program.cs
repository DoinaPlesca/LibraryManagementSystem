using FluentValidation.AspNetCore;
using Library.Core.Interfaces;
using Library.Core.Mapping;
using Library.Core.Services;
using Library.Infrastructure.Data;
using Library.Infrastructure.Interfaces;
using Library.Infrastructure.Repositories;
using Library.Infrastructure.Seed;
using Library.WebApi.Middleware;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

var envPath = Path.Combine(Directory.GetParent(Directory.GetCurrentDirectory())!.FullName, ".env");
DotNetEnv.Env.Load(envPath);
builder.Configuration.AddEnvironmentVariables();

var postgresConnectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING");
if (string.IsNullOrWhiteSpace(postgresConnectionString))
    throw new Exception("Environment variable DB_CONNECTION_STRING is missing!");

Console.WriteLine($"Connecting to PostgreSQL with: {postgresConnectionString}");

builder.Services.AddDbContext<LibraryContext>(options =>
    options.UseNpgsql(postgresConnectionString));

builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>)); 
builder.Services.AddScoped<IDbInitializer, DbInitializer>();
builder.Services.AddScoped<IBookService, BookService>();
builder.Services.AddScoped<IAuthorService, AuthorService>();
builder.Services.AddScoped<IBorrowService, BorrowService>();


builder.Services.AddAutoMapper(typeof(LibraryProfile));

builder.Services
    .AddFluentValidationAutoValidation()
    .AddFluentValidationClientsideAdapters();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(
            new System.Text.Json.Serialization.JsonStringEnumConverter());
    });

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>
{
    options.SupportNonNullableReferenceTypes();
});
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());
});


var app = builder.Build();

app.UseMiddleware<ExceptionHandlingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

using (var scope = app.Services.CreateScope())
{
    var initializer = scope.ServiceProvider.GetRequiredService<IDbInitializer>();
    await initializer.InitializeAsync();
}


app.UseCors("AllowAll");
app.UseHttpsRedirection();

app.MapControllers();

app.Run();
