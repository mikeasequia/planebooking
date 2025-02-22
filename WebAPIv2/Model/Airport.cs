using System.ComponentModel.DataAnnotations;

namespace WebAPIv2.Model
{
    public class Airport
    {
        [Required]
        [MinLength(3, ErrorMessage = "Name must be atleast 3 characters")]
        [MaxLength(250, ErrorMessage = "Name cannot be over 250 characters")]
        public string Name { get; set; } = string.Empty;
        [Required]
        [MinLength(3, ErrorMessage = "Address must be atleast 3 characters")]
        [MaxLength(250, ErrorMessage = "Address cannot be over 250 characters")]
        public string Address { get; set; } = string.Empty;
    }
}
