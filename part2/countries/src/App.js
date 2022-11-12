import {useEffect, useState} from "react"
import axios from "axios"

const api_key = process.env.REACT_APP_API_KEY


const View = ({country}) => {
  const [temp, setTemp] = useState("")
  const [wind, setWind] = useState("")
  const [icon, setIcon] = useState("")

  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${country.capital}&limit=1&appid=${api_key}`
  useEffect(()=> {axios.get(url).then((response)=> ([response.data[0].lat, response.data[0].lon])).then(
    ([lat, lon]) => axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${
      api_key}`)).then((response)=> {console.log(response.data);setTemp(response.data.main.temp); setWind(
        response.data.wind.speed); setIcon(response.data.weather[0].icon)})}, [])


  return (
    <div>
    <p> Capital {country.capital} </p> 
    <p> Area {country.area} </p>
    <p> Languages: </p>
    <ul> {country.languages.map((language)=> (<li> {language.name} </li>))} </ul>
    <p> Flag </p>
    <img src={country.flags.svg} height={150} width={250} />
    <p> Weather </p>
    <p> Temperature is {temp} degrees Celsius. </p>
    <p> Wind speed is {wind} m/s. </p>
    <img src= {`http://openweathermap.org/img/wn/${icon}@2x.png`}/>
    </div>
  )
}
  

const Countries = ({filter, countries}) => {
  const [country, setCountry] = useState({})
  const [countryOverride, setOverride] = useState(false)
  const [lastFilter, setFilter] = useState("")


  // const getCountryView = (country)  => {


  // } >
  //    show </button> </div>) 
  // }
  // if filter length > 1, show everything. 
  // 
  if ((filter!= lastFilter) && countryOverride) {
    setOverride(false);
  }
  const filtered = countries.filter((country)=> country.name.includes(filter))
  if (filtered.length === 0){
    return (<p>No countries match your search.</p>)
  }
  if (filtered.length > 10) {
    return (<p> Too many matches, specify another filter.</p>)
  } 
  if (filtered.length > 1) { 
    return ((countryOverride) && (filter === lastFilter))? <View country = {country}/> : 
      filtered.map((country) => (<div> 
        <p> {country.name} </p>
        <button onClick = {(e) => {setCountry(country); setOverride(true); setFilter(filter)}}> show</button> </div>))   
  } if (filtered.length === 1) {
    return <View country = {filtered[0]}/>
    
  }
}

function App() {
  const [filter, setFilter] = useState("")
  const [countries, setCountries] = useState([])

  function getText(e){
    setFilter(e.target.value)
  }
  

  useEffect(()=> {
    axios.get("https://restcountries.com/v2/all").then(
   (r) => {setCountries(r.data); console.log("d", countries)})
}, [])

  return (
    <div> <p> find countries </p> 
    <input type="text" onChange={getText} value = {filter} />
    <Countries filter={filter} countries={countries} />
    </div>
  )
}

export default App;
