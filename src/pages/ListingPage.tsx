import axios from "axios";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { valDateInFuture } from "./BookingValidation";
import { Listing } from "./HomePage";
import "./ListingPage.css";

const API_HOST = "http://localhost:3000";

export type Booking = {
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
    getValues,
    reset,
  } = useForm<Booking>({
    mode: "onChange",
    // defaultValues: {
    //   name: "DEFAULT",
    //   email: "DEFAULT@gmail.com",
    //   phone: "0000000000",
    //   postalAddress: "DEFAULT",
    //   residentialAddress: "DEFAULT",
    // },
    resetOptions: { keepIsValid: true },
  });
  const [formSubmitErr, setFormSubmitErr] = useState<string>("");

  const currentDate = new Date();

  const onSubmit: SubmitHandler<Booking> = (data) => {
    setFormSubmitErr("");
    // reset();
    try {
      // Send the data and the listing id
      axios.post(API_HOST + "/api/data", {
        data: data,
        listingId: listing?._id,
      });
      navigate("/bookingsuccess", { state: { booking: data, listing } });
    } catch (err) {
      console.log("error!!");
      setFormSubmitErr(
        "Form submission failed. Are you sure the server is running? Make sure to run 'npm run mongo' in the root directory.\n" +
          err
      );
    }
  };

  // initial loading in data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await axios.get(API_HOST + "/api/data/" + id!.toString());
        // if (!data.data.bookings) { data.data.bookings = [] }
        setListing(data.data);
      } catch (err) {
        console.log(err);
        // navigate("/error");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="listing-page container p-4">
      <div className="row mb-3 px-5 mt-3">
        <Link to="/">{"<"} Home</Link>
      </div>
      <div className="row">
        <div className="col px-5">
          <h1 className="mb-3">{listing?.name}</h1>
          <p>{listing?.summary}</p>
          <div className="d-flex justify-content-evenly mb-3">
            <span><b>Daily rate: </b>${listing?.price.$numberDecimal}</span>
            <span>
              <b>Customer rating: </b>{listing?.review_scores.review_scores_rating}
            </span>
          </div>
          <h2>Bookings</h2>
          {/* ###### BOOKINGS ####### */}
          <div className="row bookings shadow p-3">
            {listing?.bookings === undefined
              ? <p>No bookings yet!</p>
              : listing?.bookings.map((booking, index) => {
                  const checkIn = new Date(booking.checkIn);
                  // Only display bookings that are after today
                  if (checkIn >= currentDate) {
                    return (
                      <div className="booking">
                        <h5>Booking {index + 1}</h5>
                        <div className="d-flex gap-5">
                          <p>
                            Start: {new Date(booking.checkIn).toDateString()}
                          </p>
                          <p>
                            End: {new Date(booking.checkOut).toDateString()}
                          </p>
                        </div>
                      </div>
                    );
                  } else {
                    return null;
                  }
                })}
          </div>
        </div>

        <div className="col px-5">
          <form
            className="booking-form shadow d-flex flex-column gap-1 p-3"
            onSubmit={handleSubmit(onSubmit)}
          >
            <h3>Booking Details</h3>
            <div className="two-column-grid">
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
                      inBeforeOut: (date: Date) =>
                        date >= getValues().checkIn
                          ? true
                          : "Check out must be after check in day",
                    },
                  })}
                />
                <span>{errors.checkOut?.message?.toString()}</span>
              </label>
            </div>
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
            <div className="two-column-grid">
              <label>
                Email address
                <input
                  {...register("email", {
                    required: requiredErrMsg,
                    pattern: {
                      // a regex found online for email validation (https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript)
                      value:
                        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                      message: "Please enter a valid email address",
                    },
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
                      message: "Please enter a valid phone number",
                    },
                  })}
                />
                <span>{errors.phone?.message?.toString()}</span>
              </label>
            </div>
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
            <button type="submit">
              Submit
            </button>
            <span>{formSubmitErr}</span>
          </form>
        </div>
      </div>
    </div>
  );
}
