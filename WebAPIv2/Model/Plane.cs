using System.ComponentModel.DataAnnotations;

namespace WebAPIv2.Model
{
    public class Plane
    {
        [Required]
        [MinLength(5, ErrorMessage = "Name must be atleast 5 characters")]
        [MaxLength(10, ErrorMessage = "Name cannot be over 10 characters")]
        public string Code { get; set; } = string.Empty;

        [Required]
        [MinLength(5, ErrorMessage = "Name must be atleast 5 characters")]
        [MaxLength(50, ErrorMessage = "Name cannot be over 50 characters")]
        public string Airline { get; set; } = string.Empty;

        [Required]
        [MinLength(5, ErrorMessage = "Name must be atleast 5 characters")]
        [MaxLength(50, ErrorMessage = "Name cannot be over 50 characters")]
        public string Model { get; set; } = string.Empty;
    }
}
