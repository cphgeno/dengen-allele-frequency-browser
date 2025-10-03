# dengen Allele Frequency Browser

An interactive web application to explore and visualize allele frequencies for the **DenGen project**.

**Note:** This browser relies on the API and database from the **Beacon production implementation**:
https://github.com/EGA-archive/beacon2-pi-api

---

## Table of Contents

1. Features  
2. Architecture & Stack  
3. Installation / Setup  
4. Usage  
5. Data Sources & Format  
6. Configuration & Environment Variables  
7. Deployment  
8. Contributing  
9. License  
10. Contact  

---

## Features

- Interactive allele frequency visualization by genomic variant, region, or gene(s)  
- Filtering and search of variants  
- Responsive UI built with React + Tailwind  
- Relies on the Beacon API and database for allele frequency data  
- Easy integration of new datasets  
- Dockerized setup for reproducibility  

---

## Architecture & Stack

- Frontend: React + Tailwind CSS  
- Backend / API: Beacon 2 API ([GitHub](https://github.com/EGA-archive/beacon2-pi-api))  
- Deployment: Docker & docker-compose support  

---

## Installation / Setup

### Prerequisites

- Node.js (v14+)  
- Yarn (or npm)  
- Docker & docker-compose (optional but recommended)  
- Access to a running Beacon 2 API instance  

### Local Development

1. Clone the repo:

   git clone https://github.com/MauricioMoldes/dengen-allele-frequency-browser.git
   cd dengen-allele-frequency-browser

2. Install dependencies:

   yarn install

3. Configure environment variables:  
   Copy `.env.development.example` to `.env.development` and set the `REACT_APP_API_URL` to your Beacon 2 API instance.

4. Start the dev server:

   yarn start

   The app should open at:  
   http://localhost:3000

5. Run tests:

   yarn test

6. Build for production:

   yarn build

---

## Usage

Once running, you can:

- Browse allele frequencies by genomic variant, region, or gene(s)  
- Filter and search variants  
- Data is fetched dynamically from the Beacon 2 API  

---

## Data Sources & Format

Data comes from the **Beacon production database**. 

---

## Configuration & Environment Variables

Example variables (set in `.env` files):

| Variable              | Example Value                          | Purpose            |
|-----------------------|----------------------------------------|--------------------|
| REACT_APP_BEACON_API     | http://beacon.dengen.dk             | URL of Beacon 2 API |


---

## Deployment

### With Docker

Quick deployment using Docker:

   docker-compose up --build

This will build and start the frontend. Ensure that your Beacon API instance is running and accessible.

---

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository  
2. Create a feature branch:  

   git checkout -b feature-name

3. Commit your changes and push  
4. Submit a Pull Request with a clear description  

Please follow coding style, write tests, and document new features.

---

## License

MIT

---

## Contact

For questions, suggestions, or issues:  

- Author: Mauricio Moldes  
- GitHub Issues: https://github.com/MauricioMoldes/dengen-allele-frequency-browser/issues
