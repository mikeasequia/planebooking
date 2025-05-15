using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPIv2.DataModel;
using WebAPIv2.DBContext;
using WebAPIv2.Helpers;
using WebAPIv2.Interfaces;
using WebAPIv2.Model;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AirportController : ControllerBase
    {
        private readonly DatabaseContext _dbContext;
        private readonly IAirportRepository _airportRepo;

        public AirportController(DatabaseContext dbContext, IAirportRepository airportRepo)
        {
            _airportRepo = airportRepo;
            _dbContext = dbContext;
        }

        // GET: api/Airport
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var airports = await _airportRepo.GetAllAsync();
            return Ok(airports);
        }

        // GET: api/Airport/GetAllByPaging
        [HttpGet]
        [Route("GetAllByPaging")]
        public async Task<IActionResult> GetAllByPaging([FromQuery] QueryObject query)
        {
            var airports = await _airportRepo.GetAllByPagingAsync(query);
            return Ok(airports);
        }

        // POST: api/Airport
        [HttpPost]
        public async Task<IActionResult> Add(Airport airport)
        {
            try
            {
                var response = await _airportRepo.AddAsync(airport);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // PUT: api/Airport/1
        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update([FromRoute] int id, Airport airport)
        {
            try
            {
                var response = await _airportRepo.UpdateAsync(id, airport);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // DELETE: api/Airport/1
        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            //Check if Airport exists
            var model = await _dbContext.Airports
                .Include(p => p.Flights)
                .Where(x => x.Id == id)
                .FirstOrDefaultAsync();

            if (model == null)
            {
                return NotFound();
            }

            //Check if Airport has existing Flights
            if (model.Flights.Any())
            {
                return BadRequest("Cannot delete Airport with existing Flights.");
            }

            _dbContext.Airports.Remove(model);

            await _dbContext.SaveChangesAsync();

            return NoContent();
        }
    }
}
