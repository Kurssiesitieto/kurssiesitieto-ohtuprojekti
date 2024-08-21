# Course Prerequisite visualization tool
![example workflow](https://github.com/Kurssiesitieto/kurssiesitieto-ohtuprojekti/actions/workflows/staging.yml/badge.svg)
[![codecov](https://codecov.io/gh/Kurssiesitieto/kurssiesitieto-ohtuprojekti/graph/badge.svg?token=DPW7GY90EK)](https://codecov.io/gh/Kurssiesitieto/kurssiesitieto-ohtuprojekti)

![Alt Text](https://github.com/Kurssiesitieto/kurssiesitieto-ohtuprojekti/blob/main/documentation/images/banner.gif)

This project is a web application designed to help students plan their studies by showcasing hierarchical relations between different courses. The app is built with React and Vite with the aim of creating intuitive and interactive way to visualize the relations between different courses. The project fetches course data from Sisu and will later take advantage of University of Helsnki login to fetch students personal data to help students further plan their studies. 

This project is part of Software engineering course in University of Helsinki (Ohjelmistoprojekti TKT20007)

[Link to the visualization tool](https://shibboleth.ext.ocp-test-0.k8s.it.helsinki.fi/esitieto) (username: esitieto, password: esitieto007)

# Table of Contents
- [Prerequisite course visualization tool](#course-prerequisite-visualization-tool)
- [Table of Contents](#table-of-contents)
- [Documentation](#documentation)
- [Project links](#project-links)
- [Quickstart](#quickstart)
  - [Downloading](#downloading)
  - [Installation](#installation)
  - [Setting up env](#setting-up-env)
  - [Running the program locally](#running-the-program-locally)

# Documentation
- [Definition of done](https://github.com/Kurssiesitieto/kurssiesitieto-ohtuprojekti/blob/main/documentation/definition-of-done.md)
- [Roles for the meetings](https://github.com/Kurssiesitieto/kurssiesitieto-ohtuprojekti/blob/main/documentation/roles-for-the-meetings.md)
- [For developers](https://github.com/Kurssiesitieto/kurssiesitieto-ohtuprojekti/blob/main/documentation/readme.md)

# Project links
- [Backlog](https://github.com/orgs/Kurssiesitieto/projects/2)
- [Timesheet](https://docs.google.com/spreadsheets/d/1vvUljnH17TXNOLkz6lFW4YPMWOk6QO8IYzd4c9X_hcw/edit?pli=1#gid=743230294)
- [Minutes of meetings](https://github.com/Kurssiesitieto/kurssiesitieto-ohtuprojekti/blob/main/documentation/meetings.md)

## Quickstart

### Downloading
Run the following command in the terminal:
```bash
git clone git@github.com:Kurssiesitieto/kurssiesitieto-ohtuprojekti.git
```
### Installation
Run the following command in root directory:

```bash
npm install
```
Installs the required dependencies on both frontend and backend

### Setting up .env

Set up .env file in project root. Follow [this](https://github.com/Kurssiesitieto/kurssiesitieto-ohtuprojekti/blob/main/documentation/developer/setting-up-env.md) guide for the required variables.

### Running the program locally

Running the program in development mode:

```bash
npm run dev 
```
To run the program in production mode, you need to execute the following two commands:

```bash
npm run build 
npm run prod
```

Runs the app on http://localhost:3000/


Where does the application go on it's day off? nowhere the application can't walk silly.
