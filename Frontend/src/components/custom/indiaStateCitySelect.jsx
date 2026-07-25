import { useEffect, useRef, useState } from "react";
import { CitySelect, GetState, StateSelect } from "react-country-state-city";

const INDIA_ID = 101;

const parseLocation = (value) => {
  const parts = String(value || "").split(",").map((part) => part.trim()).filter(Boolean);
  if (parts.at(-1)?.toLowerCase() === "india") parts.pop();
  return {
    cityName: parts.length > 1 ? parts[0] : "",
    stateName: parts.length > 1 ? parts[1] : parts[0] || ""
  };
};

export default function IndiaStateCitySelect({
  value = "",
  onChange,
  required = false,
  stateLabel = "State",
  cityLabel = "City / District"
}) {
  const [selectedState, setSelectedState] = useState();
  const [selectedCity, setSelectedCity] = useState();
  const [dropdownRevision, setDropdownRevision] = useState(0);
  const locationSelectRef = useRef(null);

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (!locationSelectRef.current?.contains(event.target)) {
        setDropdownRevision((revision) => revision + 1);
      }
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, []);

  useEffect(() => {
    const { stateName, cityName } = parseLocation(value);
    if (!stateName) return;

    let active = true;
    GetState(INDIA_ID).then((states) => {
      if (!active) return;
      const state = states.find((item) => item.name.toLowerCase() === stateName.toLowerCase());
      if (state) {
        setSelectedState(state);
        setSelectedCity(cityName ? { name: cityName } : undefined);
      }
    });

    return () => {
      active = false;
    };
  }, [value]);

  const selectState = (state) => {
    setSelectedState(state);
    setSelectedCity(undefined);
    onChange("");
    setDropdownRevision((revision) => revision + 1);
  };

  const selectCity = (city) => {
    setSelectedCity(city);
    onChange(`${city.name}, ${selectedState.name}, India`);
    setDropdownRevision((revision) => revision + 1);
  };

  return (
    <div ref={locationSelectRef} className="india-location-grid">
      <div>
        <span className="form-label">{stateLabel}{required ? <span className="ml-1 text-red-600">*</span> : null}</span>
        <StateSelect
          key={`state-${dropdownRevision}`}
          countryid={INDIA_ID}
          onChange={selectState}
          defaultValue={selectedState}
          placeHolder="Select state"
          inputClassName="form-input"
          containerClassName="india-location-dropdown"
        />
      </div>
      <div>
        <span className="form-label">{cityLabel}{required ? <span className="ml-1 text-red-600">*</span> : null}</span>
        <CitySelect
          key={`city-${selectedState?.id || "no-state"}-${dropdownRevision}`}
          countryid={INDIA_ID}
          stateid={selectedState?.id || 0}
          onChange={selectCity}
          defaultValue={selectedCity}
          placeHolder={selectedState ? "Select city / district" : "Select a state first"}
          inputClassName="form-input"
          containerClassName="india-location-dropdown"
          disabled={!selectedState}
          required={required}
        />
      </div>
    </div>
  );
}
