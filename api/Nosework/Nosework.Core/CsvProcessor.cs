using CsvHelper;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nosework.Core
{
    public class CsvProcessor
    {
        public List<CsvRecord> ReadCsv(Stream stream)
        {
            var records = new List<CsvRecord>();
            using (var reader = new StreamReader(stream))
            using (var csv = new CsvReader(reader, CultureInfo.InvariantCulture))
            {
                records = csv.GetRecords<CsvRecord>().ToList();
            }

            return records;
        }
    }
}
