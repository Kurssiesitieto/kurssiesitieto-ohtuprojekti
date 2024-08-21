# Unit Testing

We use Jest to do unit testing for backend and Vitest for frontend, and agreed to place the unit tests in the same locations as the files that are being tested by them. These tests are also part of the CI/CD.

Something to keep in mind, there may be difficulties in testing the APIs used by this project, as they are managed separately by other people outside of this project. We did not come across any limitations when we developed the project, but it should be noted that we also did not involve automated tests that fetched external information (Except for cypress, which was not part of CI/CD)!

# E2E Testing

We use Cypress to handle E2E testing, and agreed to place them in a more centralized locations unlike the unit tests. These are not part of any CI/CD and were run manually.

# REST

The project has some REST queries provided that can be used to quickly user test functionalities using the REST Client (Extension in VSCode), you may or may not find it handy. You can find the existing ones [here](https://github.com/Kurssiesitieto/kurssiesitieto-ohtuprojekti/tree/main/rest)

# Automation

The project uses GitHub Actions for automated testing. The tests are run on every push to the GitHub repository. The coverage report of the tests is also uploaded to CodeCov after the tests are completed.

If the tests are passing, GitHub Actions pushes the new version of the program to the staging OpenShift server.
