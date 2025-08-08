using CsvHelper;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nosework.Core
{
    //using (var reader = new StreamReader(file.OpenReadStream()))
    //using (var csv = new CsvReader(reader, CultureInfo.InvariantCulture))
    //{
    //    var records = csv.GetRecords<MyCsvRecord>().ToList();
    //    // Process the 'records' list (e.g., save to database, perform validation)
    //    return Ok($"Successfully processed {records.Count} records.");
    //}
    public class CsvProcessor
    {
        public void ReadCsv(Stream stream)
        {
            var records = new List<MyCsvRecord>();
            using (var reader = new StreamReader(stream))
            using (var csv = new CsvReader(reader, CultureInfo.InvariantCulture))
            {
                records = csv.GetRecords<MyCsvRecord>().ToList();
                // Process the 'records' list (e.g., save to database, perform validation)
                //todo save records to database
            }

            //map records
            //save db recordd
        }
    }
}
