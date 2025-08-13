# StinkHub Website

A modern website for StinkHub - Premium Android Kernel Development, featuring custom kernels with KernelSU & SUSFS integration.

## Features

- Modern, responsive design
- Cannabis leaf background theme
- Links to TheWildJames and WildKernels GitHub repositories
- Information about available kernels (GKI, OnePlus, Sultan)
- Docker containerization for easy deployment

## Quick Start with Docker

### Using Docker Compose (Recommended)

1. Build and run the container:
```bash
docker-compose up -d --build
```

2. Access the website at: http://localhost:8080

3. To stop the container:
```bash
docker-compose down
```

### Using Docker directly

1. Build the Docker image:
```bash
docker build -t stinkhub-web .
```

2. Run the container:
```bash
docker run -d -p 8080:80 --name stinkhub-website stinkhub-web
```

3. Access the website at: http://localhost:8080

4. To stop and remove the container:
```bash
docker stop stinkhub-website
docker rm stinkhub-website
```

## Development

The website consists of:
- `index.html` - Main HTML structure
- `style.css` - Styling with cannabis leaf background
- `Dockerfile` - Container configuration
- `docker-compose.yml` - Docker Compose setup

## Links

- [TheWildJames GitHub](https://github.com/TheWildJames)
- [Wild Kernels Organization](https://github.com/WildKernels)

## Disclaimer

⚠️ **Your warranty is no longer valid!** Flash kernels at your own risk!

## License

This project is for educational and development purposes.