import { useEffect, useState } from "react";
import "./HomePage.css";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const API_HOST = "http://localhost:3000";

interface Listing {
  name: string
}

const propertiesList = [
  "",
  "Barcelona",
  "Hong Kong",
  "Istanbul",
  "Kauai",
  "Maui",
  "Montreal",
  "New York",
  "Oahu",
  "Other (Domestic)",
  "Other (International)",
  "Porto",
  "Rio De Janeiro",
  "Sydney",
  "The Big Island",
];
const bedroomsList = ["", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20];

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  // todo: change to match with actual field names
  const [searchResults, setSearchResults] = useState<Listing[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data: any = await axios.get(API_HOST + "/api/data");
        setSearchResults(data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData(e.target as HTMLFormElement);
      const searchParamsString = new URLSearchParams(formData as any).toString();
      const data = await axios.get(API_HOST + "/api/data?" + searchParamsString);
      setSearchResults(data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="home-page container">
      <div className="top-section">
        <form onSubmit={handleSubmit} className="listing-search-form">
          <label className="row">
            Location
            <input
              name="address.market"
              id="location"
              placeholder="For example: Porto"
              required
            />
          </label>
          <div className="row">
            <label className="column">
              Bedrooms
              <select id="bedrooms" name="bedrooms">
                {bedroomsList.map((value) => {
                  return <option value={value}>{value}</option>;
                })}
              </select>
            </label>
            <label className="column">
              Property type
              <select id="propertyType" name="propertyType">
                {propertiesList.map((value) => {
                  return <option value={value}>{value}</option>;
                })}
              </select>
            </label>
          </div>
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>
      </div>

      <div className="bottom-section row">
        {
          isLoading ?
          <p>loading...</p>

          :

          searchResults.map((listing) => {
            return <h2>{listing.name}</h2>
          })
        }

        {
          
        }
      </div>
    </div>
  );
}
