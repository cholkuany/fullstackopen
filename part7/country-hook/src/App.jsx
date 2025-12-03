import React, { useState, useEffect } from 'react'
import axios from 'axios'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const useCountry = (name) => {
  const [country, setCountry] = useState(null)
  // useEffect(() => {})
  useEffect(() => {
    if(name){
      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`)
        .then((response) => {
          console.log(response.data)
          setCountry(response.data);
        }).catch((error) => {
          setCountry("not found")
        });
    }
  }, [name]);

  return country
}

const Country = ({ country }) => {
  console.log("INSIDE name", country)
  console.log("from (useCountry) call", country)
  if (country === null) {
    return null
  }

  if (country === "not found") {
    return (
      <div>
        not found...
      </div>
    )
  }

  return (
    <div>
      <h3>{country.name.common} </h3>
      <div>capital <span>{Object.values(country.capital).join(" ")} </span> </div>
      <div>population {country.population}</div> 
      <img src={country.flags.png} height='100' alt={`${country.flags.alt}`}/>  
    </div>
  )
}

const App = () => {
  const nameInput = useField('text')
  const [name, setName] = useState('')
  const country = useCountry(name)

  // const [countries, setCountries] = useState([]);

  // useEffect(() => {
  //   axios
  //     .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
  //     .then((response) => {
  //       console.log(response.data)
  //       setCountries(response.data);
  //     });
  // }, []);

  const fetch = (e) => {
    e.preventDefault()
    console.log("NAME INPUT", nameInput.value)
    setName(nameInput.value)
  }

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>
      <Country country={country} />
    </div>
  )
}

export default App