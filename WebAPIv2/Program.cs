using System.Text.Json.Serialization;
using WebAPIv2.DBContext;
using WebAPIv2.Interfaces;
using WebAPIv2.Repository;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//Add CORS to inlude localhost:4200
builder.Services.AddCors(options => options.AddPolicy(name: "FrontendUI",
    policy => {
        policy.WithOrigins([
            "http://localhost:4200", 
            "http://127.0.0.1:4200", 
            "https://localhost:4200", 
            "https://127.0.0.1:4200",
            "http://localhost:5500",
            "http://127.0.0.1:5500",
            ]
           ).AllowAnyMethod().AllowAnyHeader();
    }
));


builder.Services.AddDbContext<DatabaseContext>();

//Add Airport Repository
builder.Services.AddScoped<IAirportRepository, AirportRepository>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//Add CORS
app.UseCors("FrontendUI");

app.UseHttpsRedirection();

//app.UseAuthorization();

app.MapControllers();

app.Run();
