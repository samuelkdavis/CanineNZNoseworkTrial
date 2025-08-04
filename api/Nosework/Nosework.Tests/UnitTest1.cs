using Nosework.Core;
using System.Threading.Tasks;

namespace Nosework.Tests
{
    public class UnitTest1
    {
        [Fact]
        public async Task Test1()
        {
            var z = new Class1();
            await z.SaveStuffToDynamo();
        }
    }
}