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
            try
            {
                var response = await _planeRepo.AddAsync(plane);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return NotFound(new { error = ex.Message });
            }
        }

        // PUT: api/Plane/1
        [HttpPut]
        [Route("{id}")]
        public async Task<IActionResult> Update([FromRoute] int id, Plane plane)
        {
            try
            {
                var response = await _planeRepo.UpdateAsync(id, plane);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return NotFound(new { error = ex.Message });
            }
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
