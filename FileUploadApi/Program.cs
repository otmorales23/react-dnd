using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Microsoft.Extensions.DependencyInjection;

public class Program
{
    public static void Main(string[] args)
    {
        CreateHostBuilder(args).Build().Run();
    }

    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureWebHostDefaults(webBuilder =>
            {
                webBuilder.ConfigureServices((hostContext, services) =>
                {
                    // Add services to the container.
                    services.AddControllers();

                    // Add CORS policy
                    services.AddCors(options =>
                    {
                        options.AddPolicy("AllowReactApp", builder =>
                        {
                            builder
                                .WithOrigins("http://localhost:3000") // Replace with your frontend's URL
                                .AllowAnyMethod()
                                .AllowAnyHeader();
                        });
                    });

                    // Add Swagger/OpenAPI
                    services.AddEndpointsApiExplorer();
                    services.AddSwaggerGen(c =>
                    {
                        c.SwaggerDoc("v1", new OpenApiInfo { Title = "Your API", Version = "v1" });
                    });
                })
                .Configure((hostContext, app) =>
                {
                    var env = hostContext.HostingEnvironment;

                    if (env.IsDevelopment())
                    {
                        // Enable Swagger in development
                        app.UseSwagger();
                        app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Your API v1"));
                    }

                    app.UseHttpsRedirection();
                    app.UseRouting();

                    // Use CORS
                    app.UseCors("AllowReactApp");

                    app.UseAuthorization();

                    app.UseEndpoints(endpoints =>
                    {
                        endpoints.MapControllers();
                    });
                });
            });
}
