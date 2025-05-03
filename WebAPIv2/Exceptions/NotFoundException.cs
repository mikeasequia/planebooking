namespace WebAPIv2.Exceptions
{
    public class NotFoundException : Exception, IBaseException
    {
        public int ErrorStatusCode { get; set; } = 404;
        public string ErrorCode { get; set; } = "NotFound";
        public string ErrorDescription { get; set; } = string.Empty;
    }
}
