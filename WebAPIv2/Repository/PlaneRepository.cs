using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPIv2.DataModel;
using WebAPIv2.DBContext;
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
    }
}
