namespace WebAPIv2.Model
{
    public class FlightModel
    {
        public string Flight { get; set; } = string.Empty;
        public string Pilot { get; set; }
        public int? AirportId { get; set; }
        public int? PlaneId { get; set; }
    }
}
