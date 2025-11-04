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
    if (country.length === 1) {
      const lat = country[0].capitalInfo.latlng[0];
      const lon = country[0].capitalInfo.latlng[1];
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
      axios.get(url).then((response) => {
        console.log(response.data);
        setWeather(response.data);
      });
    }
  }, [country]);

  return (
    <div>
      {country.map((country) => (
        <div key={country.name.common}>
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
      ))}
    </div>
  );
};
const Country = ({ country, view }) => {
  if (country) {
    if (country.length > 10) {
      return <div>Too many matches, specify another filter</div>;
    }
    if (country.length > 1) {
      return (
        <div>
          {country.map((c) => (
            <div key={c.name.common}>
              {c.name.common} <button onClick={() => view(c)}>Show</button>{" "}
            </div>
          ))}
        </div>
      );
    }
  }
  return <View country={country} />;
};

function App() {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [viewCountry, setViewCountry] = useState(null);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then((response) => {
        setCountries(response.data);
      });
  }, []);

  useEffect(() => {
    if (viewCountry) {
      const lat = viewCountry.capitalInfo.latlng[0];
      const lon = viewCountry.capitalInfo.latlng[1];
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
      axios.get(url).then((response) => {
        console.log(response.data);
        setWeather(response.data);
      });
    } else {
      setWeather(null);
    }
  }, [viewCountry]);

  // const getCountryToShow = () => {
  //   if (!searchValue) {
  //     return [];
  //   }
  //   const toShow = countries.filter((country) =>
  //     country.name.common.toLowerCase().includes(searchValue.toLowerCase())
  //   );
  //   return toShow;
  // };

  const onSearch = (event) => {
    event.preventDefault();

    const filtered = countries.filter((c) => {
      c.name.common.toLowerCase().includes(searchValue.toLowerCase());
    });

    if (filtered.length > 1 && filtered.length <= 10) {
      setFilteredCountries(filtered);
    } else if (filtered.length === 1) {
      setViewCountry(filtered[0]);
    } else {
      setViewCountry(null);
    }
    // setViewCountry(null);
    // const countriesToShow = getCountryToShow();
    // setFilteredCountries(countriesToShow);
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
      <Country country={filteredCountries} view={viewCountryHandler} />
      <View country={viewCountry ? [viewCountry] : []} />
    </div>
  );
}

export default App;
