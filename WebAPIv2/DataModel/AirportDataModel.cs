using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using WebAPIv2.DataModel;

namespace WebAPIv2.DataModel
{
    public class AirportDataModel
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;

        //for navigation
        [JsonIgnore]
        public List<FlightDataModel> Flights { get; set; }
    }
}
