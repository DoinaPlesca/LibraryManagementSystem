using FluentValidation;
using Library.Core.Dtos.Borrow;

namespace Library.Core.Validation;

public class CreateBorrowDtoValidator : AbstractValidator<CreateBorrowDto>
{
    public CreateBorrowDtoValidator()
    {
        RuleFor(x => x.UserName)
            .NotEmpty().WithMessage("UserName is required.")
            .MinimumLength(3).WithMessage("UserName must be at least 3 characters long.")
            .MaximumLength(50).WithMessage("UserName cannot exceed 50 characters.")
            .Matches(@"^[A-Za-z0-9_\-]+$").WithMessage("UserName can only contain letters, numbers, underscores, and hyphens.");


        RuleFor(x => x.BookId)
            .GreaterThan(0).WithMessage("BookId must be a valid number.");
    }
}