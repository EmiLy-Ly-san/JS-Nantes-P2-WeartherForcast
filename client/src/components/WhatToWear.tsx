import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { NavLink } from "react-router-dom";
import "../WhatToWear.css";
import weatherConditions from "../assets/APIWeatherConditions";
import tempRanges from "../assets/Temps";
import type { OutletContextProps } from "../types/whatToWear";
import type { WeatherConditionImagesProps } from "../types/whatToWear";
import type { WeatherTempImagesProps } from "../types/whatToWear";
import type { weatherConditionItemProps } from "../types/whatToWear";
import type { wtwProps } from "../types/whatToWear";

function WhatToWear(props: wtwProps) {
  const clothingPref = useOutletContext<OutletContextProps>().clothingPref;
  const [tempRange, setTempRange] = useState("cool");
  const city = useOutletContext<OutletContextProps>().city;

  // REORDER EXTERNAL ARRAY AND DEFINE IMAGE URLS TO DISPLAY - WEATHER CONDITIONS
  const weatherConditionImages: WeatherConditionImagesProps = {};

  for (const condition of weatherConditions) {
    for (const id of condition.id) {
      weatherConditionImages[id] = condition.imgSrc;
    }
  }
  //  FIND TEMERATURE RANGE (ie: warm, very warm, cool, etc.)
  useEffect(() => {
    function findTemperatureRange(tempIn: string, tempPref: string) {
      const prefRealFeel = Number.parseInt(tempIn) + Number.parseInt(tempPref);
      for (const range of tempRanges) {
        if (prefRealFeel >= range.start && prefRealFeel <= range.end) {
          setTempRange(range.temp);
          break;
        }
      }
    }
    findTemperatureRange(props.tempMax, clothingPref.warmthPref);
  }, [props.tempMax, clothingPref.warmthPref]);

  // REORDER EXTERNAL ARRAY AND DEFINE IMAGE URLS TO DISPLAY - TEMPERATURE RANGE

  const weatherTempImages: WeatherTempImagesProps = {};
  for (const condition of tempRanges) {
    weatherTempImages[condition.temp] = condition.imgSrc;
  }

  // SET WEATHER ITEM
  const weatherConditionItems: weatherConditionItemProps = {};
  for (const condition of weatherConditions) {
    for (const id of condition.id) {
      weatherConditionItems[id] = condition.item;
    }
  }

  // SET URLS TO VARIABLES
  const imageUrls = weatherConditionImages[props.conditID];
  const tempUrls = weatherTempImages[tempRange];
  const weatherItem = weatherConditionItems[props.conditID];

  // DISPLAY ELEMENTS
  return (
    <div className="wtw-mother-div animated-section">
      {/* Title */}
      <h3 className="wtw-title">What to Wear</h3>

      <p className="wtw-text-description">
        Today in {city} it will be {tempRange} with {props.conditions}. Don't
        forget your {weatherItem}
      </p>
      <nav>
        <p>
          {" "}
          <NavLink to="/WhatToWearMore" className="wtw-more-button">
            more...
          </NavLink>
        </p>
      </nav>

      {/* DISPLAY OF CLOTHING RECOMMENDATIONS DEPENDING ON WEATHER CONDITIONS - need to use map*/}
      <figure className="wtw-images">
        <section>
          {imageUrls.map((el: string) => (
            <img
              key={el}
              src={el}
              alt="weather conditions icon"
              className="wtw-icons"
            />
          ))}
        </section>
        <section>
          {tempUrls.map((el: string) => (
            <img
              key={el}
              src={el}
              alt="temperature conditions icon"
              className="wtw-icons"
            />
          ))}
        </section>
      </figure>
    </div>
  );
}

export default WhatToWear;
