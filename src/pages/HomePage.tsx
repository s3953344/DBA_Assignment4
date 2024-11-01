import { useEffect, useState } from "react";
import "./HomePage.css";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { ThreeDots } from "react-loader-spinner";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";

const API_HOST = "http://localhost:3000";

export interface Listing {
  _id: number;
  name: string;
  summary: string;
  price: {
    $numberDecimal: number;
  };
  review_scores: {
    review_scores_rating: number;
  };
  bedrooms: number;
  property_type: string;
  bookings: Booking[];
  address: {
    market: string;
  };
}

interface Booking {
  _id: string;
  checkIn: Date;
  checkOut: Date;
  email: string;
  name: string;
  phone: string;
  postalAddress: string;
  residentialAddress: string;
}

const propertiesList = [
  "",
  "Aparthotel",
  "Apartment",
  "Barn",
  "Bed and breakfast",
  "Boat",
  "Boutique hotel",
  "Bungalow",
  "Cabin",
  "Camper/RV",
  "Campsite",
  "Casa particular (Cuba)",
  "Castle",
  "Chalet",
  "Condominium",
  "Cottage",
  "Earth house",
  "Farm stay",
  "Guest suite",
  "Guesthouse",
  "Heritage hotel (India)",
  "Hostel",
  "Hotel",
  "House",
  "Houseboat",
  "Hut",
  "Loft",
  "Nature lodge",
  "Other",
  "Pension (South Korea)",
  "Resort",
  "Serviced apartment",
  "Tiny house",
  "Townhouse",
  "Train",
  "Treehouse",
  "Villa",
];
const bedroomsList = ["", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20];

function Listings({ currentListings }: { currentListings: Listing[] }) {
  return (
    <div className="results-list">
      {currentListings.map((listing) => {
        return <ListingCard key={listing._id} listing={listing} />;
      })}
    </div>
  );
}

function SearchForm({
  setCurrSearchParams,
  setIsLoading,
  setError,
  setCurrentPage,
  setTotalCount,
  setSearchResults,
}: {
  setCurrSearchParams: React.Dispatch<React.SetStateAction<string>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<any>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setTotalCount: React.Dispatch<React.SetStateAction<number>>;
  setSearchResults: React.Dispatch<React.SetStateAction<Listing[]>>;
}) {
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const formData = new FormData(e.target as HTMLFormElement);
      const searchParamsString = new URLSearchParams(
        formData as any
      ).toString();
      setCurrSearchParams(searchParamsString);
      const data = await axios.get(
        API_HOST + "/api/data?" + searchParamsString
      );
      setSearchResults(data.data);
      const countResponse: any = await axios.get(
        `${API_HOST}/api/data/count?${searchParamsString}`
      );
      setCurrentPage(0);
      setTotalCount(countResponse.data);
    } catch (err: any) {
      console.log(err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="listing-search-form">
      <label id="search-bar">
        Location
        <input
          name="address.market"
          id="location"
          placeholder="For example: Porto"
          required
        />
      </label>
      <label>
        Bedrooms
        <select id="bedrooms" name="bedrooms">
          {bedroomsList.map((value, index) => {
            return (
              <option key={index} value={value}>
                {value}
              </option>
            );
          })}
        </select>
      </label>
      <label>
        Property type
        <select id="property_type" name="property_type">
          {propertiesList.map((value, index) => {
            return (
              <option key={index} value={value}>
                {value}
              </option>
            );
          })}
        </select>
      </label>
      <button type="submit" className="btn btn-primary">
        Search
      </button>
    </form>
  );
}

function SearchResults() {}

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>("");
  const [currSearchParams, setCurrSearchParams] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Listing[]>([]);
  const [itemOffset, setItemOffset] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const itemsPerPage = 8; // Number of items per page

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response: any = await axios.get(
          `${API_HOST}/api/data?limit=${itemsPerPage}`
        );
        setSearchResults(response.data);
        const countResponse: any = await axios.get(
          `${API_HOST}/api/data/count`
        );
        setTotalCount(countResponse.data);
      } catch (err: any) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data: any = await axios.get(
          `${API_HOST}/api/data?offset=${itemOffset}&limit=${itemsPerPage}&${currSearchParams}`
        );
        setSearchResults(data.data);
      } catch (err: any) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [itemOffset]);

  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event.selected * itemsPerPage) % totalCount;
    setItemOffset(newOffset);
    setCurrentPage(event.selected);
    console.log(`Clicked page ${event.selected} which is offset ${newOffset}`);
  };

  return (
    <div className="home-page container">
      <div className="top-section"></div>
      <SearchForm
        setCurrSearchParams={setCurrSearchParams}
        setIsLoading={setIsLoading}
        setError={setError}
        setCurrentPage={setCurrentPage}
        setTotalCount={setTotalCount}
        setSearchResults={setSearchResults}
      />
      <div className="container bottom-section row">
        {
          <div>
            <p>Found {totalCount} results</p>
            <ReactPaginate
              nextLabel="next >"
              onPageChange={handlePageClick}
              pageRangeDisplayed={2}
              pageCount={Math.ceil(totalCount / itemsPerPage)}
              previousLabel="< previous"
              renderOnZeroPageCount={null}
              containerClassName="pagination"
              pageClassName="pagination-item"
              pageLinkClassName="pagination-link"
              activeClassName="active"
            />
            {
              isLoading ? (
                <div className="loading d-flex flex-column align-items-center">
                  <i>Loading listings. This may take a few seconds.</i>
                  <ThreeDots
                    visible={true}
                    height="80"
                    width="80"
                    color="#4fa94d"
                    radius="9"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                  />
                </div>
              ) : error ? (
                // Render error message if error occurred
                <div>
                  {error.code === "ERR_NETWORK" && (
                    <p>
                      Could not connect to server. Are you sure you ran it? Use the
                      command "node ./src/server/server.js" from the root folder to
                      connect to MongoDB.
                    </p>
                  )}
                  <i>{error.toString()}</i>
                </div>
              ) : searchResults.length === 0 ? (
                <p>No results found... Try changing your search options!</p>
              ) : (
                <Listings currentListings={searchResults} />
              )
            }
          </div>
        }
      </div>
    </div>
  );
}

function ListingCard({ listing }: { listing: Listing }) {
  const price = listing.price.$numberDecimal;
  const rating = listing.review_scores.review_scores_rating;

  return (
    <div className="listing-card pt-5">
      <Link to={"listing/" + listing._id}>
        <h3>{listing.name}</h3>
      </Link>
      <p>{listing.summary}</p>

      <div className="listing-stats">
        <b>Location:</b>{" "}
        <p>{listing.address.market ? listing.address.market : "N/A"}</p>
        <b>Daily price:</b> <p>${price ? price : "N/A"}</p>
        <b>Customer rating:</b> <p>{rating ? rating : "N/A"}</p>
        <b>Property Type:</b>{" "}
        <p>{listing.property_type ? listing.property_type : "N/A"}</p>
        <b>Bedrooms:</b> <p>{listing.bedrooms ? listing.bedrooms : "N/A"}</p>
      </div>
    </div>
  );
}
