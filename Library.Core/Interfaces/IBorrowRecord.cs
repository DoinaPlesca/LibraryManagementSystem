using Library.Core.Dtos.Borrow;

namespace Library.Core.Interfaces;

public interface IBorrowService
{
    Task<BorrowRecordDto> BorrowBookAsync(string userName, int bookId);
    Task<BorrowRecordDto> ReturnBookAsync(int borrowId);
}