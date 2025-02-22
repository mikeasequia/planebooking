using Microsoft.EntityFrameworkCore;
using WebAPIv2.DataModel;

namespace WebAPIv2.DBContext
{
    public class DatabaseContext: DbContext
    {
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseInMemoryDatabase(databaseName: "MikePlaneBookingDb");
        }

        public DbSet<AirportDataModel> Airports { get; set; }
        public DbSet<PlaneDataModel> Planes { get; set; }
        public DbSet<FlightDataModel> Flights { get; set; }
        public DbSet<PassengerBookingDataModel> Passengers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //Airport TABLE
            modelBuilder.Entity<AirportDataModel>(e => 
            { 
                e.HasKey(e => e.Id);

                //Airport has One-To-Many relationship with Flight
                e.HasMany(a => a.Flights)
                .WithOne(f => f.Airport)
                .HasForeignKey(f => f.AirportId)
                .OnDelete(DeleteBehavior.Restrict);
            });


            //Plane TABLE
            modelBuilder.Entity<PlaneDataModel>(e => 
            {
                e.HasKey(e => e.Id);

                //Plane has One-To-Many relationship with Flight
                e.HasMany(p => p.Flights)
                .WithOne(f => f.Plane)
                .HasForeignKey(f => f.PlaneId)
                .OnDelete(DeleteBehavior.Restrict);
            });

            //Flight TABLE
            modelBuilder.Entity<FlightDataModel>(e =>
            {
                e.HasKey(e => e.Id);

                //Flight has One-To-Many relationship with Passenger
                e.HasMany(p => p.PassengerBookings)
                .WithOne(f => f.Flight)
                .HasForeignKey(f => f.FlightId)
                .OnDelete(DeleteBehavior.Restrict);
            });

            //PassengerBooking TABLE
            modelBuilder.Entity<PassengerBookingDataModel>(e => 
            {
                e.HasKey(e => e.Id);
            });

            base.OnModelCreating(modelBuilder);
        }
    }
}
