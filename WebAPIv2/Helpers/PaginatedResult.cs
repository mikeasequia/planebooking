namespace WebAPIv2.Helpers
{
    public class PaginatedResult<T>
    {
        public List<T> Items { get; set; }
        public int TotalItems { get; set; }
    }
}
