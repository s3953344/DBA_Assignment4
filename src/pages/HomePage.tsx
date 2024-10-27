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
  propertyType: string;
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

function Listings({ currentListings, totalCount }: { currentListings: Listing[], totalCount: number }) {
  return (
    <div className="results-list">
      {currentListings.map((listing) => {
        return <ListingCard key={listing._id} listing={listing} />;
      })}
    </div>
  );
}

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
        const response: any = await axios.get(`${API_HOST}/api/data?limit=${itemsPerPage}`);
        console.log(response);
        setSearchResults(response.data);
        const countResponse: any = await axios.get(`${API_HOST}/api/data/count`);
        console.log(countResponse);
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
        const data: any = await axios.get(`${API_HOST}/api/data?offset=${itemOffset}&limit=${itemsPerPage}&${currSearchParams}`);
        setSearchResults(data.data);
        const countResponse: any = await axios.get(`${API_HOST}/api/data/count?${currSearchParams}`)
        setTotalCount(countResponse.data);
      } catch (err: any) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [itemOffset]);

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
    } catch (err: any) {
      console.log(err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageClick = (event: {selected: number}) => {
    // TODO: add actual count func
    const newOffset = (event.selected * itemsPerPage) % 5555;
    setItemOffset(newOffset);
    setCurrentPage(event.selected);
    console.log(`Clicked page ${event.selected} which is offset ${newOffset}`);
  };

  return (
    <div className="home-page container">
      <div className="top-section">
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
                return <option key={index} value={value}>{value}</option>;
              })}
            </select>
          </label>
          <label>
            Property type
            <select id="propertyType" name="property_type">
              {propertiesList.map((value, index) => {
                return <option key={index} value={value}>{value}</option>;
              })}
            </select>
          </label>
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>
      </div>

      <div className="container bottom-section row">
        {isLoading ? (
          <div className="loading">
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
              initialPage={currentPage}
            />
            <Listings currentListings={searchResults} totalCount={totalCount} />
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
              initialPage={currentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function ListingCard({ listing }: { listing: Listing }) {
  const price = listing.price.$numberDecimal;
  const rating = listing.review_scores.review_scores_rating;

  return (
    <div className="listing-card">
      <Link to={"listing/" + listing._id}>
        <h3>{listing.name}</h3>
      </Link>
      <p>{listing.summary}</p>
      <p>
        <b>Location:</b>{" "}
        {listing.address.market ? listing.address.market : "N/A"}
      </p>
      <p>
        <b>Daily price:</b> ${price ? price : "N/A"}
      </p>
      <p>
        <b>Customer rating:</b> {rating ? rating : "N/A"}
      </p>
      <p>
        <b>Property Type:</b> {listing.propertyType ? listing.propertyType : "N/A"}
      </p>
      <p>
        <b>Bedrooms:</b> {listing.bedrooms ? listing.bedrooms : "N/A"}
      </p>
    </div>
  );
}
