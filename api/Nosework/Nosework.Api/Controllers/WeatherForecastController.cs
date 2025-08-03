using Microsoft.AspNetCore.Mvc;

namespace Nosework.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };


        private readonly ILogger<WeatherForecastController> _logger;

        public WeatherForecastController(ILogger<WeatherForecastController> logger)
        {
            _logger = logger;
        }

        [HttpGet(Name = "GetWeatherForecast")]
        public object Get()
        {
            var z = new[] { 
                new { DogName = "Buddy", Age = 4 },
                new { DogName = "Bella", Age = 5 },
                new { DogName = "Charlie", Age = 2 },
                new { DogName = "Lucy", Age = 4 },

            }.ToList();

            return z;
        }
    }
}
