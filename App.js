
import './App.css';
import './weather.css';
import './Navbar.css';
import './SignInPage.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Link, Switch, Routes } from 'react-router-dom';
import AboutPage from './Components/AboutPage';
import ContactUs from './Components/ContactUs';
import LoginPage from './Components/LoginPage';
import SignInPage from './Components/SignInPage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudSun, faHome, faInfoCircle, faEnvelope, faUser, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';
import ReactDOMServer from 'react-dom/server'; 

function App(){
  const api_key = 'e5696804616843488f484931231705';
  const [query, setQuery] = useState('Pune');
  const [weather, setWeather] = useState({});
  const [loginData, setLoginData] = useState(null);
  const [signinData, setSigninData] = useState(null);
  const [showAboutModal, setShowAboutModal] = useState(false); // Added state for showing AboutPage modal
  const [isContactModalOpen, setContactModalOpen] = useState(false);



  const handleLogin = (email, password) => {
    setLoginData({ email, password });
    // Perform login logic here
    // You can make an API call to validate the credentials or handle the login state as per your requirements
  };

  const receiveLoginData = (event) => {
    setLoginData(event.data);
  };
  window.addEventListener('message', receiveLoginData);

  const getWeather = async (location) => {
    try {
      if (location) {
        const res = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${api_key}&q=${encodeURIComponent(
            location
          )}&days=7`
        );
        if (res.ok) {
          const weatherData = await res.json();
          // Set timezone information in the state
          setWeather({
            ...weatherData,
            timezone: weatherData.location.tz_id,
          });
        } else {
          console.error('Error fetching weather data:', res.status);
        }
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };
  

  const convertToLocalTime = (utcTime, timezone) => {
    const localTime = new Date(utcTime);
    const options = {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
    };
    return localTime.toLocaleTimeString([], options);
  };
  
  
  const getLocalTime = () => {
    const localTimezone = weather.location?.tz_id;
    const localTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: localTimezone,
    });
    return localTime;
  };

  const getIndianTime = () => {
    const indianTimezone = 'Asia/Kolkata';
    const indianTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: indianTimezone,
    });
    return indianTime;
  };
  
  useEffect(() => {
    getWeather(query);
  }, [query]);


  
  useEffect(() => {
    console.log('Weather Data:', weather);
  }, [weather]);
  
  // const handleOpenModal = () => {
  //   setShowModal(true);
  // };

  // const handleCloseModal = () => {
  //   setShowModal(false);
  // };

  const handleSearch = () => {
    setQuery(query); // This is optional, only if you want to update the state with the current query value
    getWeather(query);
  };
  
  

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const handleAboutClick = () => {
    setShowAboutModal(true);
  };

  const handleLoginClick = () => {
    // Serialize the LoginPage component to a string
    const loginPageContent = ReactDOMServer.renderToString(<LoginPage />);
    const popupContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Login Page</title>
      </head>
      <body>
        <div class="popup-hidden-url">
          ${loginPageContent}
        </div>
      </body>
      </html>
    `;
  
    // Create a Blob URL and open it in a new popup window
    const blob = new Blob([popupContent], { type: 'text/html' });
    const popupWindow = window.open(URL.createObjectURL(blob), '_blank', 'width=400,height=400');
  };

  
const handleSigninClick = (e) => {
  e.preventDefault();

  // Serialize the SignInPage component to a string
  const signinPageContent = ReactDOMServer.renderToString(<SignInPage />);
  const popupContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Sign In Page</title>
    </head>
    <body>
      <div class="popup-hidden-url">
        ${signinPageContent}
      </div>
    </body>
    </html>
  `;

  // Create a Blob URL and open it in a new popup window
  const blob = new Blob([popupContent], { type: 'text/html' });
  const popupWindow = window.open(URL.createObjectURL(blob), '_blank', 'width=400,height=400');
};  

  const getImageUrl = (conditionCode) => {
    // Add your own image URLs for different weather conditions
    switch (conditionCode) {
      case 1000: // Clear
        return 'https://www.masslive.com/resizer/RM_TjyWF-8MJmwHNv-IYPXxD6sw=/1280x0/smart/advancelocal-adapter-image-uploads.s3.amazonaws.com/image.masslive.com/home/mass-media/width2048/img/weather_impact/photo/clear-sky-483f5bddb1ba1dd0.jpg';
      case 1003: // mist
        return 'https://igx.4sqi.net/img/general/600x600/23075894_sWoGpu7caMmY6J0-LBXa4qhQrFXk7dG3jwKsWAOAYRc.jpg';
      case 1006: // Cloudy
        return 'https://4.bp.blogspot.com/-Z6l-fRd30Nw/UcmzqmZhJlI/AAAAAAAAmJg/Piy90qoEvaw/s1600/Rain+Photography+9.jpg';
      case 1189: // Rain
        return 'https://www.vmcdn.ca/f/files/via/images/weather/rain-umbrella-vancouver-weather.jpg;w=960,jpg';
      case 1192: // partly clouds
        return 'https://sicbp.com/media/Design%20Files/Action/Weather.jpg';
      case 1195: // Moderate rain
        return 'https://cornwallfreenews.com/wp-content/uploads/2012/09/water-rain-web-701x468.jpg';
      case 1198: // overcast
        return 'https://live.staticflickr.com/65535/48857309833_a198573a1c.jpg';
      default:
        return 'https://wallpapercave.com/wp/wg4qgvh.jpg';
    }

  }
  return (
    <Router>
      
      <div className="navbar">
  <div className="left-nav">
  <h3 className="weather-app-heading">
      <FontAwesomeIcon icon={faCloudSun} /> Weather-App
    </h3>
    <ul className="custom-nav">
      <li>
        <Link to="/" className="navbar-normal-button">
          <FontAwesomeIcon icon={faHome} /> Home
        </Link>
      </li>
      <li>
        <Link to="/about" className="navbar-normal-button">
          <FontAwesomeIcon icon={faInfoCircle} /> About
        </Link>
      </li>
      <li>

      <Link to="/contact" className="navbar-normal-button" onClick={() => setContactModalOpen(true)}>
              <FontAwesomeIcon icon={faEnvelope} /> Contact
            </Link>
      </li>
    </ul>
   </div>
          <div className="right-nav">
          <button className="navbar-normal-button" onClick={handleLoginClick}>
            <FontAwesomeIcon icon={faUser} /> Login
          </button>

          <div className="right-nav">
           <button className="navbar-normal-button" onClick={handleSigninClick}>
            <FontAwesomeIcon icon={faSignInAlt} /> SignIn
           </button>
         </div>
       </div>
     </div>
        <div className="container-fluid px-1 px-md-4 py-5 mx-auto">
          <div className="row d-flex justify-content-center px-3">
            <input
              onChange={handleQueryChange}
              value={query}
              type="text"
              className="w-50 form-control"
              placeholder="Enter Your City"
            />
            <button
              type="button"
              className="btn btn-primary ml-3"
              placeholder="Search"
              onClick={handleSearch}
              style={{ marginLeft: '10px', width: '70px' }}
            >
              Search
            </button>
          </div>
        <div className="row d-flex justify-content-center px-3">
          
           {Object.keys(weather).length > 0 ? ( // Check if weather data exists before rendering the card
  <div className="card" style={{ backgroundImage: `url(${getImageUrl(weather.current?.condition?.code)})` }}>
    <div>
      <h2 style={{ fontSize: '34px' }}> {weather.location.name}</h2>
      <p style={{ fontSize: '21px' }}>
        <strong>Condition:</strong> {weather.current.condition.text}
      </p>
      <p style={{ fontSize: '21px' }}>
        <strong>Temperature:</strong> {weather.current.feelslike_c}&#176;C
      </p>
    </div>

    <div className="time-and-date right-corner">
      <p className="time-style">Local Time: {convertToLocalTime(weather.location.localtime, weather.location.tz_id)}</p>
      <p className="date-style">
        Indian Time: {getIndianTime()}
        <br />
        {new Date(weather.location.localtime).toDateString()}
      </p>
    </div>
  </div>
) : (
  <div className="card">
    <h2 className="m-auto">Please Enter a Valid Location</h2>
  </div>
)}


<div className="container">
  <div className="row">
    {weather.forecast &&
      weather.forecast.forecastday.map((day, index) => ( // Map over all the days in the forecast
        <div className="col-md-4" key={index}>
          <div className="weather-box">
            <h5>
              {new Date(day.date).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </h5>
            <p>{day.day.condition.text}</p>
            <p>High: {day.day.maxtemp_c}&deg;C</p>
            <p>Low: {day.day.mintemp_c}&deg;C</p>
          </div>
        </div>
      ))}
  </div>
</div>

<div className="container">
  <div className="row">
    {weather.forecast &&
      weather.forecast.forecastday.map((day, index) => ( // Map over all the days in the forecast
        <div className="col-md-4" key={index}>
          <div className="weather-box">
            <h5>
              {new Date(day.date).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </h5>
            <p>{day.day.condition.text}</p>
            <p>High: {day.day.maxtemp_c}&deg;C</p>
            <p>Low: {day.day.mintemp_c}&deg;C</p>
          </div>
        </div>
      ))}
  </div>
</div>

<div className="main-container">
        {/* Your main content goes here */}
      </div>

      <footer className="footer">
        <div className="footer-content">
          <p>
            Weather data provided by WeatherAPI.com
          </p>
          <p>
            Contact: contact@example.com
          </p>
          <p>
            <a href="/privacy-policy">Privacy Policy</a> | <a href="/terms-of-service">Terms of Service</a>
          </p>
          <p>
            Follow us on <a href="https://twitter.com/weatherapp">Twitter</a> and <a href="https://www.facebook.com/weatherapp">Facebook</a>
          </p>
        </div>
      </footer>
      {showAboutModal && <AboutPage closeModal={() => setShowAboutModal(false)} />}
        </div>
      </div>
      <Modal isOpen={isContactModalOpen} onRequestClose={() => setContactModalOpen(false)}>
        <ContactUs onClose={() => setContactModalOpen(false)} />
      </Modal>
      
      <Routes>
        {/* <Route exact path="/" component={HomePage} /> */}
        <Route exact path="/about" component={AboutPage} /> 
          <Route exact path="/contact" component={ContactUs} />
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/signin" component={SignInPage} />
      </Routes>
     
    </Router>
  );
              }   
                   
export default App;