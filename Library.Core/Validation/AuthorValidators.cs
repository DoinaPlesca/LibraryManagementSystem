using FluentValidation;
using Library.Core.Dtos.Author;

namespace Library.Core.Validation;

public class CreateAuthorDtoValidator : AbstractValidator<CreateAuthorDto>
{
    public CreateAuthorDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Author name is required.")
            .MaximumLength(100);

        RuleFor(x => x.Nationality)
            .NotEmpty().WithMessage("Nationality is required.")
            .MaximumLength(50);
    }
}