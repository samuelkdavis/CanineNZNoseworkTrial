using Microsoft.AspNetCore.Mvc;

namespace Nosework.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RunningOrder
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
    }
}
