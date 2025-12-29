using Library.Core.Dtos.Author;
using Library.Core.Validation;
using Xunit;

namespace Library.Core.UnitTests.Validation;

public class CreateAuthorDtoValidatorTests
{
    private readonly CreateAuthorDtoValidator validator = new();

    [Fact]
    public void Validate_ValidDto_IsValid()
    {
        var dto = new CreateAuthorDto
        {
            Name = "Scot MCcall",
            Nationality = "Danish"
        };

        var result = validator.Validate(dto);

        Assert.True(result.IsValid);
    }

    [Fact]
    public void Validate_EmptyName_IsInvalid_AndHasErrorForName()
    {
        var dto = new CreateAuthorDto
        {
            Name = "",
            Nationality = "Danish"
        };

        var result = validator.Validate(dto);

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "Name");
    }
    [Fact]
    public void Validate_NationalityWithDigits_IsInvalid()
    {
        var dto = new CreateAuthorDto
        {
            Name = "Jane Doe",
            Nationality = "Denmark123"
        };

        var result = validator.Validate(dto);

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "Nationality");
    }

}
