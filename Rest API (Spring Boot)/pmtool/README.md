# Steps to run the React application

## Instructions

-   Ensure that you already have the client id and secret to utiilze login services of Google, Github, Linkedin and set them in `/src/main/resources/application.yml`
-   For ease, install the following mentioned extensions:
    -   Extension Pack for Java
    -   Spring Boot Extension Pack
    -   Reload (natqe)
-   Open the project folder in VS Code and you will also find a `JAVA PROJECTS` tab, from where you can anage the java project just like Eclipse, NetBeans or IntelliJ inside vscode
-   You can run project by clicking the run button (play-like icon) under the `JAVA PROJECTS` tab to start the spring boot server
-   The API is using embedded <u>h2 database</u>, which you can access in browser on `http://localhost:8080/h2` and configure the setttings in `/src/main/resources/application.yml` if needed.
-   Also to use another database, you can change/put your configurations in `/src/main/resources/application.yml` file.
-   After starting the server successfully, the REST API is ready to use and Now you can start the react application server (described as in readme in the another folder) to use the client application
