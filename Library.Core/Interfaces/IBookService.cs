using Library.Core.Dtos.Book;
using Library.Core.Entities;

namespace Library.Core.Interfaces;

public interface IBookService
{
    Task<IEnumerable<BookDto>> GetAllAsync();
    Task<BookDto> GetByIdAsync(int id);
    Task<BookDto> CreateAsync(CreateBookDto dto);
    Task<BookDto> UpdateAsync(int id, UpdateBookDto dto);
    Task<bool> DeleteAsync(int id);
}