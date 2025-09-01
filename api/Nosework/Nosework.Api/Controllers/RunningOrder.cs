using Amazon;
using Amazon.DynamoDBv2;
using Amazon.Runtime.CredentialManagement;
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
        private readonly IAmazonDynamoDB _dbClient;

        public RunningOrder(IAmazonDynamoDB dbClient)
        {
            _dbClient = dbClient;
        }

        [HttpGet(Name = "GetRunningOrder")]
        public async Task<List<Dog>> Get()
        {
            var dogdbname = "DogSports-noseworkdatastoredogs6D336E12-HV1NY32291RK";
            var dogRepo = new DogRepository(_dbClient, dogdbname);
            var dogs = await dogRepo.Read();
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
            try
            {
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

                foreach (var dog in dogs)
                {
                    var dogdbname = "DogSports-noseworkdatastoredogs6D336E12-HV1NY32291RK";
                    await new DogRepository(_dbClient, dogdbname).Create(dog);
                }

                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
