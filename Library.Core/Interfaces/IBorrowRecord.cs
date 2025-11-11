namespace Library.Core.Interfaces;

public interface IBorrowService
{
    Task<string> BorrowBookAsync(string userName, int bookId);
    Task<string> ReturnBookAsync(int borrowId);
}