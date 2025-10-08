using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPIv2.DataModel;
using WebAPIv2.DBContext;
using WebAPIv2.Exceptions;
using WebAPIv2.Helpers;
using WebAPIv2.Interfaces;
using WebAPIv2.Model;

namespace WebAPIv2.Repository
{
    public class AirportRepository : ControllerBase, IAirportRepository
    {
        private readonly DatabaseContext _dbContext;
        public AirportRepository(DatabaseContext dbContext) {
            _dbContext = dbContext;
        }

        public async Task<List<AirportDataModel>> GetAllAsync()
        {
            return await _dbContext.Airports.ToListAsync();
        }

        public async Task<PaginatedResult<AirportDataModel>> GetAllByPagingAsync(QueryObject query)
        {
            var model = _dbContext.Airports.AsQueryable();

            //searching
            if (!string.IsNullOrWhiteSpace(query.search))
            {
                model = model.Where(m => m.Name.Contains(query.search, StringComparison.OrdinalIgnoreCase) ||
                                         m.Address.Contains(query.search, StringComparison.OrdinalIgnoreCase));
            }

            //sorting
            if (!string.IsNullOrWhiteSpace(query.column))
            {
                if (Convert.ToInt16(query.column) == 0) //Name
                {
                    model = query.isDesc ? model.OrderByDescending(s => s.Name) : model.OrderBy(s => s.Name);
                }

                else if (Convert.ToInt16(query.column) == 1) //Address
                {
                    model = query.isDesc ? model.OrderByDescending(s => s.Address) : model.OrderBy(s => s.Address);
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


            return new PaginatedResult<AirportDataModel>
            {
                Items = items,
                TotalItems = totalRows
            };
        }

        public async Task<AirportDataModel> AddAsync(Airport airport)
        {
            AirportDataModel model = new AirportDataModel();
            model.Name = airport.Name;
            model.Address = airport.Address;

            //Check if Airport has duplicate Name
            var duplicate = await _dbContext.Airports
                .Where(a => a.Name == airport.Name)
                .FirstOrDefaultAsync();

            if (duplicate != null)
            {
                throw new Exception($"Another airport with name {airport.Name} already exists.");
            }

            await _dbContext.Airports.AddAsync(model);
            await _dbContext.SaveChangesAsync();
            return model;
        }

        public async Task<AirportDataModel> UpdateAsync(int id, Airport airport)
        {
            //Check if Airport exists
            var model = await _dbContext.Airports.FirstOrDefaultAsync(x => x.Id == id);
            if (model == null)
            {
                throw new Exception("Not found");
            }

            //Check if Airport has duplicate name
            var duplicate = await _dbContext.Airports
                .Where(a => a.Name == airport.Name)
                .FirstOrDefaultAsync();

            if (duplicate != null)
            {
                throw new Exception($"Another airport with name {airport.Name} already exists.");
            }

            model.Name = airport.Name;
            model.Address = airport.Address;

            await _dbContext.SaveChangesAsync();
            return model;
        }

        public async Task<IActionResult> DeleteAsync(int id)
        {
            //Check if Airport exists
            var model = await _dbContext.Airports
                .Include(p => p.Flights)
                .Where(x => x.Id == id)
                .FirstOrDefaultAsync();

            if (model == null)
            {
                throw new Exception("Not Found");
            }

            //Check if Airport has existing Flights
            if (model.Flights.Any())
            {
                throw new Exception("Cannot delete Airport with existing Flights.");
            }

            _dbContext.Airports.Remove(model);

            await _dbContext.SaveChangesAsync();

            return NoContent();
        }
    }
}
