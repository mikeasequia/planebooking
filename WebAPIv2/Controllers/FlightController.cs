using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Numerics;
using WebAPIv2.DataModel;
using WebAPIv2.DBContext;
using WebAPIv2.Model;

namespace WebAPIv2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FlightController : ControllerBase
    {
        private readonly DatabaseContext _dbContext;

        public FlightController(DatabaseContext dbContext)
        {
            _dbContext = dbContext;
        }

        // GET: api/Flight
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _dbContext.Flights
                .Include(f => f.Airport)
                .Include(f => f.Plane)
                .ToListAsync());
        }

        // GET: api/Flight/1
        [HttpGet]
        [Route("{id}")]
        public async Task<ActionResult<FlightDataModel>> GetById([FromRoute] int id)
        {
            var flight = await _dbContext.Flights
                .Include(f => f.Airport)
                .Include(f => f.Plane)
                .FirstOrDefaultAsync(f => f.Id == id);

            if (flight == null)
            {
                return NotFound();
            }

            return flight;
        }

        // POST: api/Flight
        [HttpPost]
        public async Task<IActionResult> Add(FlightModel flight)
        {
            FlightDataModel model = new FlightDataModel();
            model.Flight = flight.Flight;
            model.AirportId = flight.AirportId;
            model.PlaneId = flight.PlaneId;
            model.Pilot = flight.Pilot;


            //Check if Flight has duplicate Flight
            var duplicate = await _dbContext.Flights
            .FirstOrDefaultAsync(a => a.Flight == flight.Flight);

            if (duplicate != null)
            {
                return BadRequest($"Another flight {flight.Flight} already exists.");
            }

            await _dbContext.Flights.AddAsync(model);
            await _dbContext.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new {id = model.Id}, model);
        }

        // PUT: api/Flight/1
        [HttpPut]
        [Route("{id}")]
        public async Task<IActionResult> Update([FromRoute] int id, FlightModel flight)
        {
            //Check if Flight exists
            var model = await _dbContext.Flights.FirstOrDefaultAsync(x => x.Id == id);
            if (model == null)
            {
                return NotFound();
            }

            //Check if Flight has duplicate Flight
            var duplicateAirport = await _dbContext.Flights
                .Where(a => a.Id != model.Id && a.Flight == flight.Flight)
                .FirstOrDefaultAsync();

            if (duplicateAirport != null)
            {
                return BadRequest($"Another flight {flight.Flight} already exists.");
            }

            model.Flight = flight.Flight;
            model.AirportId = flight.AirportId;
            model.PlaneId = flight.PlaneId;
            model.Pilot = flight.Pilot;

            await _dbContext.SaveChangesAsync();

            return Ok(model);
        }

        // DELETE: api/Flight/1
        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            //Check if Flight exists
            var model = await _dbContext.Flights
                .Include(x => x.PassengerBookings)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (model == null)
            {
                return NotFound();
            }

            //Check if Flight has existing Passenger Bookings
            if (model.PassengerBookings.Any())
            {
                return BadRequest("Cannot delete Flight with existing Passenger Bookings.");
            }

            _dbContext.Flights.Remove(model);

            await _dbContext.SaveChangesAsync();

            return NoContent();
        }
    }
}
