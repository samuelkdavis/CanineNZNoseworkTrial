using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nosework.Core
{
    public class DogMapper
    {
        public List<Dog> Map(List<CsvRecord> csvRecord)
        {
            var mappedDogs = new List<Dog>();
            foreach (var record in csvRecord)
            {
                var dog = new Dog
                {
                    Id = Guid.NewGuid(),
                    DogName = record.DogName,
                    HandlerName = record.HandlerName,
                    Class = record.Class,
                    Order = record.Order,
                    PhoneNumber = record.PhoneNumber,
                    Email = record.Email
                };

                mappedDogs.Add(dog);
            }

            return mappedDogs;
        }
    }
}
