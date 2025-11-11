using Library.Core.Dtos.Author;
using Library.Core.Interfaces;
using Library.WebApi.Wrappers;
using Microsoft.AspNetCore.Mvc;

namespace Library.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthorsController : ControllerBase
{
    private readonly IAuthorService _authorService;

    public AuthorsController(IAuthorService authorService)
    {
        _authorService = authorService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var authors = await _authorService.GetAllAsync();
        return Ok(ApiResponse<IEnumerable<AuthorDto>>.Ok(authors));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateAuthorDto dto)
    {
        var created = await _authorService.CreateAsync(dto);
        return Ok(ApiResponse<AuthorDto>.Ok(created, "Author created successfully"));
    }
}