using Library.Core.Entities;
using Library.Infrastructure.Data;
using Library.Infrastructure.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Library.Infrastructure.Seed;

public class DbInitializer : IDbInitializer
{
    private readonly LibraryContext _context;

    public DbInitializer(LibraryContext context)
    {
        _context = context;
    }

    public async Task InitializeAsync()
    {
        await _context.Database.MigrateAsync();
        
        if (await _context.Authors.AnyAsync())
            return;

        var authors = new List<Author>
        {
            new Author { Name = "George Orwell", Nationality = "British" },
            new Author { Name = "J.K. Rowling", Nationality = "British" }
        };

        await _context.Authors.AddRangeAsync(authors);
        await _context.SaveChangesAsync();

        var books = new List<Book>
        {
            new Book { Title = "1984", Genre = "Dystopian", AuthorId = authors[0].Id, AvailableCopies = 3 },
            new Book { Title = "Harry Potter", Genre = "Fantasy", AuthorId = authors[1].Id, AvailableCopies = 5 }
        };

        await _context.Books.AddRangeAsync(books);
        await _context.SaveChangesAsync();
    }
}