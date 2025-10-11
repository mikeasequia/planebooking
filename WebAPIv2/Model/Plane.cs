using System.ComponentModel.DataAnnotations;

namespace WebAPIv2.Model
{
    public class Plane
    {
        [Required]
        [MinLength(5, ErrorMessage = "Code must be atleast 5 characters")]
        [MaxLength(10, ErrorMessage = "Code cannot be over 10 characters")]
        public string Code { get; set; } = string.Empty;

        [Required]
        [MinLength(5, ErrorMessage = "Airline must be atleast 5 characters")]
        [MaxLength(50, ErrorMessage = "Airline cannot be over 50 characters")]
        public string Airline { get; set; } = string.Empty;

        [Required]
        [MinLength(5, ErrorMessage = "Model must be atleast 5 characters")]
        [MaxLength(50, ErrorMessage = "Model cannot be over 50 characters")]
        public string Model { get; set; } = string.Empty;
    }
}
