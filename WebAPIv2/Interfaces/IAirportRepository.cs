using WebAPIv2.DataModel;
using WebAPIv2.Helpers;
using WebAPIv2.Model;

namespace WebAPIv2.Interfaces
{
    public interface IAirportRepository
    {
        Task<List<AirportDataModel>> GetAllAsync();
        Task<PaginatedResult<AirportDataModel>> GetAllByPagingAsync(QueryObject query);
        Task<AirportDataModel> AddAsync(Airport airport);
        Task<AirportDataModel> UpdateAsync(int id, Airport airport);
        Task<bool> DeleteAsync(int id);
    }
}
