## Library Management System

A RESTful Web API for managing a digital library , including **Books**, **Authors**, and **Borrowing Records**.

This project includes full **API automation testing with Postman & Newman**, and a complete **CI/CD pipeline** using **GitHub Actions** and **Docker**.



### API Testing with Postman & Newman

This project includes automated API tests for all endpoints (**Books**, **Authors**, and **Borrow**).

### Tools Used
- **Postman** — for designing and exporting test collections
- **Newman** — for automated test execution via CLI
- **htmlextra** — for generating detailed HTML test reports



### Files Used
- `library-api-tests.postman_collection.json` → all API requests and assertions
- `library-api-env.postman_environment.json` → contains variables like `baseUrl` and `userName`



### Requirements
- Node.js and npm installed
- Docker running (for API and PostgreSQL containers)


### Run Tests Locally

**Start containers:**
   ```bash
   docker compose up -d
````

### Run the tests using Newman

   ```bash
   npx newman run library-api-tests.postman_collection.json \
   -e library-api-env.postman_environment.json \
   -r htmlextra \
   --reporter-htmlextra-export Reports/LibraryAPITestReport.html
   ````
 ---  
### Open the report:
  ```bash
   start Reports/LibraryAPITestReport.html  
   ````

All generated reports are saved in the Reports/ folder.
Open LibraryAPITestReport.html in any browser to view detailed results (passed, failed, response time, etc.).


### CI/CD Pipeline (GitHub Actions)

A secure CI/CD workflow is defined in:


````File: .github/workflows/build-and-test.yml````

This workflow runs on every push or pull request to **main**.



### **CI + CD – Build, Scan, Sign & Verify**

The pipeline performs the following stages:

##### Continuous Integration (CI)
1. Restore and build the .NET Web API
2. Filesystem dependency scan using Trivy
3. Build and push the Docker image to Docker Hub
4. Generate a Software Bill of Materials (SBOM) in CycloneDX format
5. Scan the Docker image for HIGH and CRITICAL vulnerabilities
6. Start services with Docker Compose
7. Execute automated API tests using Newman
8. Shut down containers after test execution

##### Continuous Delivery (CD)

1. Sign the Docker image using Cosign and a private key
2. Verify the image signature to ensure image integrity and authenticity



### Security Features

The pipeline implements several supply-chain security best practices:

1. Minimal GitHub permissions
3. Dependency and image vulnerability scanning (Trivy)
5. SBOM generation (CycloneDX)
7. Immutable image digest usage
9. Container image signing and verification (Cosign)

These steps ensure that only verified and trusted container images are produced and published.


### Docker Image

The Web API Docker image is published to Docker Hub under:
````bash
<DOCKER_USERNAME>/librarymanagementsystem-webapi:latest

````

Images are scanned, signed, and verified automatically before release.
