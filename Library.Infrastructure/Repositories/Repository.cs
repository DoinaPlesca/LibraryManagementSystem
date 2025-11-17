using System.Linq.Expressions;
using Library.Core.Entities;
using Library.Core.Interfaces;
using Library.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Library.Infrastructure.Repositories;

public class Repository<T> : IRepository<T> where T : class
{
    private readonly LibraryContext _context;
    private readonly DbSet<T> _dbSet;

    public Repository(LibraryContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    public async Task<IEnumerable<T>> GetAllAsync() => await _dbSet.ToListAsync();
    public async Task<T?> GetByIdAsync(int id) => await _dbSet.FindAsync(id);
    public async Task AddAsync(T entity) => await _dbSet.AddAsync(entity);
    public void Update(T entity) => _dbSet.Update(entity);
    public void Delete(T entity) => _dbSet.Remove(entity);
    public async Task SaveChangesAsync() => await _context.SaveChangesAsync();
    
    public async Task<bool> AnyAsync(Expression<Func<T, bool>> predicate)
    {
        return await _dbSet.AnyAsync(predicate);
    }
    
    public async Task<Book?> GetByIdWithAuthorAsync(int id)
    {
        return await _context.Books
            .Include(b => b.Author)
            .FirstOrDefaultAsync(b => b.Id == id);
    }
    public async Task<IEnumerable<Book>> GetAllWithAuthorsAsync()
    {
        return await _context.Books
            .Include(b => b.Author)
            .Where(b => b.IsActive)
            .ToListAsync();
    }
    
    public async Task<IEnumerable<BorrowRecord>> GetAllWithBooksAsync()
    {
        return await _context.BorrowRecords
            .Include(b => b.Book)
            .AsNoTracking()
            .ToListAsync();
    }

}