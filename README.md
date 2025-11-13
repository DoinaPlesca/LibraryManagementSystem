# Library Management System

A RESTful Web API for managing a digital library , including **Books**, **Authors**, and **Borrowing Records**.

This project includes full **API automation testing with Postman & Newman**, and a complete **CI/CD pipeline** using **GitHub Actions** and **Docker**.

---

## API Testing with Postman & Newman

This project includes automated API tests for all endpoints (**Books**, **Authors**, and **Borrow**).

### Tools Used
- **Postman** — for designing and exporting test collections
- **Newman** — for automated test execution via CLI
- **htmlextra** — for generating detailed HTML test reports

---

### Files Used
- `library-api-tests.postman_collection.json` → all API requests and assertions
- `library-api-env.postman_environment.json` → contains variables like `baseUrl` and `userName`

---

### Requirements
- Node.js and npm installed
- Docker running (for API and PostgreSQL containers)

---

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
   
### Once the tests finish, open the report:
  ```bash
   start Reports/LibraryAPITestReport.html  
   ````



All generated reports are saved in the Reports/ folder.
Open LibraryAPITestReport.html in any browser to view detailed results (passed, failed, response time, etc.).


### CI/CD Pipeline (GitHub Actions)

Two automated workflows are configured in .github/workflows:

#### CI – Docker Compose & API Tests

````File: .github/workflows/build-and-test.yml````

This workflow runs on every push or pull request to **main**.

**It:**

1. Builds and starts the API and Postgres containers using Docker Compose

3. Runs all Postman tests automatically with Newman

5. Generates a detailed HTML report

7. Uploads the report as a downloadable artifact in GitHub Actions

#### CD – Build & Push Docker Image

````File: .github/workflows/docker-publish.yml````

This workflow runs only after the CI tests pass successfully.

**It:**

1. Builds the Docker image for the Web API

3. Pushes it to Docker Hub under repository

5. Tags it as both latest and with the current build number