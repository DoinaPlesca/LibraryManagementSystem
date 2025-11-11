using Library.Core.Entities;

namespace Library.Core.Interfaces;

public interface IBookService
{
    Task<IEnumerable<Book>> GetAllAsync();
    Task<Book?> GetByIdAsync(int id);
    Task<Book> CreateAsync(Book book);
    Task<Book> UpdateAsync(int id, Book book);
    Task<bool> DeleteAsync(int id);
}