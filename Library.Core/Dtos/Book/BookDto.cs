namespace Library.Core.Dtos.Book;

public class BookDto
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string Genre { get; set; } = "";
    public int AvailableCopies { get; set; }
    public string AuthorName { get; set; } = "";
}