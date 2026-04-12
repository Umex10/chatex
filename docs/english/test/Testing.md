# Chatex E2E Testing Guide 🧪

# Frontend 🖥️

### —> Docker 🐳

1. We need a docker-compose file that starts a new ***container*** providing a SQL server to which our backend then connects.
    1. The content `(docker-compose.test.yml)` (under /frontend)
        
        ```yaml
        services:
          db-e2e:
            image: 'postgres:latest'
            container_name: chatex-db-e2e
            ports:
              - "5433:5432"
            environment:
              POSTGRES_DB: chatex_test
              POSTGRES_USER: testuser
              POSTGRES_PASSWORD: testpass
        ```
        
        <aside>
        💡
        
        We use port number: `5433`!
        
        </aside>
        

1. We need a specific `.env.local` structure so that we can quickly decide whether we are in `test` or `dev` mode.
    1. The values we need:
        
        ```bash
        #NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
        NEXT_PUBLIC_BACKEND_URL=http://localhost:8081
        ```
        

1. We need an extension of the run commands so that a `run test:e2e` call immediately starts multiple things in parallel, such as: container, backend call etc.
    1. Libraries we need to install:
        
        `Concurrently`, to execute commands concurrently. This allows us e.g. to start the frontend and the backend concurrently in one terminal. Normally you would need two terminal tabs.
        
        ```json
        npm install --save-dev concurrently
        ```
        
    
    b. The content of the `json` file.
    
    ```json
    "e2e:db-up": "docker compose -f docker-compose.test.yml up -d",
    "e2e:db-down": "docker compose -f docker-compose.test.yml down",
    "e2e:backend": "cd ../backend && ./mvnw spring-boot:run -Dspring-boot.run.profiles=e2e",
    "test:e2e": "npm run e2e:db-up && concurrently -k -s first \"npm run e2e:backend\" \"npx playwright test --ui\" && (fuser -k 8081/tcp || true) && sleep 2 && npm run e2e:db-down"
    ```
    
    1. This command starts our SQL server container.
        1. `-f` —> Normally it would run the default docker file, so we have to tell it to run "this" file.
        2. `up` —> This command then executes the file, downloads the image from the internet and starts the container.
        3. `-d` —> Do not occupy the terminal, start "silently".
        
        ```json
        "e2e:db-up": "docker compose -f docker-compose.test.yml up -d",
        ```
        
    2. This command stops the SQL server container again.
        1. `down` —> Deletes the container!
        
        ```json
        "e2e:db-down": "docker compose -f docker-compose.test.yml down"
        ```
        
    3. This command starts the backend with a specific **flag**.
        1. `./mvnw` —> This is a file that checks whether the required Maven version is installed; if not, it installs it.
        2. `s-boot:run` —> Starts the Spring Boot app.
        3. `-Dspring-boot.run.profiles=e2e` —> Start the backend in **E2E mode!**
            1. It would therefore look for `application-e2e` in the backend and execute it.
        
        ```json
        "e2e:backend": "cd ../backend && ./mvnw spring-boot:run -Dspring-boot.run.profiles=e2e",
        ```
        
    4. This command starts the entire test run.
        1. `e2e:db-up` —> Container is started. We need the `&&` because we need a "success" signal.
        2. `-k` —> If any process shuts down, e.g. because we close the test UI, concurrently will notice and also stop the `backend`.
        3. `-s first` —> When the test UI is closed, the backend shuts down via `-k` as well, and concurrently has the `-s first` flag set on the backend command so that we get a success signal afterwards.
        4. `(fuser -k 8081/tcp || true)` —> This ensures that no backend is still listening on `8081` and returns success true.
        5. `sleep 2` —> This gives Docker time to cleanly notice that the backend has stopped. Ensures the next command runs cleanly.
        6. `e2e:db-down` —> Container is stopped.
        
        ```json
        "test:e2e": "npm run e2e:db-up && concurrently -k -s first \"npm run e2e:backend\" \"npx playwright test --ui\" && (fuser -k 8081/tcp || true) && sleep 2 && npm run e2e:db-down"
        ```
        

# Backend 🏗️

## —> Boot Settings **🍃**

1. First we need to create a new file located under `src/main/resources`, i.e. next to our main application file. The **"e2e"** (profile) in the filename is very important for the frontend.
    1. The content `(application-e2e)`
        
        ```java
        # Database connection (test isolation)
        spring.datasource.url=jdbc:postgresql://localhost:5433/chatex_test
        spring.datasource.username=testuser
        spring.datasource.password=testpass
        spring.datasource.driverClassName=org.postgresql.Driver
        
        # JPA / Hibernate settings
        spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
        spring.jpa.hibernate.ddl-auto=create-drop
        spring.jpa.show-sql=true
        
        # Disable Spring Boot auto-configuration (since we control Docker manually)
        spring.docker.compose.enabled=false
        
        # (So that port 8080 stays free for normal dev)
        server.port=8081
        ```
        
        <aside>
        💡
        
        The field `"ddl-auto"` is extremely important for restarting the tests. If we start a test run and end it "uncleanly" for whatever reason, and then start a new test, this field will delete all the tables etc. before building new ones. This means we start clean each time!
        
        </aside>
        
        <aside>
        💡
        
        We use port number: `"5433"`!
        
        </aside>
        
        <aside>
        💡
        
        The backend is accessible on: `8081`, since we use 8080 for the main backend!
        
        </aside>
