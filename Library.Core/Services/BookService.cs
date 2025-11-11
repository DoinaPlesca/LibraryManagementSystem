using Library.Core.Entities;
using Library.Core.Exceptions;
using Library.Core.Interfaces;

namespace Library.Core.Services;

public class BookService : IBookService
{
    private readonly IRepository<Book> _bookRepository;
    private readonly IRepository<Author> _authorRepository;
    public BookService(IRepository<Book> bookRepository, IRepository<Author> authorRepository)
    {
        _bookRepository = bookRepository;
        _authorRepository = authorRepository;
    }

    public async Task<IEnumerable<Book>> GetAllAsync()
    {
        return await _bookRepository.GetAllAsync();
    }

    public async Task<Book?> GetByIdAsync(int id)
    {
        var book = await _bookRepository.GetByIdAsync(id);
        if (book == null)
            throw new NotFoundException($"Book with ID {id} not found.");

        return book;
    }

    public async Task<Book> CreateAsync(Book book)
    {
        var author = await _authorRepository.GetByIdAsync(book.AuthorId);
        if (author == null)
            throw new BadRequestException($"Author with ID {book.AuthorId} does not exist.");

        book.Author = author;

        await _bookRepository.AddAsync(book);
        await _bookRepository.SaveChangesAsync();
        return book; 
    }
        

    public async Task<Book> UpdateAsync(int id, Book book)
    {
        var existing = await _bookRepository.GetByIdAsync(id);
        if (existing == null)
            throw new NotFoundException($"Book with ID {id} not found.");

        var author = await _authorRepository.GetByIdAsync(book.AuthorId);
        if (author == null)
            throw new BadRequestException($"Author with ID {book.AuthorId} does not exist.");

        existing.Title = book.Title;
        existing.Genre = book.Genre;
        existing.AuthorId = book.AuthorId;
        existing.AvailableCopies = book.AvailableCopies;
        existing.Author = author;

        _bookRepository.Update(existing);
        await _bookRepository.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var book = await _bookRepository.GetByIdAsync(id);
        if (book == null)
            throw new NotFoundException($"Book with ID {id} not found.");

        _bookRepository.Delete(book);
        await _bookRepository.SaveChangesAsync();
        return true;
    }
}