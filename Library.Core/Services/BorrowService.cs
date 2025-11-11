using Library.Core.Interfaces;

namespace Library.Core.Services;

public class BorrowService : IBorrowService
{
    public Task<string> BorrowBookAsync(string userName, int bookId)
    {
        throw new NotImplementedException();
    }

    public Task<string> ReturnBookAsync(int borrowId)
    {
        throw new NotImplementedException();
    }
}