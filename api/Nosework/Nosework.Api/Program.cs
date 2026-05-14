
using Amazon.DynamoDBv2;
using Amazon.SimpleNotificationService;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Nosework.Core;
using Nosework.Api.Services;

namespace Nosework.Api
{
    public class Program
    {
        private const string CorsAllowAll = "Allow all";
        private const string AdminPolicy = "AdminOnly";

        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddDefaultAWSOptions(builder.Configuration.GetAWSOptions());
            builder.Services.AddAWSService<IAmazonDynamoDB>();
            builder.Services.AddAWSService<IAmazonSimpleNotificationService>();
            builder.Services.AddSingleton<ISmsSender, SnsSmsSender>();

            // Cognito JWT authentication
            var cognitoRegion = builder.Configuration["Cognito:Region"] ?? "ap-southeast-2";
            var cognitoUserPoolId = builder.Configuration["Cognito:UserPoolId"];
            var cognitoAudience = builder.Configuration["Cognito:ClientId"];

            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.Authority = $"https://cognito-idp.{cognitoRegion}.amazonaws.com/{cognitoUserPoolId}";
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        ValidateIssuer = true,
                        ValidateAudience = false, // Cognito access tokens don't include audience
                        ValidateLifetime = true,
                    };
                });

            builder.Services.AddAuthorization(options =>
            {
                options.AddPolicy(AdminPolicy, policy =>
                    policy.RequireAuthenticatedUser()
                          .RequireClaim("cognito:groups", "admin"));
            });

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

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
