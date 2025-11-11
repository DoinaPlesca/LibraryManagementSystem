using Library.Core.Entities;
using Library.Core.Interfaces;

namespace Library.Core.Services;

public class AuthorService : IAuthorService
{
    public Task<IEnumerable<Author>> GetAllAsync()
    {
        throw new NotImplementedException();
    }

    public Task<Author> CreateAsync(Author author)
    {
        throw new NotImplementedException();
    }
}