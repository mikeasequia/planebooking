namespace WebAPIv2.Helpers
{
    public class QueryObject
    {
        public string? search { get; set; } = null;
        public string? column { get; set; } = null;
        public bool isDesc { get; set; } = false;
        public int pageNumber { get; set; } = 1;
        public int pageSize { get; set; } = 10;
    }
}
