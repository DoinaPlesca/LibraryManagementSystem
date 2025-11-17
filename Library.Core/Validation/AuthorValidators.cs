using FluentValidation;
using Library.Core.Dtos.Author;

namespace Library.Core.Validation;

public class CreateAuthorDtoValidator : AbstractValidator<CreateAuthorDto>
{
    public CreateAuthorDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Author name is required.")
            .MinimumLength(3).WithMessage("Author name must be at least 3 characters long.")
            .MaximumLength(50).WithMessage("Author name cannot exceed 100 characters.")
            .Matches(@"^[A-Za-z\s\-']+$").WithMessage("Author name can only contain letters, spaces, and apostrophes.");

        RuleFor(x => x.Nationality)
            .NotEmpty().WithMessage("Nationality is required.")
            .MaximumLength(50).WithMessage("Nationality cannot exceed 50 characters.")
            .Matches(@"^[A-Za-z\s]+$").WithMessage("Nationality must only contain letters and spaces.");
    }
}