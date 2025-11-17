using Library.Core.Dtos.Book;
using Library.Core.Interfaces;
using Library.WebApi.Wrappers;
using Microsoft.AspNetCore.Mvc;

namespace Library.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BooksController : ControllerBase
{
    private readonly IBookService _bookService;

    public BooksController(IBookService bookService)
    {
        _bookService = bookService;
    }
    
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var books = await _bookService.GetAllAsync();
        return Ok(ApiResponse<IEnumerable<BookDto>>.Ok(books));
    }
    
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var book = await _bookService.GetByIdAsync(id);
        return Ok(ApiResponse<BookDto>.Ok(book));
    }

    
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBookDto dto)
    {
        var created = await _bookService.CreateAsync(dto);
        return Ok(ApiResponse<BookDto>.Ok(created, "Book created successfully"));
    }

  
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateBookDto dto)
    {
        var updated = await _bookService.UpdateAsync(id, dto);
        return Ok(ApiResponse<BookDto>.Ok(updated, "Book updated successfully"));
    }
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _bookService.DeleteAsync(id);
        return Ok(ApiResponse<string>.Ok(deleted ? "Book deleted" : "Book not found"));
    }
}