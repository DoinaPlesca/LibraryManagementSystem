using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Library.Core.Dtos.Author;
using Library.Core.Entities;
using Library.Core.Interfaces;
using Library.Core.Services;
using Moq;
using Xunit;

namespace Library.Core.UnitTests.Services;

public class AuthorServiceTests
{
    private readonly Mock<IRepository<Author>> repo = new();
    private readonly Mock<IMapper> mapper = new();
    private readonly AuthorService sut;

    public AuthorServiceTests()
    {
        sut = new AuthorService(repo.Object, mapper.Object);
    }

    [Fact]
    public async Task GetAllAsync_CallsRepoAndMaps()
    {
        repo.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<Author> { new Author { Id = 1, Name = "Alfred" } });

        mapper.Setup(m => m.Map<IEnumerable<AuthorDto>>(It.IsAny<object>()))
              .Returns(new[] { new AuthorDto { Id = 1, Name = "Alfred" } });

        var result = await sut.GetAllAsync();

        Assert.NotNull(result);
        repo.Verify(r => r.GetAllAsync(), Times.Once);
    }

    [Fact]
    public async Task CreateAsync_AddsAuthor_Saves_AndReturnsDto()
    {
        var dto = new CreateAuthorDto { Name = "N", Nationality = "X" };

        mapper.Setup(m => m.Map<Author>(It.IsAny<object>()))
              .Returns(new Author { Name = "N", Nationality = "X" });

        mapper.Setup(m => m.Map<AuthorDto>(It.IsAny<object>()))
              .Returns(new AuthorDto { Name = "N", Nationality = "X" });

        var result = await sut.CreateAsync(dto);

        Assert.Equal("N", result.Name);

        repo.Verify(r => r.AddAsync(It.IsAny<Author>()), Times.Once);
        repo.Verify(r => r.SaveChangesAsync(), Times.Once);
    }
}
