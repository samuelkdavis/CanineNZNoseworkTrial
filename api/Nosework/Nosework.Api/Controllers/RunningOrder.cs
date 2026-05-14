using Amazon;
using Amazon.DynamoDBv2;
using Amazon.Runtime.CredentialManagement;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nosework.Core;
using Nosework.Api.Models;
using Nosework.Api.Services;
using System.Formats.Asn1;
using System.Globalization;

namespace Nosework.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RunningOrder : ControllerBase
    {
        private readonly DogRepository _dogRepository;
        private readonly ISmsSender _smsSender;

        public RunningOrder(DogRepository dogRepository, ISmsSender smsSender)
        {
            _dogRepository = dogRepository;
            _smsSender = smsSender;
        }

        [HttpGet(Name = "GetRunningOrder")]
        public async Task<List<Dog>> Get()
        {
            var dogs = await _dogRepository.Read();
            return dogs;
        }

        [HttpDelete("delete")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> DeleteAll([FromQuery] string areYouSure)
        {
            if (areYouSure != "yes")
            {
                return BadRequest("You must confirm deletion by setting areYouSure=yes");
            }
            await _dogRepository.Delete();
            return Ok();
        }

        [HttpPost("upload")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult<List<Dog>>> UploadCsv(IFormFile file)
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
                    await _dogRepository.Create(dog);
                }

                return Ok(dogs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("sendtext")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> SendText([FromBody] SendTextRequest request, CancellationToken cancellationToken)
        {
            var order = request.OrderId;

            var dog = await _dogRepository.ReadByOrder(order);
            if (dog == null)
            {
                return NotFound($"No dog found for order {order}.");
            }

            var message = string.IsNullOrWhiteSpace(request.Message)
                ? $"You're up soon. Current running order number: {order}."
                : request.Message;

            try
            {
                await _smsSender.SendAsync(dog.PhoneNumber, message, cancellationToken);
                return Ok(new { orderId = order, sentTo = dog.PhoneNumber });
            }
            catch (InvalidOperationException ex)
            {
                return StatusCode(502, new { error = ex.Message });
            }
        }
    }
}
