using AutoMapper;
using Library.Core.Dtos.Book;
using Library.Core.Entities;
using Library.Core.Exceptions;
using Library.Core.Interfaces;

namespace Library.Core.Services;

public class BookService : IBookService
{
    private readonly IRepository<Book> _bookRepository;
    private readonly IRepository<Author> _authorRepository;
    private readonly IRepository<BorrowRecord> _borrowRepository;
    private readonly IMapper _mapper;
    public BookService(IRepository<Book> bookRepository, IRepository<Author> authorRepository, IMapper mapper, IRepository<BorrowRecord> borrowRepository)
    {
        _bookRepository = bookRepository;
        _authorRepository = authorRepository;
        _borrowRepository = borrowRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<BookDto>> GetAllAsync()
    {
        var books = await _bookRepository.GetAllAsync();
        var activeBooks = books.Where(b => b.IsActive); 
        return _mapper.Map<IEnumerable<BookDto>>(activeBooks); 
        
    }

    public async Task<BookDto> GetByIdAsync(int id)
    {
        var book = await _bookRepository.GetByIdAsync(id);
        if (book == null)
            throw new NotFoundException($"Book with ID {id} not found.");

        return _mapper.Map<BookDto>(book);
    }

    public async Task<BookDto> CreateAsync(CreateBookDto dto)
    {
        var author = await _authorRepository.GetByIdAsync(dto.AuthorId);
        if (author == null)
            throw new BadRequestException($"Author with ID {dto.AuthorId} does not exist.");

        var book = _mapper.Map<Book>(dto);
        book.Author = author;

        await _bookRepository.AddAsync(book);
        await _bookRepository.SaveChangesAsync();
        return _mapper.Map<BookDto>(book);
    }
        

    public async Task<BookDto> UpdateAsync(int id, UpdateBookDto dto)
    {
        var existing = await _bookRepository.GetByIdAsync(id);
        if (existing == null)
            throw new NotFoundException($"Book with ID {id} not found.");

        var author = await _authorRepository.GetByIdAsync(dto.AuthorId);
        if (author == null)
            throw new BadRequestException($"Author with ID {dto.AuthorId} does not exist.");

        _mapper.Map(dto, existing);
        existing.Author = author;

        _bookRepository.Update(existing);
        await _bookRepository.SaveChangesAsync();
        return _mapper.Map<BookDto>(existing);
    }

   
    public async Task<bool> DeleteAsync(int id)
    {
        var book = await _bookRepository.GetByIdAsync(id);
        if (book == null)
            throw new NotFoundException($"Book with ID {id} not found.");
        
        //  check if book has any active borrow records
        var borrowed = await _borrowRepository.AnyAsync(b => b.BookId == id && b.ReturnDate == null);
        if (borrowed)
            throw new BadRequestException("Cannot delete a book that is currently borrowed.");

        book.IsActive = false; 

        _bookRepository.Update(book);
        await _bookRepository.SaveChangesAsync();

        return true;
    }

}