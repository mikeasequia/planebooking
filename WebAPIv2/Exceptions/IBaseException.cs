namespace WebAPIv2.Exceptions
{
    public interface IBaseException
    {
        int ErrorStatusCode { get; set; }
        string ErrorCode { get; set; }
        string ErrorDescription { get; set; }
    }
}
