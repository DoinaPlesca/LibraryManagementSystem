using System.Linq.Expressions;
using System.Threading.Tasks;
using AutoMapper;
using Library.Core.Entities;
using Library.Core.Exceptions;
using Library.Core.Interfaces;
using Library.Core.Services;
using Moq;
using Xunit;

namespace Library.Core.UnitTests.Services;

public class BookServiceTests
{
    private readonly Mock<IRepository<Book>> bookRepo = new();
    private readonly Mock<IRepository<Author>> authorRepo = new();
    private readonly Mock<IRepository<BorrowRecord>> borrowRepo = new();
    private readonly Mock<IMapper> mapper = new();
    private readonly BookService sut;

    public BookServiceTests()
    {
        sut = new BookService(bookRepo.Object, authorRepo.Object, mapper.Object, borrowRepo.Object);
    }

    [Fact]
    public async Task DeleteAsync_ThrowsNotFound_WhenBookDoesNotExist()
    {
        bookRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync((Book?)null);

        Task act() => sut.DeleteAsync(1);

        await Assert.ThrowsAsync<NotFoundException>(act);
    }

    [Fact]
    public async Task DeleteAsync_ThrowsBadRequest_WhenBookHasActiveBorrow()
    {
        bookRepo.Setup(r => r.GetByIdAsync(1))
                .ReturnsAsync(new Book { Id = 1, IsActive = true });

        borrowRepo.Setup(r => r.AnyAsync(It.IsAny<Expression<Func<BorrowRecord, bool>>>()))
                 .ReturnsAsync(true);

        Task act() => sut.DeleteAsync(1);

        await Assert.ThrowsAsync<BadRequestException>(act);
        bookRepo.Verify(r => r.SaveChangesAsync(), Times.Never);
    }

    [Fact]
    public async Task DeleteAsync_SetsIsActiveFalse_WhenNoActiveBorrow()
    {
        var book = new Book { Id = 1, IsActive = true };

        bookRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(book);
        borrowRepo.Setup(r => r.AnyAsync(It.IsAny<Expression<Func<BorrowRecord, bool>>>()))
                 .ReturnsAsync(false);

        var ok = await sut.DeleteAsync(1);

        Assert.True(ok);
        Assert.False(book.IsActive);

        bookRepo.Verify(r => r.Update(book), Times.Once);
        bookRepo.Verify(r => r.SaveChangesAsync(), Times.Once);
    }
}
