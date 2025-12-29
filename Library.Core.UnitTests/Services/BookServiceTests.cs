using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using AutoMapper;
using Library.Core.Dtos.Book;
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
    // GetAllAsync Test
    [Fact]
    public async Task GetAllAsync_CallsRepoAndMaps()
    {
        var books = new List<Book> { new Book { Id = 2, Title = "Apple" } };
        bookRepo.Setup(r => r.GetAllWithAuthorsAsync()).ReturnsAsync(books);

        mapper.Setup(m => m.Map<IEnumerable<BookDto>>(It.IsAny<object>()))
              .Returns(new[] { new BookDto { Id = 2, Title = "Apple" } });

        var result = await sut.GetAllAsync();

        Assert.Single(result);
        Assert.Equal(2, result.First().Id);
        Assert.Equal("Apple", result.First().Title);

        bookRepo.Verify(r => r.GetAllWithAuthorsAsync(), Times.Once);
    }
    // GetByIdAsync Tests 1
    [Fact]
    public async Task GetByIdAsync_ThrowsNotFound_WhenMissing()
    {
        bookRepo.Setup(r => r.GetByIdWithAuthorAsync(1)).ReturnsAsync((Book?)null);

        Task act() => sut.GetByIdAsync(1);

        await Assert.ThrowsAsync<NotFoundException>(act);
    }
    // GetByIdAsync Tests 2
    [Fact]
    public async Task GetByIdAsync_ReturnsMappedDto_WhenFound()
    {
        var book = new Book { Id = 1, Title = "Apple Tree" };
        bookRepo.Setup(r => r.GetByIdWithAuthorAsync(1)).ReturnsAsync(book);

        mapper.Setup(m => m.Map<BookDto>(It.IsAny<object>()))
              .Returns(new BookDto { Id = 1, Title = "Apple Tree" });

        var dto = await sut.GetByIdAsync(1);

        Assert.Equal(1, dto.Id);
        Assert.Equal("Apple Tree", dto.Title);
    }
    // CreateAsync Tests 1
    [Fact]
    public async Task CreateAsync_ThrowsBadRequest_WhenAuthorMissing()
    {
        var dto = new CreateBookDto { Title = "T", Genre = "G", AuthorId = 10, AvailableCopies = 2 };
        authorRepo.Setup(r => r.GetByIdAsync(10)).ReturnsAsync((Author?)null);

        Task act() => sut.CreateAsync(dto);

        await Assert.ThrowsAsync<BadRequestException>(act);
    }
    // CreateAsync Tests 2
    [Fact]
    public async Task CreateAsync_Success_AddsBook_SetsAuthor_Saves()
    {
        var author = new Author { Id = 10, Name = "Auth" };
        authorRepo.Setup(r => r.GetByIdAsync(10)).ReturnsAsync(author);

        var dto = new CreateBookDto { Title = "T", Genre = "G", AuthorId = 10, AvailableCopies = 2 };

        // Mapper creates entity from DTO
        mapper.Setup(m => m.Map<Book>(It.IsAny<object>()))
              .Returns(new Book { Title = dto.Title, Genre = dto.Genre, AuthorId = dto.AuthorId, AvailableCopies = dto.AvailableCopies });

        Book? captured = null;
        bookRepo.Setup(r => r.AddAsync(It.IsAny<Book>()))
                .Callback<Book>(b => captured = b)
                .Returns(Task.CompletedTask);

        mapper.Setup(m => m.Map<BookDto>(It.IsAny<object>()))
              .Returns(new BookDto { Title = "T" });

        await sut.CreateAsync(dto);

        Assert.NotNull(captured);
        Assert.Equal("T", captured!.Title);
        Assert.Equal(author, captured.Author); // service sets Author reference

        bookRepo.Verify(r => r.AddAsync(It.IsAny<Book>()), Times.Once);
        bookRepo.Verify(r => r.SaveChangesAsync(), Times.Once);
    }
    // UpdateAsync Tests 1
    [Fact]
    public async Task UpdateAsync_ThrowsNotFound_WhenBookMissing()
    {
        bookRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync((Book?)null);

        Task act() => sut.UpdateAsync(1, new UpdateBookDto());

        await Assert.ThrowsAsync<NotFoundException>(act);
    }
    // UpdateAsync Tests 2
    [Fact]
    public async Task UpdateAsync_ThrowsBadRequest_WhenAuthorMissing()
    {
        var existing = new Book { Id = 1, Title = "Old", AuthorId = 1 };
        bookRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(existing);

        authorRepo.Setup(r => r.GetByIdAsync(99)).ReturnsAsync((Author?)null);

        var dto = new UpdateBookDto { Title = "New", Genre = "Horror", AuthorId = 99, AvailableCopies = 5 };

        Task act() => sut.UpdateAsync(1, dto);

        await Assert.ThrowsAsync<BadRequestException>(act);
    }
    // UpdateAsync Tests 3
    [Fact]
    public async Task UpdateAsync_Success_UpdatesEntity_SetsAuthor_Saves()
    {
        var existing = new Book { Id = 1, Title = "Old", Genre = "Horror", AuthorId = 10, AvailableCopies = 1 };
        bookRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(existing);

        var author = new Author { Id = 20, Name = "NewAuthor" };
        authorRepo.Setup(r => r.GetByIdAsync(20)).ReturnsAsync(author);

        var dto = new UpdateBookDto { Title = "New", Genre = "Comedy", AuthorId = 20, AvailableCopies = 7 };

        // Simulate AutoMapper "Map(dto, existing)" by updating properties
        mapper.Setup(m => m.Map(It.IsAny<UpdateBookDto>(), It.IsAny<Book>()))
              .Returns((UpdateBookDto src, Book dest) =>
              {
                  dest.Title = src.Title;
                  dest.Genre = src.Genre;
                  dest.AuthorId = src.AuthorId;
                  dest.AvailableCopies = src.AvailableCopies;
                  return dest;
              });

        mapper.Setup(m => m.Map<BookDto>(It.IsAny<object>()))
              .Returns(new BookDto { Title = "New" });

        await sut.UpdateAsync(1, dto);

        Assert.Equal("New", existing.Title);
        Assert.Equal("Comedy", existing.Genre);
        Assert.Equal(7, existing.AvailableCopies);
        Assert.Equal(author, existing.Author); // service sets Author reference

        bookRepo.Verify(r => r.Update(existing), Times.Once);
        bookRepo.Verify(r => r.SaveChangesAsync(), Times.Once);
    }
    // DeleteAsync Tests 1
    [Fact]
    public async Task DeleteAsync_ThrowsNotFound_WhenBookMissing()
    {
        bookRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync((Book?)null);

        Task act() => sut.DeleteAsync(1);

        await Assert.ThrowsAsync<NotFoundException>(act);
    }
    // DeleteAsync Tests 2
    [Fact]
    public async Task DeleteAsync_ThrowsBadRequest_WhenBookHasActiveBorrow()
    {
        var book = new Book { Id = 1, IsActive = true };
        bookRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(book);

        borrowRepo.Setup(r => r.AnyAsync(It.IsAny<Expression<Func<BorrowRecord, bool>>>()))
                 .ReturnsAsync(true);

        Task act() => sut.DeleteAsync(1);

        await Assert.ThrowsAsync<BadRequestException>(act);
        bookRepo.Verify(r => r.SaveChangesAsync(), Times.Never);
    }
    // DeleteAsync Tests 3
    [Fact]
    public async Task DeleteAsync_Success_SetsIsActiveFalse_Saves()
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
