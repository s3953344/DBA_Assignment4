import { Link, useLocation } from "react-router-dom";
import "./ListingPage.css"

export default function BookingSuccess() {
  const location = useLocation();
  const booking = location.state?.booking;
  const listing = location.state?.listing;

  return (
    <div className="container pt-5">
      <div className="h1 mb-5">Booking successful!</div>
      <div className="p-4 mb-4 shadow">
        <h3>{listing.name}</h3>
        <p>From: {booking.checkIn.toDateString()}</p>
        <p>To: {booking.checkOut.toDateString()}</p>
      </div>
      <Link to="/" className="btn btn-primary">Return to listings</Link>
    </div>
  );
}
