using System.Text.Json.Serialization;

namespace WebAPIv2.DataModel
{
    public class PassengerBookingDataModel
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        [JsonIgnore]
        public int? FlightId { get; set; }

        //for navigation
        public FlightDataModel Flight { get; set; }
    }
}
