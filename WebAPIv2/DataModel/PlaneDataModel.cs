using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace WebAPIv2.DataModel
{
    public class PlaneDataModel
    {
        public int Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public string Airline { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;

        //for navigation
        [JsonIgnore]
        public List<FlightDataModel> Flights { get; set; }
    }
}
