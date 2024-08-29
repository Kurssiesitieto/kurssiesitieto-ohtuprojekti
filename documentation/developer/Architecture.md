# 17.4.2024 Architecture of the program
```mermaid
flowchart TD
    subgraph Frontend
    AA["StartPage"]
    AA --> J["LoginButton"]
    J --> A["MainPage"]
    A --> R[NavBar]
    A --> B["CourseGraph"]
    R --> C["DegreeSelectionMenu"]
    R --> D["SearchBar"]
    R --> E["InfoButton"]
    E --> F["InfoBox"]
    A --> G["SideBar"]
    G --> H["CourseDescription"]
    R --> O["LogoutButton"]
    R --> P["AddStudyPlansButton"]
    R --> S["AddPrerequisites"]
    P --> Q["AddStudyPlans"]
    end

    subgraph Router
    I(("Router"))
    A -."/api/degrees".->I
    C -."/api/degrees/search_by_degree".-> I
    D -."/api/courses/databaseGetCourses".-> I
    H -."/api/kori/search_by_name".-> I
    Q -."/api/degrees/create_studyplan".-> I
    S -."/api/courses/addCourseToStudyplan".-> I
    I --> L[MiddleWare]
    end

    subgraph Backend
    L --"/api/degrees"--> K
    L --"/api/degrees/search_by_degree"--> K
    L --"/api/courses/databaseGetCourses"--> K
    L --"/api/degrees/create_studyplan" --> K
    L --"/api/kori/search_by_name"--> M
    K["db/index"]
    M[KoriInterface]
    end
```
Router node encapsulates backend/index.js and all routes files.

The dotted lines describe axios calls. The starting point of these lines are where the action starts. Most will call a function from mainpage or courseGraph to actually do the axios call.

## On Startup
When the application starts up it runs executeSchemaFile() which ensures that the database has all the correct tables. It also runs insertDataFromJson() which adds the contents of degreeToDb.json into the database. In this process it checks all the courses with KORI API. It checks that the courses exist and adds matching GroupId and Name to them.

## On load
On page load the frontend asks backend for the first degree in the database. This degree is shown on the default screen.
