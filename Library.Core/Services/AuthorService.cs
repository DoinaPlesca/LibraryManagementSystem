using AutoMapper;
using Library.Core.Dtos.Author;
using Library.Core.Dtos.Book;
using Library.Core.Entities;
using Library.Core.Interfaces;

namespace Library.Core.Services;

public class AuthorService : IAuthorService
{
    private readonly IRepository<Author> _repository;
    private readonly IMapper _mapper;
    public AuthorService(IRepository<Author> repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<AuthorDto>> GetAllAsync()
    {
        var authors = await _repository.GetAllAsync();
        return _mapper.Map<IEnumerable<AuthorDto>>(authors);
    }

    public async Task<AuthorDto> CreateAsync(CreateAuthorDto dto)
    {
        var author = _mapper.Map<Author>(dto);
        await _repository.AddAsync(author);
        await _repository.SaveChangesAsync();
        return _mapper.Map<AuthorDto>(author);
    }
}