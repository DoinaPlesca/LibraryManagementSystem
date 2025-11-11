using FluentValidation;
using Library.Core.Dtos.Borrow;

namespace Library.Core.Validation;

public class CreateBorrowDtoValidator : AbstractValidator<CreateBorrowDto>
{
    public CreateBorrowDtoValidator()
    {
        RuleFor(x => x.UserName)
            .NotEmpty().WithMessage("UserName is required.")
            .MaximumLength(50);

        RuleFor(x => x.BookId)
            .GreaterThan(0).WithMessage("BookId must be a valid number.");
    }
}