namespace Library.Core.Dtos.Book;

public class UpdateBookDto
{
    public string Title { get; set; } = "";
    public string Genre { get; set; } = "";
    public int AuthorId { get; set; }
    public int AvailableCopies { get; set; }
}