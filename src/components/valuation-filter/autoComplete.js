import React, { useState, useRef, useEffect } from "react";
import "./Autocomplete.css";

const Autocomplete = ({ suggestions, propEdgeLocationId, updateProjectId }) => {
  const [inputValue, setInputValue] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const [dropdownStyle, setDropdownStyle] = useState({});
  const [projectList, setProjectList] = useState([]);

  const getDropDownlist = (data) => {
    fetch(
      "https://crmpapsrv.propequity.in/ICICI_PriceAnalytics.svc/GetProjectList",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic aWNpY2ktcHJpY2UtYW5hbHl0aWNzLWF1dGg6QzU0Qzc0RTQtQjVBQy00Q0ZGLUJBMzktODZBRUY4OEI3QzM2",
          Accept: "application/json",
        },
        body: JSON.stringify({
          LocationId: propEdgeLocationId,
          SearchText: data,
          userCredential: {
            ClientName: "ICICIPriceAnalytics",
            Password: "AC61B268-2EEF-408F-89CC-E5C46532AB5D",
          },
        }),
      },
    )
      .then((res) => {
        return res.json();
      })
      .then((respoonse) => {
        setProjectList(respoonse.ProjectList);
      })
      .catch((error) => {
        setProjectList([]);
      });
  };

  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    getDropDownlist(value);
    if (value) {
      const filtered = suggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(value.toLowerCase()),
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleClick = (suggestion, projectId) => {
    setInputValue(suggestion);
    setFilteredSuggestions([]);
    setShowSuggestions(false);
    updateProjectId({ projectName: suggestion, projectId: projectId });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setInputValue(filteredSuggestions[activeSuggestionIndex]);
      setActiveSuggestionIndex(0);
      setShowSuggestions(false);
    } else if (e.key === "ArrowUp") {
      if (activeSuggestionIndex === 0) {
        return;
      }
      setActiveSuggestionIndex(activeSuggestionIndex - 1);
    } else if (e.key === "ArrowDown") {
      if (activeSuggestionIndex + 1 === filteredSuggestions.length) {
        return;
      }
      setActiveSuggestionIndex(activeSuggestionIndex + 1);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownStyle({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [inputValue]);
  return (
    <div className="autocomplete-container">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        ref={inputRef}
        className="autocomplete-input"
      />
      {showSuggestions && inputValue && (
        <ul className="suggestions-dropdown" style={dropdownStyle}>
          {projectList || [].length > 0 ? (
            projectList.map((suggestion, index) => {
              let className =
                index === activeSuggestionIndex ? "suggestion-active" : "";
              return (
                <li
                  key={suggestion}
                  className={className}
                  onClick={() =>
                    handleClick(suggestion.ProjectName, suggestion.ProjectId)
                  }
                >
                  {suggestion.ProjectName}
                </li>
              );
            })
          ) : (
            <li className="no-suggestions">No suggestions available</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;
