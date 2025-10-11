using WebAPIv2.DataModel;
using WebAPIv2.Helpers;
using WebAPIv2.Model;

namespace WebAPIv2.Interfaces
{
    public interface IPlaneRepository
    {
        Task<List<PlaneDataModel>> GetAllAsync();
        Task<PaginatedResult<PlaneDataModel>> GetAllByPagingAsync(QueryObject query);
        Task<PlaneDataModel> AddAsync(Plane plane);
        Task<PlaneDataModel> UpdateAsync(int id, Plane plane);
        Task<bool> DeleteAsync(int id);
    }
}
