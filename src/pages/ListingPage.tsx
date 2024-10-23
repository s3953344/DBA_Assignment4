import axios from "axios";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
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

type Inputs = {
  checkIn: Date,
}

const requiredErrMsg = "This field is required";

export default function ListingPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [listing, setListing] = useState<Listing>();
  const { register, handleSubmit, formState: {errors} } = useForm();

  const onSubmit: SubmitHandler<Inputs> = data => console.log(data);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await axios.get(API_HOST + "/api/data/" + id!.toString());
        console.log(data);
        if (data.data === null) {
          navigate("/error");
        }
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

      <form
        onSubmit={handleSubmit((data) => {
          console.log(data);
        })}
      >
        <label>
          Check in
          <input type="date" {...register("checkIn", {required: requiredErrMsg, valueAsDate: true})} />
          <span>{errors.checkIn?.message?.toString()}</span>
        </label>

        <button type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}
