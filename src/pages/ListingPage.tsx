import axios from "axios";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { valDateInFuture } from "./BookingValidation";

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
  checkIn: Date;
  checkOut: Date;
  name: string;
  email: string;
  phone: string;
  postalAddress: string;
  residentialAddress: string;
};

const requiredErrMsg = "This field is required";

export default function ListingPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [listing, setListing] = useState<Listing>();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data);
    // console.log({...data, listingId: id });
    // axios.post("/api/data", {...data, listingId: id });
  };

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
      <div className="row">
        <div className="col">
          <h1>{listing?.name}</h1>
          <p>{listing?.summary}</p>
        </div>
        <div className="col">
          <form className="d-flex flex-column"
            onSubmit={handleSubmit(onSubmit)}
          >
            <h3>Booking Details</h3>
            <label>
              Check in
              <input
                type="date"
                {...register("checkIn", {
                  required: requiredErrMsg,
                  valueAsDate: true,
                  validate: {
                    valDateInFuture,
                  },
                })}
              />
              <span>{errors.checkIn?.message?.toString()}</span>
            </label>
            <label>
              Check out
              <input
                type="date"
                {...register("checkOut", {
                  required: requiredErrMsg,
                  valueAsDate: true,
                  validate: {
                    valDateInFuture,
                    inBeforeOut: (date: Date) => date > getValues().checkIn ? true : "Check in date must set be before the check out date",
                  },
                })}
              />
              <span>{errors.checkOut?.message?.toString()}</span>
            </label>
            <h3>Your Details</h3>
            <label>
              Your name
              <input
                {...register("name", {
                  required: requiredErrMsg,
                })}
              />
              <span>{errors.name?.message?.toString()}</span>
            </label>
            <label>
              Email address
              <input
                {...register("email", {
                  required: requiredErrMsg,
                  pattern: {
                    // a regex found online for email validation (https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript)
                    value: /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: "Please enter a valid email address"
                  }
                })}
              />
              <span>{errors.email?.message?.toString()}</span>
            </label>
            <label>
              Phone number
              <input
                {...register("phone", {
                  required: requiredErrMsg,
                  pattern: {
                    // a regex found online (https://stackoverflow.com/questions/22378736/regex-for-mobile-number-validation)
                    value: /^(\+\d{1,3}[- ]?)?\d{10}$/,
                    message: "Please enter a valid phone number"
                  }
                })}
              />
              <span>{errors.phone?.message?.toString()}</span>
            </label>
            <label>
              Postal address
              <input
                {...register("postalAddress", {
                  required: requiredErrMsg,
                })}
              />
              <span>{errors.postalAddress?.message?.toString()}</span>
            </label>
            <label>
              Residential address
              <input
                {...register("residentialAddress", {
                  required: requiredErrMsg,
                })}
              />
              <span>{errors.residentialAddress?.message?.toString()}</span>
            </label>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}
