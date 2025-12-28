FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app

RUN adduser --disabled-password --gecos "" appuser

EXPOSE 8080


FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release

WORKDIR /src

COPY ["Library.WebApi/Library.WebApi.csproj", "Library.WebApi/"]
COPY ["Library.Core/Library.Core.csproj", "Library.Core/"]
COPY ["Library.Infrastructure/Library.Infrastructure.csproj", "Library.Infrastructure/"]

RUN dotnet restore "Library.WebApi/Library.WebApi.csproj" --disable-parallel
COPY . .

WORKDIR "/src/Library.WebApi"
RUN dotnet build "Library.WebApi.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "Library.WebApi.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app

COPY --from=publish /app/publish .

# OCI metadata labels 
LABEL org.opencontainers.image.source="https://github.com/DoinaPlesca/LibraryManagementSystem/tree/main"
LABEL org.opencontainers.image.description="Library Management System API - Secure CRA Build"
LABEL org.opencontainers.image.version="1.0"

ENTRYPOINT ["dotnet", "Library.WebApi.dll"]
