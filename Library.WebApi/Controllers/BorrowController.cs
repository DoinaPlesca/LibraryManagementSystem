using Library.Core.Dtos.Borrow;
using Library.Core.Interfaces;
using Library.WebApi.Wrappers;
using Microsoft.AspNetCore.Mvc;

namespace Library.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BorrowController : ControllerBase
{
    private readonly IBorrowService _borrowService;

    public BorrowController(IBorrowService borrowService)
    {
        _borrowService = borrowService;
    }

    [HttpPost("borrow")]
    public async Task<IActionResult> Borrow([FromBody] CreateBorrowDto dto)
    {
        var record = await _borrowService.BorrowBookAsync(dto.UserName, dto.BookId);
        return Ok(ApiResponse<BorrowRecordDto>.Ok(record, "Book borrowed successfully"));
    }
    
    [HttpPost("return/{borrowId}")]
    public async Task<IActionResult> Return(int borrowId)
    {
        var record = await _borrowService.ReturnBookAsync(borrowId);
        return Ok(ApiResponse<BorrowRecordDto>.Ok(record, "Book returned successfully"));
    }
}