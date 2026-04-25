
using Amazon.DynamoDBv2;
using Amazon.SimpleNotificationService;
using Nosework.Core;
using Nosework.Api.Services;

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
            builder.Services.AddAWSService<IAmazonSimpleNotificationService>();
            builder.Services.AddSingleton<ISmsSender, SnsSmsSender>();

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddCors(options =>
            {
                options.AddPolicy(name: CorsAllowAll, policy =>
                {
                    policy.AllowAnyOrigin()
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
            });

            builder.Services.AddScoped<DogRepository>(sp =>
                new DogRepository(sp.GetRequiredService<IAmazonDynamoDB>(),
                builder.Configuration["Database:DogTableName"]));

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

            app.Run();
        }
    }
}
