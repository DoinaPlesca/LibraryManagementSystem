using Library.Core.Entities;
using Library.Core.Interfaces;

namespace Library.Core.Services;

public class AuthorService : IAuthorService
{
    private readonly IRepository<Author> _repository;

    public AuthorService(IRepository<Author> repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<Author>> GetAllAsync()
        => await _repository.GetAllAsync();

    public async Task<Author> CreateAsync(Author author)
    {
        await _repository.AddAsync(author);
        await _repository.SaveChangesAsync();
        return author;
    }
}