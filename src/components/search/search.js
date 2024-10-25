// src/components/search/search.js

import React, { useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";

// Predefined list of cities
const cities = [
  { value: "28.6139 77.2090", label: "Delhi, IN" },
  { value: "19.0760 72.8777", label: "Mumbai, IN" },
  { value: "13.0827 80.2707", label: "Chennai, IN" },
  { value: "12.9716 77.5946", label: "Bangalore, IN" },
  { value: "22.5726 88.3639", label: "Kolkata, IN" },
  { value: "17.3850 78.4867", label: "Hyderabad, IN" },
];

const Search = ({ onSearchChange }) => {
  const [search, setSearch] = useState(null);

  const loadOptions = async (inputValue) => {
    // Filter cities based on the input value
    const filteredCities = cities.filter((city) =>
      city.label.toLowerCase().includes(inputValue.toLowerCase())
    );

    // Return the filtered options
    return {
      options: filteredCities,
    };
  };

  const handleOnChange = (searchData) => {
    setSearch(searchData);
    onSearchChange(searchData);
  };

  return (
    <AsyncPaginate
      placeholder="Search for city"
      debounceTimeout={600}
      value={search}
      onChange={handleOnChange}
      loadOptions={loadOptions}
    />
  );
};

export default Search;
