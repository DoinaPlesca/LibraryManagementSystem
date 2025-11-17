using FluentValidation;
using Library.Core.Dtos.Book;

namespace Library.Core.Validation;

public class UpdateBookDtoValidator : AbstractValidator<UpdateBookDto>
{
    public UpdateBookDtoValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MinimumLength(2).WithMessage("Book title must be at least 2 characters long.")
            .MaximumLength(50).WithMessage("Book title cannot exceed 100 characters.");


        RuleFor(x => x.Genre)
            .NotEmpty().WithMessage("Genre is required.")
            .MaximumLength(50).WithMessage("Genre cannot exceed 50 characters.")
            .Matches(@"^[A-Za-z\s\-']+$").WithMessage("Genre can only contain letters, spaces, and hyphens.");


        RuleFor(x => x.AuthorId)
            .GreaterThan(0).WithMessage("AuthorId must be a positive number.");

        RuleFor(x => x.AvailableCopies)
            .GreaterThanOrEqualTo(0).WithMessage("Available copies cannot be negative.")
            .LessThanOrEqualTo(100).WithMessage("Available copies cannot exceed 500.");
    }
}