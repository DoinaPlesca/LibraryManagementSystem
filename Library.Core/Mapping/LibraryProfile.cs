using AutoMapper;
using Library.Core.Dtos.Author;
using Library.Core.Entities;
using Library.Core.Dtos.Book;
using Library.Core.Dtos.Borrow;

namespace Library.Core.Mapping;

public class LibraryProfile : Profile
{
    public LibraryProfile()
    {
        CreateMap<Book, BookDto>()
            .ForMember(dest => dest.AuthorName, opt => opt.MapFrom(src => src.Author.Name))
            .ReverseMap();

        CreateMap<CreateBookDto, Book>();
        CreateMap<UpdateBookDto, Book>();

        CreateMap<Author, AuthorDto>().ReverseMap();
        CreateMap<CreateAuthorDto, Author>();
        
        CreateMap<BorrowRecord, BorrowRecordDto>()
            .ForMember(dest => dest.BookTitle, opt => opt.MapFrom(src => src.Book.Title))
            .ReverseMap();
        CreateMap<CreateBorrowDto, BorrowRecord>();
    }
}