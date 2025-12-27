using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using AutoMapper;
using Library.Core.Dtos.Borrow;
using Library.Core.Entities;
using Library.Core.Exceptions;
using Library.Core.Interfaces;
using Library.Core.Services;
using Moq;
using Xunit;

namespace Library.Core.UnitTests.Services;

public class BorrowServiceTests
{
    private readonly Mock<IRepository<Book>> bookRepo = new();
    private readonly Mock<IRepository<BorrowRecord>> borrowRepo = new();
    private readonly Mock<IMapper> mapper = new();
    private readonly BorrowService sut;

    public BorrowServiceTests()
    {
        // mapper is not the point of unit tests -> return dummy DTOs
        mapper.Setup(m => m.Map<BorrowRecordDto>(It.IsAny<object>()))
              .Returns(new BorrowRecordDto());

        mapper.Setup(m => m.Map<IEnumerable<BorrowRecordDto>>(It.IsAny<object>()))
              .Returns(Array.Empty<BorrowRecordDto>());

        sut = new BorrowService(bookRepo.Object, borrowRepo.Object, mapper.Object);
    }

    [Fact]
    public async Task BorrowBookAsync_ThrowsNotFound_WhenBookDoesNotExist()
    {
        bookRepo.Setup(r => r.GetByIdAsync(10)).ReturnsAsync((Book?)null);

        Task act() => sut.BorrowBookAsync("user", 10);

        await Assert.ThrowsAsync<NotFoundException>(act);
    }

    [Fact]
    public async Task BorrowBookAsync_ThrowsBadRequest_WhenNoCopiesAvailable()
    {
        bookRepo.Setup(r => r.GetByIdAsync(5))
                .ReturnsAsync(new Book { Id = 5, Title = "T", AvailableCopies = 0, IsActive = true });

        Task act() => sut.BorrowBookAsync("user", 5);

        await Assert.ThrowsAsync<BadRequestException>(act);
    }

    [Fact]
    public async Task BorrowBookAsync_DecrementsCopies_AndCreatesBorrowRecord()
    {
        var book = new Book { Id = 5, Title = "T", AvailableCopies = 2, IsActive = true };
        bookRepo.Setup(r => r.GetByIdAsync(5)).ReturnsAsync(book);

        BorrowRecord? capturedBorrow = null;
        borrowRepo.Setup(r => r.AddAsync(It.IsAny<BorrowRecord>()))
                  .Callback<BorrowRecord>(br => capturedBorrow = br)
                  .Returns(Task.CompletedTask);

        await sut.BorrowBookAsync("user", 5);

        // strong assertions
        Assert.Equal(1, book.AvailableCopies);
        Assert.NotNull(capturedBorrow);
        Assert.Equal(5, capturedBorrow!.BookId);
        Assert.Equal("user", capturedBorrow.UserName);
        Assert.Null(capturedBorrow.ReturnDate);

        // minimal interaction checks
        bookRepo.Verify(r => r.Update(book), Times.Once);
        bookRepo.Verify(r => r.SaveChangesAsync(), Times.Once);
        borrowRepo.Verify(r => r.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task ReturnBookAsync_ThrowsNotFound_WhenBorrowRecordDoesNotExist()
    {
        borrowRepo.Setup(r => r.GetByIdAsync(99)).ReturnsAsync((BorrowRecord?)null);

        Task act() => sut.ReturnBookAsync(99);

        await Assert.ThrowsAsync<NotFoundException>(act);
    }

    [Fact]
    public async Task ReturnBookAsync_ThrowsBadRequest_WhenAlreadyReturned()
    {
        borrowRepo.Setup(r => r.GetByIdAsync(1))
                  .ReturnsAsync(new BorrowRecord
                  {
                      Id = 1,
                      BookId = 5,
                      UserName = "user",
                      BorrowDate = DateTime.UtcNow.AddDays(-2),
                      ReturnDate = DateTime.UtcNow.AddDays(-1)
                  });

        Task act() => sut.ReturnBookAsync(1);

        await Assert.ThrowsAsync<BadRequestException>(act);
    }

    [Fact]
    public async Task ReturnBookAsync_IncrementsCopies_AndSetsReturnDate()
    {
        var borrow = new BorrowRecord
        {
            Id = 1,
            BookId = 5,
            UserName = "user",
            BorrowDate = DateTime.UtcNow.AddDays(-2),
            ReturnDate = null
        };
        var book = new Book { Id = 5, Title = "T", AvailableCopies = 1, IsActive = true };

        borrowRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(borrow);
        bookRepo.Setup(r => r.GetByIdAsync(5)).ReturnsAsync(book);

        await sut.ReturnBookAsync(1);

        Assert.NotNull(borrow.ReturnDate);
        Assert.Equal(2, book.AvailableCopies);

        borrowRepo.Verify(r => r.Update(borrow), Times.Once);
        bookRepo.Verify(r => r.Update(book), Times.Once);
        borrowRepo.Verify(r => r.SaveChangesAsync(), Times.Once);
        bookRepo.Verify(r => r.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task GetBorrowsByUserAsync_ThrowsBadRequest_WhenUsernameMissing()
    {
        Task act() => sut.GetBorrowsByUserAsync("  ");
        await Assert.ThrowsAsync<BadRequestException>(act);
    }

    [Fact]
    public async Task GetBorrowsByUserAsync_ThrowsNotFound_WhenNoRecordsForUser()
    {
        borrowRepo.Setup(r => r.GetAllWithBooksAsync())
                  .ReturnsAsync(new List<BorrowRecord>());

        Task act() => sut.GetBorrowsByUserAsync("anna");

        await Assert.ThrowsAsync<NotFoundException>(act);
    }

    [Fact]
    public async Task GetBorrowsByUserAsync_FiltersCaseInsensitive_AndOrdersByBorrowDateDesc()
    {
        var b1 = new BorrowRecord { Id = 1, UserName = "Anna", BorrowDate = new DateTime(2025, 1, 1) };
        var b2 = new BorrowRecord { Id = 2, UserName = "anna", BorrowDate = new DateTime(2025, 2, 1) };
        var b3 = new BorrowRecord { Id = 3, UserName = "Bob", BorrowDate = new DateTime(2025, 3, 1) };

        borrowRepo.Setup(r => r.GetAllWithBooksAsync()).ReturnsAsync(new[] { b1, b2, b3 });

        // Capture what the service sends to mapper AFTER filtering+ordering.
        IEnumerable<BorrowRecord>? captured = null;
        mapper.Setup(m => m.Map<IEnumerable<BorrowRecordDto>>(It.IsAny<object>()))
              .Callback<object>(src => captured = (IEnumerable<BorrowRecord>)src)
              .Returns(Array.Empty<BorrowRecordDto>());

        await sut.GetBorrowsByUserAsync("ANNA");

        Assert.NotNull(captured);
        Assert.Equal(new[] { 2, 1 }, captured!.Select(x => x.Id)); // ordered desc for that user only
    }

   
    
}
