using Library.Core.Entities;

namespace Library.Core.Interfaces;

public interface IAuthorService
{
    Task<IEnumerable<Author>> GetAllAsync();
    Task<Author> CreateAsync(Author author);
}