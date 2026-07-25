import { useEffect, useMemo, useState } from "react";
import { GetCity, GetState } from "react-country-state-city";

const INDIA_ID = 101;
let statesPromise;

const loadStates = () => {
  statesPromise ??= GetState(INDIA_ID);
  return statesPromise;
};

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
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedStateId, setSelectedStateId] = useState("");
  const [selectedCityName, setSelectedCityName] = useState("");
  const parsedLocation = useMemo(() => parseLocation(value), [value]);

  // Load the options for new/empty forms too. Previously states were only
  // fetched while restoring an existing location, leaving new forms empty.
  useEffect(() => {
    let active = true;

    loadStates()
      .then((items) => {
        if (active) setStates(Array.isArray(items) ? items : []);
      })
      .catch(() => {
        if (active) setStates([]);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!parsedLocation.stateName) return;

    let active = true;

    loadStates().then((items) => {
      if (!active) return;
      setStates(Array.isArray(items) ? items : []);
      const matchingState = items.find(
        (item) => item.name.toLowerCase() === parsedLocation.stateName.toLowerCase()
      );
      setSelectedStateId(matchingState ? String(matchingState.id) : "");
      setSelectedCityName(matchingState ? parsedLocation.cityName : "");
    });

    return () => {
      active = false;
    };
  }, [parsedLocation]);

  useEffect(() => {
    if (!selectedStateId) {
      setCities([]);
      return;
    }

    let active = true;
    GetCity(INDIA_ID, Number(selectedStateId)).then((items) => {
      if (active) setCities(items);
    });

    return () => {
      active = false;
    };
  }, [selectedStateId]);

  const selectState = (event) => {
    setSelectedStateId(event.target.value);
    setSelectedCityName("");
    onChange("");
  };

  const selectCity = (event) => {
    const cityName = event.target.value;
    const state = states.find((item) => String(item.id) === selectedStateId);
    setSelectedCityName(cityName);
    onChange(cityName && state ? `${cityName}, ${state.name}, India` : "");
  };

  return (
    <div className="india-location-grid">
      <label>
        <span className="form-label">
          {stateLabel}{required ? <span className="ml-1 text-red-600">*</span> : null}
        </span>
        <select
          className="form-input"
          value={selectedStateId}
          onChange={selectState}
          required={required}
        >
          <option value="">Select state</option>
          {states.map((state) => (
            <option key={state.id} value={state.id}>{state.name}</option>
          ))}
        </select>
      </label>
      <label>
        <span className="form-label">
          {cityLabel}{required ? <span className="ml-1 text-red-600">*</span> : null}
        </span>
        <select
          className="form-input"
          value={selectedCityName}
          onChange={selectCity}
          disabled={!selectedStateId}
          required={required}
        >
          <option value="">{selectedStateId ? "Select city / district" : "Select a state first"}</option>
          {cities.map((city) => (
            <option key={city.id ?? city.name} value={city.name}>{city.name}</option>
          ))}
        </select>
      </label>
    </div>
  );
}
