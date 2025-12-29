using AutoMapper;
using Library.Core.Dtos.Borrow;
using Library.Core.Entities;
using Library.Core.Exceptions;
using Library.Core.Interfaces;

namespace Library.Core.Services;

public class BorrowService : IBorrowService
{
    private readonly IRepository<Book> _bookRepository;
    private readonly IRepository<BorrowRecord> _borrowRepository;
    private readonly IMapper _mapper;
    public BorrowService(IRepository<Book> bookRepository, IRepository<BorrowRecord> borrowRepository, IMapper mapper)
    {
        _bookRepository = bookRepository;
        _borrowRepository = borrowRepository;
        _mapper = mapper;
    }

   
    public async Task<BorrowRecordDto> BorrowBookAsync(string userName, int bookId)
    {
        // check if book exists
        var book = await _bookRepository.GetByIdAsync(bookId);
        if (book == null)
            throw new NotFoundException($"Book with ID {bookId} not found.");

        // check available copies
        if (book.AvailableCopies <= 0)
            throw new BadRequestException($"No available copies of '{book.Title}' to borrow.");

        // create a new borrow record
        var borrowRecord = new BorrowRecord
        {
            BookId = book.Id,
            UserName = userName,
            BorrowDate = DateTime.UtcNow,
            ReturnDate = null
        };

        // update available copies
        book.AvailableCopies--;
        
        await _borrowRepository.AddAsync(borrowRecord);
        _bookRepository.Update(book);

        await _bookRepository.SaveChangesAsync();
        await _borrowRepository.SaveChangesAsync();

        borrowRecord.Book = book;
        return _mapper.Map<BorrowRecordDto>(borrowRecord);
    }



    public async Task<BorrowRecordDto> ReturnBookAsync(int borrowId)
    {
        // find the borrow record
        var borrowRecord = await _borrowRepository.GetByIdAsync(borrowId);
        if (borrowRecord == null)
            throw new NotFoundException($"Borrow record with ID {borrowId} not found.");

        // check if already returned (ReturnDate not null)
        if (borrowRecord.ReturnDate != null)
            throw new BadRequestException($"Borrow record {borrowId} has already been returned.");

        // find the book
        var book = await _bookRepository.GetByIdAsync(borrowRecord.BookId);
        if (book == null)
            throw new NotFoundException($"Book with ID {borrowRecord.BookId} not found.");

        // update  record + book
        borrowRecord.ReturnDate = DateTime.UtcNow;
        book.AvailableCopies++;

        _borrowRepository.Update(borrowRecord);
        _bookRepository.Update(book);

        await _borrowRepository.SaveChangesAsync();
        await _bookRepository.SaveChangesAsync();

        borrowRecord.Book = book;
        return _mapper.Map<BorrowRecordDto>(borrowRecord);
    }
    
    public async Task<IEnumerable<BorrowRecordDto>> GetBorrowsByUserAsync(string userName)
    {
        if (string.IsNullOrWhiteSpace(userName))
            throw new BadRequestException("Username must be provided.");

        var allBorrows = await _borrowRepository.GetAllWithBooksAsync();
        var userBorrows = allBorrows
            .Where(b => b.UserName.ToLower() == userName.ToLower())
            .OrderByDescending(b => b.BorrowDate)
            .ToList();

        if (!userBorrows.Any())
            throw new NotFoundException($"No borrow records found for user '{userName}'.");

        return _mapper.Map<IEnumerable<BorrowRecordDto>>(userBorrows);
    }
    
}
 