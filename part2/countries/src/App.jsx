import { useState, useEffect } from "react";
import axios from "axios";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const Weather = ({ weather }) => {
  if (!weather) {
    return null;
  }
  const i = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;
  return (
    <div>
      <h2>Weather in {weather.name}</h2>
      <div>Temperature {Math.round(weather.main.temp - 273.15)} Celsius</div>
      <img src={i} alt={weather.weather[0].description} />
      <div>Wind {weather.wind.speed} m/s</div>
    </div>
  );
};

const View = ({ country }) => {
  const [weather, setWeather] = useState(null);
  useEffect(() => {
    if (country) {
      const lat = country.capitalInfo.latlng[0];
      const lon = country.capitalInfo.latlng[1];
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
      axios.get(url).then((response) => {
        setWeather(response.data);
      });
    }
  }, [country]);

  if(!country){
    return
  }

  return (
    <div>
      <h1>{country.name.common}</h1>
      <div>
        Capital <span>{Object.values(country.capital).join(" ")} </span>
      </div>
      <div>Area {country.area}</div>
      <h2>languages</h2>
      <ul>
        {Object.values(country.languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={country.flags.alt} width="150" />
      <Weather weather={weather} />
    </div>
  );
};

const Country = ({ countries, setCountry }) => {
  if (countries) {
    if (countries.length > 10) {
      return <div>Too many matches, specify another filter</div>;
    }
    if (countries.length > 1) {
      return (
        <div>
          {countries.map((c) => (
            <div key={c.name.common}>
              {c.name.common} <button onClick={() => setCountry(c)}>Show</button>{" "}
            </div>
          ))}
        </div>
      );
    }
  }
};

function App() {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [viewCountry, setViewCountry] = useState(null);

  useEffect(() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then((response) => {
        setCountries(response.data);
      });
  }, []);

  const onSearch = (event) => {
    event.preventDefault();
    const filtered = countries.filter((c) => {
      return c.name.common.toLowerCase().includes(searchValue.toLowerCase());
    });

    if (filtered.length > 1 && filtered.length <= 10) {
      setFilteredCountries(filtered);
      viewCountryHandler(null)
    } else if (filtered.length === 1) {
      viewCountryHandler(filtered[0]);
      setFilteredCountries(null)
    } else {
      viewCountryHandler(null);
      setFilteredCountries(null)
    }
  };

  const handleChange = (event) => {
    setSearchValue(event.target.value);
  };

  const viewCountryHandler = (country) => {
    setViewCountry(country);
  };

  return (
    <div>
      <form onSubmit={onSearch}>
        <label>
          find countries
          <input value={searchValue} onChange={handleChange} />
        </label>
      </form>
      { filteredCountries && <Country countries={filteredCountries} setCountry={viewCountryHandler} /> }
      { viewCountry && <View country={viewCountry ? viewCountry : null} /> }
    </div>
  );
}

export default App;
