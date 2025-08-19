using Microsoft.AspNetCore.Mvc;
using Nosework.Core;
using System.Formats.Asn1;
using System.Globalization;

namespace Nosework.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RunningOrder : ControllerBase
    {
        [HttpGet(Name = "GetRunningOrder")]
        public object Get()
        {
            var dogs = new[] {
                new { DogName = "Buddy", HandlerName = "Dennis Reynolds", OrderId = 1, Class = "Novice" },
                new { DogName = "Rum Ham", HandlerName = "Frank Reynolds", OrderId = 2, Class = "Intermediate" },
                new { DogName = "Peter Nincompoop", HandlerName = "Charlie Kelly", OrderId = 3, Class = "Novice" },
                new { DogName = "Poppins", HandlerName = "Mac", OrderId = 4, Class = "Intermediate" },
                new { DogName = "Belle", HandlerName = "Dee Reynolds", OrderId = 5, Class = "Intermediate" },

            }.ToList();

            return dogs;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadCsv(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            if (!Path.GetExtension(file.FileName).Equals(".csv", StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest("Only CSV files are allowed.");
            }
            List<CsvRecord> records = [];
            using (var stream = file.OpenReadStream())
            {
                var csvProcessor = new CsvProcessor();
                records = csvProcessor.ReadCsv(stream);
            }
            if (records.Count == 0)
            {
                return BadRequest("The uploaded CSV file is empty or invalid.");
            }

            var dogs = new DogMapper().Map(records);
            
            foreach(var dog in dogs)
            {
                await new DogRepository(new Amazon.DynamoDBv2.AmazonDynamoDBClient(), "Dogs").Create(dog);
            }

            return Ok();


        }
    }
}
