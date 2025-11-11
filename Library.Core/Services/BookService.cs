using Library.Core.Entities;
using Library.Core.Interfaces;

namespace Library.Core.Services;

public class BookService : IBookService
{
    public Task<IEnumerable<Book>> GetAllAsync()
    {
        throw new NotImplementedException();
    }

    public Task<Book?> GetByIdAsync(int id)
    {
        throw new NotImplementedException();
    }

    public Task<Book> CreateAsync(Book book)
    {
        throw new NotImplementedException();
    }

    public Task<Book> UpdateAsync(int id, Book book)
    {
        throw new NotImplementedException();
    }

    public Task<bool> DeleteAsync(int id)
    {
        throw new NotImplementedException();
    }
}