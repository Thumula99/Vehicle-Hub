FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore as distinct layers
COPY ["ServerCSharp.csproj", "./"]
RUN dotnet restore "ServerCSharp.csproj"

# Copy everything else and build
COPY . .
RUN dotnet publish "ServerCSharp.csproj" -c Release -o /app/publish

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Render exposes the PORT environment variable
ENV ASPNETCORE_HTTP_PORTS=""
ENV ASPNETCORE_URLS=http://+:${PORT:-8080}

# Fix inotify limit crash on Render by disabling file watchers for config
ENV DOTNET_HOSTBUILDER__RELOADCONFIGONCHANGE=false
ENTRYPOINT ["dotnet", "ServerCSharp.dll"]
