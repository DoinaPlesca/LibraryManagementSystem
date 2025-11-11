using System.Net;
using System.Text.Json;
using FluentValidation;
using Library.WebApi.Wrappers;
using Library.Core.Exceptions;

namespace Library.WebApi.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception occurred: {Message}", ex.Message);
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        if (exception is ValidationException validationException)
        {
            context.Response.StatusCode = 400;
            var response = new ApiResponse<IEnumerable<string>>
            {
                Success = false,
                Message = "Validation failed",
                Data = validationException.Errors.Select(e => e.ErrorMessage),
                Status = 400
            };

            await context.Response.WriteAsync(JsonSerializer.Serialize(response));
            return;
        }

        context.Response.StatusCode = exception switch
        {
            NotFoundException => 404,
            BadRequestException => 400,
            _ => 500
        };

        var genericResponse = new ApiResponse<string>
        {
            Success = false,
            Data = null,
            Message = exception.Message,
            Status = context.Response.StatusCode
        };

        await context.Response.WriteAsync(JsonSerializer.Serialize(genericResponse));
    }
}