namespace Library.Core.Entities;

public class BorrowRecord
{
    public int Id { get; set; }
    public string UserName { get; set; } = "";
    public int BookId { get; set; }
    public Book? Book { get; set; }
    public DateTime BorrowDate { get; set; }
    public DateTime? ReturnDate { get; set; }
}