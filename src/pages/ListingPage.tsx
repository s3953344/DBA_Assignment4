import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_HOST = "http://localhost:3000";

interface Listing {
  _id: number;
  name: string;
  summary: string;
  price: number;
  "review_scores.review_scores_rating": number;
  bedrooms: number;
  propertyType: string;
}

export default function ListingPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [listing, setListing] = useState<Listing>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await axios.get(API_HOST + "/api/data/" + id!.toString());
        console.log(data);
        if (data.data === null) { navigate("/error") }
        setListing(data.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container">
      <h1>{listing?.name}</h1>
      <p>{listing?.summary}</p>
    </div>
  );
}
