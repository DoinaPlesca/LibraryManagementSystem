using Library.Core.Dtos.Author;
using Library.Core.Dtos.Book;
using Library.Core.Entities;

namespace Library.Core.Interfaces;

public interface IAuthorService
{
    Task<IEnumerable<AuthorDto>> GetAllAsync();
    Task<AuthorDto> CreateAsync(CreateAuthorDto dto);
}