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
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var airports = await _airportRepo.GetAllAsync();
            return Ok(airports);
        }

        // GET: api/Airport/GetAllByPaging
        [HttpGet]
        [Route("GetAllByPaging")]
        public async Task<IActionResult> GetAllByPaging([FromQuery] QueryObject query)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var airports = await _airportRepo.GetAllByPagingAsync(query);
            return Ok(airports);
        }

        // POST: api/Airport
        [HttpPost]
        public async Task<IActionResult> Add(Airport airport)
        {
            AirportDataModel model = new AirportDataModel();
            model.Name = airport.Name;
            model.Address = airport.Address;

            //Check if Airport has duplicate Name
            var duplicate = await _dbContext.Airports
                .Where(a => a.Name.Equals(airport.Name, StringComparison.OrdinalIgnoreCase))
                .FirstOrDefaultAsync();

            if (duplicate != null)
            {
                return BadRequest($"Another airport with name {airport.Name} already exists.");
            }

            await _dbContext.Airports.AddAsync(model);
            await _dbContext.SaveChangesAsync();
            return Ok(model);
        }

        // PUT: api/Airport/1
        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update([FromRoute] int id, Airport airport)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            //Check if Airport exists
            var model = await _dbContext.Airports.FirstOrDefaultAsync(x => x.Id == id);
            if (model == null)
            {
                return NotFound();
            }

            //Check if Airport has duplicate Name
            var duplicateName = await _dbContext.Airports
                .Where(a => model.Id != a.Id && a.Name == airport.Name) // exclude the Airport that is being updated
                .FirstOrDefaultAsync();
            if (duplicateName != null)
            {
                return BadRequest($"Another airport with name {airport.Name} already exists.");
            }

            model.Name = airport.Name;
            model.Address = airport.Address;

            await _dbContext.SaveChangesAsync();

            return Ok(model);
        }

        // DELETE: api/Airport/1
        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

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
