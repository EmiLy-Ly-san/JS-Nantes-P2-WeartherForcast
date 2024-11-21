import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import PrecipitationForecast from "../components/PrecipitationForcast";
import WhatToWear from "../components/WhatToWear";
import type CityOutletContextType from "../types/Outletcontext";
import "../style/Today.css";
import emptyHeart from "../assets/icons/emptyheart.png";
import whiteHeart from "../assets/icons/white-heart.png";
import { getBackground } from "../utilitiesFunctions/getBackground";

function Today() {
  const outletContext = useOutletContext<CityOutletContextType>();
  const [skyState, setSkyState] = useState("");
  const [temperature, setTemperature] = useState<number>();
  const [realFeel, setRealFeel] = useState<number>();
  const [description, setDescription] = useState("");
  const [isFav, setFav] = useState(false);

  const handleClick = () => {
    setFav((currentFav) => !currentFav); /* 🆕 A chaque fois que je clique sur mon bouton, je dis que je veux setter la valeur de menu open a l'inverse de sa valeur courante grace a !currentMenuOpen. La fonction dans le set State prend en
    parametre la valeur courante (currentMenuOpen -> donnee fournit par useState) au moment de mon setState. Cette facon de faire est la facon LAZY qui permet de setter le state de facon decaler 
    (on lui dot d'attendre d'avoir terminer sa derniere operation),evitant des conflits si un utilisateur fait plein de clic tres vite */
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (outletContext.city) {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${outletContext.city}&appid=4e41f328e6b4fcf670b66844921c47d8&units=metric`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          setSkyState(data.weather[0].icon);
          setTemperature(Math.round(data.main.temp));
          setRealFeel(Math.round(data.main.feels_like));
          setDescription(data.weather[0].main);
          if (description)
            getBackground(description, outletContext.setBackground);
        })
        .catch((err) => console.error(err));
    }
  }, [outletContext.city]);

  const today = new Date();
  const dateOfToday = today.toLocaleDateString("fr-FR");

  return (
    <>
      <section className="today-comp animated-section">
        <div className="circle-container">
          <svg className="circle-1" height="30rem" width="30rem">
            <title>animationCircles</title>
            <defs>
              <linearGradient id="my-gradient">
                <stop offset="30.2%" stopColor="#572a6d" />
                <stop offset="49.7%" stopColor="#e67226" />
                <stop offset="57.1%" stopColor="#ecc36d" />
                <stop offset="67.4%" stopColor="#6bb3d6" />
              </linearGradient>
            </defs>
            <circle
              className="circle1-stroke animation-circles"
              stroke="url(#my-gradient)"
              strokeWidth="15px"
              strokeLinecap="round"
              r="130px"
              cx="50%"
              cy="50%"
              fill="transparent"
            />
          </svg>
          <div
            className="cadran-content"
            style={{
              backgroundColor: `${outletContext.colorCircle}`,
            }}
          >
            <h2 className="your-city">{outletContext.city}</h2>
            <div className="state-temp">
              <figcaption>
                <img
                  src={`http://openweathermap.org/img/wn/${skyState}@2x.png`}
                  alt="symbole de l'état du ciel"
                />
              </figcaption>
              <h3 className="temperature">{temperature}°</h3>
            </div>
            <div className="real-feel">Feel like : {realFeel}°</div>
            <div className="date">{dateOfToday}</div>
            <button type="button" className="fav-button" onClick={handleClick}>
              <img
                className="fav-icon"
                src={isFav ? emptyHeart : whiteHeart}
                alt=""
              />
            </button>
          </div>
        </div>
      </section>
      <PrecipitationForecast />
      <WhatToWear />
    </>
  );
}
export default Today;
