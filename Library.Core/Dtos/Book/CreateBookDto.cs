namespace Library.Core.Dtos.Book;

public class CreateBookDto
{
    public string Title { get; set; } = "";
    public string Genre { get; set; } = "";
    public int AuthorId { get; set; }
    public int AvailableCopies { get; set; }
}