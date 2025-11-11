namespace Library.WebApi.Wrappers;

public class ApiResponse<T>
{
    public bool Success { get; set; }
    public T? Data { get; set; }
    public string Message { get; set; } = string.Empty;
    public int Status { get; set; }

    public static ApiResponse<T> Ok(T data, string message = "", int status = 200)
        => new() { Success = true, Data = data, Message = message, Status = status };

    public static ApiResponse<T> Fail(string message, int status = 400)
        => new() { Success = false, Data = default, Message = message, Status = status };
}