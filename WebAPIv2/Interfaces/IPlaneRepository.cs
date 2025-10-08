using WebAPIv2.DataModel;
using WebAPIv2.Helpers;
using WebAPIv2.Model;

namespace WebAPIv2.Interfaces
{
    public interface IPlaneRepository
    {
        Task<List<PlaneDataModel>> GetAllAsync();
    }
}
