
using Amazon.DynamoDBv2;
using Amazon.Runtime;
using Amazon.Runtime.CredentialManagement;
using Microsoft.Extensions.Configuration;

namespace Nosework.Api
{
    public class Program
    {
        private const string CorsAllowAll = "Allow all";

        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddDefaultAWSOptions(builder.Configuration.GetAWSOptions());
            builder.Services.AddAWSService<IAmazonDynamoDB>();

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddCors(options =>
            {
                options.AddPolicy(name: CorsAllowAll, policy =>
                {
                    policy.WithOrigins("*");
                });
            });

            var app = builder.Build();
            app.UseCors(CorsAllowAll);

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseAuthorization();


            app.MapControllers();

            // var awsOptions = builder.Configuration.GetAWSOptions();
            // Console.WriteLine($"Profile: {awsOptions.Profile}");

            app.Run();
        }
    }
}
