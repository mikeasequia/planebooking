using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPIv2.DataModel;
using WebAPIv2.DBContext;
using WebAPIv2.Helpers;
using WebAPIv2.Interfaces;

namespace WebAPIv2.Repository
{
    public class PlaneRepository : ControllerBase, IPlaneRepository
    {
        private readonly DatabaseContext _dbContext;
        public PlaneRepository(DatabaseContext dbContext) {
            _dbContext = dbContext;
        }

        public async Task<List<PlaneDataModel>> GetAllAsync()
        {
            return await _dbContext.Planes.ToListAsync();
        }

        public async Task<PaginatedResult<PlaneDataModel>> GetAllByPagingAsync(QueryObject query)
        {
            var model = _dbContext.Planes.AsQueryable();

            //searching
            if (!string.IsNullOrWhiteSpace(query.search))
            {
                model = model.Where(m => m.Code.Contains(query.search, StringComparison.OrdinalIgnoreCase) ||
                                         m.Airline.Contains(query.search, StringComparison.OrdinalIgnoreCase) ||
                                         m.Model.Contains(query.search, StringComparison.OrdinalIgnoreCase));
            }

            //sorting
            if (!string.IsNullOrWhiteSpace(query.column))
            {
                if (Convert.ToInt16(query.column) == 0) //Code
                {
                    model = query.isDesc ? model.OrderByDescending(s => s.Code) : model.OrderBy(s => s.Code);
                }
                else if (Convert.ToInt16(query.column) == 1) //Airline
                {
                    model = query.isDesc ? model.OrderByDescending(s => s.Airline) : model.OrderBy(s => s.Airline);
                }
                else if (Convert.ToInt16(query.column) == 1) //Model
                {
                    model = query.isDesc ? model.OrderByDescending(s => s.Model) : model.OrderBy(s => s.Model);
                }
            }

            //pagination
            var skip = (query.pageNumber - 1) * query.pageSize;

            //check if pageNumber and pageSize are valid
            if (query.pageNumber < 1 || query.pageSize < 1)
            {
                throw new Exception("Page number and page size must be greater than 0");
            }

            var items = await model.Skip(skip).Take(query.pageSize).ToListAsync();

            //calculate total rows for the entire table (without filtering)
            int totalRows = await _dbContext.Airports.CountAsync();


            return new PaginatedResult<PlaneDataModel>
            {
                Items = items,
                TotalItems = totalRows
            };
        }
    }
}
