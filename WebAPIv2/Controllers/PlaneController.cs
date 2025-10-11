using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPIv2.DataModel;
using WebAPIv2.DBContext;
using WebAPIv2.Helpers;
using WebAPIv2.Interfaces;
using WebAPIv2.Model;

namespace WebAPIv2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlaneController : ControllerBase
    {
        private readonly DatabaseContext _dbContext;
        private readonly IPlaneRepository _planeRepo;

        public PlaneController(DatabaseContext dbContext, IPlaneRepository planeRepo)
        {
            _dbContext = dbContext;
            _planeRepo = planeRepo;
        }

        // GET: api/Plane
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var planes = await _planeRepo.GetAllAsync();
                return Ok(planes);
            }
            catch (Exception ex)
            {
                return NotFound(new { error = ex.Message });
            }
        }

        // GET: api/Plane/GetAllByPaging
        [HttpGet]
        [Route("GetAllByPaging")]
        public async Task<IActionResult> GetAllByPaging([FromQuery] QueryObject query)
        {
            try
            {
                var planes = await _planeRepo.GetAllByPagingAsync(query);
                return Ok(planes);
            }
            catch (Exception ex)
            {
                return NotFound(new { error = ex.Message });
            }
        }

        // POST: api/Plane
        [HttpPost]
        public async Task<IActionResult> Add(Plane plane)
        {
            PlaneDataModel model = new PlaneDataModel();
            model.Code = plane.Code;
            model.Airline = plane.Airline;
            model.Model = plane.Model;

            //Check if Plane has duplicate Code
            var duplicate = await _dbContext.Planes
            .FirstOrDefaultAsync(a => a.Code == plane.Code);

            if (duplicate != null)
            {
                return BadRequest($"Another plane with code {plane.Code} already exists.");
            }

            await _dbContext.Planes.AddAsync(model);
            await _dbContext.SaveChangesAsync();
            return Ok(model);
        }

        // PUT: api/Plane/1
        [HttpPut]
        [Route("{id}")]
        public async Task<IActionResult> Update([FromRoute] int id, Plane plane)
        {
            //Check if Plane exists
            var model = await _dbContext.Planes.FirstOrDefaultAsync(x => x.Id == id);
            if (model == null)
            {
                return NotFound();
            }

            //Check if Planes has duplicate Code
            var duplicateAirport = await _dbContext.Planes
                .Where(a => a.Id != model.Id && a.Code == plane.Code)
                .FirstOrDefaultAsync();

            if (duplicateAirport != null)
            {
                return BadRequest($"Another plane with code {plane.Code} already exists.");
            }

            model.Code = plane.Code;
            model.Airline = plane.Airline;
            model.Model = plane.Model;

            await _dbContext.SaveChangesAsync();

            return Ok(model);
        }

        // DELETE: api/Plane/1
        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            //Check if Plane exists
            var model = await _dbContext.Planes
                .Include(x => x.Flights)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (model == null)
            {
                return NotFound();
            }

            //Check if Plane has existing Flights
            if (model.Flights.Any())
            {
                return BadRequest("Cannot delete Plane with existing Flights.");
            }

            _dbContext.Planes.Remove(model);

            await _dbContext.SaveChangesAsync();

            return NoContent();
        }
    }
}
