using Nosework.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;
using System.IO;
using Shouldly;
namespace Nosework.Tests
{
    public class CsvUploadTests
    {
        [Fact]
        public void TestCsvCanBeRead()
        {
            //arrange
            var filePath = "./example-dogs.csv";
            List<CsvRecord> csvRecords = [];
            using (FileStream fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read))
            {
                var csvProcessor = new CsvProcessor();
                //act
                csvRecords = csvProcessor.ReadCsv(fileStream);
            }

            //assert
            csvRecords.Count.ShouldBe(3);
        }

        [Fact]
        public void TestCsvRecordCanBeMapped()
        {
            //arrange
            var csvRecord = new CsvRecord
            {
                DogName = "Rum Ham",
                HandlerName = "Frank Reynolds",
                Class = "Novice",
                Order = 2,
                PhoneNumber = "0211133181",
                Email = "samuelkdavis@gmail.com"
            };

            //act
            var dogs = new DogMapper().Map(new List<CsvRecord> { csvRecord });
            //assert

            dogs.Count.ShouldBe(1);
        }
    }
}
