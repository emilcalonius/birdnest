# 🦆 Birdnest Radar 🦆

[![TypeScript](https://badgen.net/badge/icon/typescript?icon=typescript&label)](https://typescriptlang.org)
[![Vue](https://img.shields.io/badge/vue-3.2-brightgreen.svg)](https://vuejs.org/)

## About The Project

Application for monitoring drone traffic near the nest of an endangered bird species and keeping track of pilots violating the no drone zone around the nest. 
Simulated drone positions are fetched from an external API maintained by Reaktor. Violations are persisted in the backend for 10 minutes.

### Structure

- Node.js backend API with endpoints for getting drones, violations and pilots
- Vue.js frontend

## Usage

Test the application here: https://calonius.me/birdnest 

**OR**  

### Run the application locally

1. Clone this repository
2. Start the backend:
    - Navigate to ``./backend``
    - Install dependencies with ``npm i``
    - Start the server with ``npm run start``
3. Start the frontend:
    - Navigate to ``./frontend``
    - Install dependencies with ``npm i``
    - Set the backend host in the ``.env`` file
    - Start the application in development mode with ``npm run dev``