using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using WebAPIv2.Model;

namespace WebAPIv2.DataModel
{
    public class FlightDataModel
    {
        public int Id { get; set; }
        public string Flight { get; set; } = string.Empty;
        [JsonIgnore]
        public int? AirportId { get; set; }
        [JsonIgnore]
        public int? PlaneId { get; set; }

        public string Pilot { get; set; } = string.Empty;

        //for navigation
        public AirportDataModel Airport { get; set; }
        public PlaneDataModel Plane { get; set; }
        [JsonIgnore]
        public List<PassengerBookingDataModel> PassengerBookings { get; set; }
    }
}
