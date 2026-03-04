# Chatex E2E Testing guide🧪

# Frontend 🖥️

### —> Docker 🐳

1. Wir brauchen eine docker-compose file, die wiederum einen neuen ***Container*** startet, der einen Sql-Server bereitstellt, zudem sich unser backend dann hinverbindet. 
    1. Der Inhalt `(docker-compose.test.yml)` (unter /frontend)
        
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
        
        Wir verwnedne Anschlussnummer: `5433`!
        
        </aside>
        

1. Wir brauchen einen bestimmten `.env.local` Aufbau, sodass wir sehr schnell entscheiden konnen, ob wir im `test` oder `dev` modus sind. 
    1. Die Werte die wir brauchen:
        
        ```bash
        #NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
        NEXT_PUBLIC_BACKEND_URL=http://localhost:8081
        ```
        

1. Wir brauchen eine Erweiterung der run commands, sodass wir z.b bei einem `run test:e2e` Aufruf, sofort mehrere Sachen nebenbei starten, wie z.b: container, backend aufruf etc…
    1. Libraries die wir installieren müssen:
        
        `Concurrently`, um Befehle concurrent auszuführen. Dies erlaubt uns z.b das frontend und das backend concurrent in einem Terminal zu starten. Normalerweise bräuchte man zwei Terminal-Tabs.
        
        ```json
        npm install --save-dev concurrently
        ```
        
    
    b. Der Inhalt von der `json` Datei.
    
    ```json
    "e2e:db-up": "docker compose -f docker-compose.test.yml up -d",
    "e2e:db-down": "docker compose -f docker-compose.test.yml down",
    "e2e:backend": "cd ../backend && ./mvnw spring-boot:run -Dspring-boot.run.profiles=e2e",
    "test:e2e": "npm run e2e:db-up && concurrently -k -s first \"npm run e2e:backend\" \"npx playwright test --ui\" && (fuser -k 8081/tcp || true) && sleep 2 && npm run e2e:db-down"
    ```
    
    1. Dieser command startet unseren Sql-Server Container.
        1. `-f` —> Normalerweise würde es die normale docker file ausführen, also müssen wir im sagen, dass er “diese” file ausführen soll.
        2. `up` —> Dieser command führt dann die file aus, lädt das image aus dem Internet herunter und startet den Container. 
        3. `-d` —> Besetze nicht das Terminal, starte “still”
        
        ```json
        "e2e:db-up": "docker compose -f docker-compose.test.yml up -d",
        ```
        
    2. Dieser Command beendet den Sql-Server Container wieder.
        1. `down` —> Deleted den Container!
        
        ```json
        "e2e:db-down": "docker compose -f docker-compose.test.yml down"
        ```
        
    3. Dieser command startet das backend mit einem bestimmten **Flag.**
        1. `./mvnw` —> Das ist eine Datei, die schaut, ob die maven version installiert ist, die wir brauchen, wenn nicht, installiert er sie.
        2. `s-boot:run` —> Startet die S-Boot app
        3. `-Dspring-boot.run.profiles=e2e` —> Starte das backend im **E2E-Modus!** 
            1. Er würde also nach der `application-e2e` im backend suchen und ausführen.
        
        ```json
        "e2e:backend": "cd ../backend && ./mvnw spring-boot:run -Dspring-boot.run.profiles=e2e",
        ```
        
    4. Dieser Command startet den ganzen Test-Durchlauf.
        1. `e2e:db-up` —> Container wird gestartet. Das `&&`  brauchen wir, weil wir ein “Success” brauchen.
        2. `-k` —> Wenn irgendein System sich abschaltet, sei es, dass wir die test-ui schließen, dann würde das concurrently merken und ebenfalls das `backend` beenden.
        3. `-s first` —> Wenn die test-ui beendet wurde, schaltet sich das backend durch -k ebenfalls ab, und dabei hat **concurrently** ein flag mit s- first auf den backend command gesetzt, sodass wir danach eine Success-meldung returnen. 
        4. `(fuser -k 8081/tcp || true)` —> Damit stellen wir sicher, dass kein backend mehr auf `8081` lauscht und returnen Success true. 
        5.  `sleep 2` —> Dies erlaubt docker zu merken, dass das backend beendet wurde sauber. Stellt sicher, dass er nächtse befehl sauber läuft.
        6. `e2e:db-down` —> Container wird beendet.
        
        ```json
        "test:e2e": "npm run e2e:db-up && concurrently -k -s first \"npm run e2e:backend\" \"npx playwright test --ui\" && (fuser -k 8081/tcp || true) && sleep 2 && npm run e2e:db-down"
        ```
        

# Backend 🏗️

## —> Boot-Settings**🍃**

1. Zuerst müssen wir uns eine neue Datei anlegen die unter `src/main/resources` liegt, also neben unserer main application datei. Dabei ist **“e2e”** (rofil) im namen der Datei sehr wichtig für das Frontend.
    1. Der Inhalt `(application-e2e)`
        
        ```java
        # Datenbank-Verbindung (Test-Isolierung)
        spring.datasource.url=jdbc:postgresql://localhost:5433/chatex_test
        spring.datasource.username=testuser
        spring.datasource.password=testpass
        spring.datasource.driverClassName=org.postgresql.Driver
        
        # JPA / Hibernate Einstellungen
        spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
        spring.jpa.hibernate.ddl-auto=create-drop
        spring.jpa.show-sql=true
        
        # Spring Boot Automatik deaktivieren (da wir Docker manuell steuern)
        spring.docker.compose.enabled=false
        
        # (Damit Port 8080 für normales Dev frei bleibt)
        server.port=8081
        ```
        
        <aside>
        💡
        
        Das field: `“ddl-auto”` ist extrem wichtig für den neustart der tests. Wenn wir also einen Test-Durchlauf starten und ihn “unclean” beenden, warum auch immer, und einen neuen test starten, würde das field die ganzen tabellen etc. deleten bevor es neue tabellen baut. das heißt wir starten clean rein!
        
        </aside>
        
        <aside>
        💡
        
        Wir verwnenden Anschlussnummer: `“5433”`!
        
        </aside>
        
        <aside>
        💡
        
        Das Backend ist unter: `8081` erreichbar, da wir 8080 für das main backend verwenden!
        
        </aside>