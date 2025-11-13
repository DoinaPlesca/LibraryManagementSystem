using System.Linq.Expressions;
using Library.Core.Entities;

namespace Library.Core.Interfaces;

public interface IRepository<T> where T : class
{
    Task<IEnumerable<T>> GetAllAsync();
    Task<T?> GetByIdAsync(int id);
    Task AddAsync(T entity);
    void Update(T entity);
    void Delete(T entity);
    Task SaveChangesAsync();
    Task<bool> AnyAsync(Expression<Func<T, bool>> predicate);
    Task<Book?> GetByIdWithAuthorAsync(int id);
    Task<IEnumerable<Book>> GetAllWithAuthorsAsync();
    
}