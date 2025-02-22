using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPIv2.DataModel;
using WebAPIv2.DBContext;
using WebAPIv2.Model;

namespace WebAPIv2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PassengerBookingController : ControllerBase
    {
        private readonly DatabaseContext _dbContext;

        public PassengerBookingController(DatabaseContext dbContext)
        {
            _dbContext = dbContext;
        }

        // GET: api/PassengerBooking
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _dbContext.Passengers
                .Include(p => p.Flight)
                .ToListAsync());
        }

        // POST: api/PassengerBooking
        [HttpPost]
        public async Task<IActionResult> Add(PassengerBooking passenger)
        {
            PassengerBookingDataModel passengerModel = new PassengerBookingDataModel();
            passengerModel.Name = passenger.Name;
            passengerModel.FlightId = passenger.FlightId;


            //Check if Passenger Booking has duplicate Flight
            var duplicate = await _dbContext.Passengers
                .Include(p => p.Flight)
            .FirstOrDefaultAsync(a => a.Name.ToUpper() == passenger.Name.ToUpper() && a.FlightId == passenger.FlightId);

            if (duplicate != null)
            {
                return BadRequest($"Another passenger booking with name {passenger.Name} and with flight {duplicate.Flight.Flight} already exists.");
            }


            await _dbContext.Passengers.AddAsync(passengerModel);

            await _dbContext.SaveChangesAsync();

            return Ok(passengerModel);
        }

        // PUT: api/PassengerBooking/1
        [HttpPut]
        [Route("{id}")]
        public async Task<IActionResult> Update([FromRoute] int id, PassengerBooking passenger)
        {
            var model = await _dbContext.Passengers.FirstOrDefaultAsync(x => x.Id == id);

            if (model == null)
            {
                return NotFound();
            }


            //Check if Passenger Booking has duplicate Flight
            var duplicate = await _dbContext.Passengers
                .Include(p => p.Flight)
                .Where(a => a.Id != model.Id && a.Name.ToUpper() == passenger.Name.ToUpper() && a.FlightId == passenger.FlightId)
                .FirstOrDefaultAsync();

            if (duplicate != null)
            {
                return BadRequest($"Another passenger booking with name {passenger.Name} and with flight {duplicate.Flight.Flight} already exists.");
            }


            model.Name = passenger.Name;
            model.FlightId = passenger.FlightId;

            await _dbContext.SaveChangesAsync();

            return Ok(model);
        }


        // DELETE: api/PassengerBooking/1
        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            var model = await _dbContext.Passengers.FirstOrDefaultAsync(x => x.Id == id);

            if (model == null)
            {
                return NotFound();
            }

            _dbContext.Passengers.Remove(model);

            await _dbContext.SaveChangesAsync();

            return NoContent();
        }
    }
}
