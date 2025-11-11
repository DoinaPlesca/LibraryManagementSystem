namespace Library.Core.Dtos.Borrow;

public class BorrowRecordDto
{
    public int Id { get; set; }
    public string UserName { get; set; } = "";
    public int BookId { get; set; }
    public string BookTitle { get; set; } = "";
    public DateTime BorrowDate { get; set; }
    public DateTime? ReturnDate { get; set; }
}