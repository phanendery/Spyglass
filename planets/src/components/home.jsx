import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Planet from "./planet";
import styled from "styled-components";
import backgroundImage from "../assets/background.png";

const AppContainer = styled.div`
  position: relative;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  z-index: 1;
`;

const BackgroundImage = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${backgroundImage});
  background-size: cover;
  background-position: center;
  z-index: -1;
`;

const Header = styled.h1`
  font-size: 2.5rem;
  font-family: "Comfortaa", cursive;
  color: #fff;
`;

const PlanetContainer = styled.div`
  display: flex;
  margin-top: 40px;
`;

const SearchContainer = styled.div`
  background: white;
`;

export default function Home() {
  const [planets, setPlanets] = useState([]);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  // Should have used a loading state, but I didn't have time to implement it

  // Fetching all planets because the call is only 60 right now. If it was more, I would handle this differently.
  useEffect(() => {
    console.log("hitting here");
    async function fetchPlanets() {
      try {
        const response = await fetch("https://swapi.dev/api/planets/");
        const data = await response.json();
        const allPlanets = await Promise.all(
          data.results.map(async (planet) => {
            const planetId = extractPlanetId(planet.url);
            const residents = await fetchResidents(planet.residents);
            return { id: planetId, ...planet, residents };
          })
        );
        const planetsObject = allPlanets.reduce((acc, planet) => {
          acc[planet.name] = planet;
          return acc;
        }, {});
        setPlanets(planetsObject);
      } catch (error) {
        console.error("Error fetching planets:", error);
      }
    }

    fetchPlanets();
  }, []);

  //Fetching only the resident name for each Planet so I can map all the data to one object
  async function fetchResidents(residentUrls) {
    const residents = await Promise.all(
      residentUrls.map(async (url) => {
        try {
          const response = await fetch(url);
          const data = await response.json();
          return data.name;
        } catch (error) {
          console.error("Error fetching resident:", error);
          return null;
        }
      })
    );

    return residents.filter((resident) => resident !== null);
  }

  //Made this just for extracting the ID from the url part of the object, again not the most efficient way but it works
  const extractPlanetId = (url) => {
    const idRegex = /\/(\d+)\/$/;
    const match = url.match(idRegex);
    if (match) {
      return match[1];
    }
    return null;
  };

  const planetNames = Object.keys(planets);
  const handleEvent = (e, value) => {
    setSelectedPlanet(value);
  };

  return (
    <AppContainer>
      <BackgroundImage />
      <Container>
        <Header>Explore the Universe!</Header>
        <SearchContainer>
          <Autocomplete
            disablePortal
            id="planet-select"
            options={planetNames}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label="Search Planet" />
            )}
            onChange={handleEvent}
          />
        </SearchContainer>
        {selectedPlanet && (
          <PlanetContainer>
            <Planet planet={planets[selectedPlanet]} />
          </PlanetContainer>
        )}
      </Container>
    </AppContainer>
  );
}
