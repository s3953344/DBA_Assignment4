import { Link, useLocation } from "react-router-dom";

export default function BookingSuccess() {
  const location = useLocation();
  const booking = location.state?.booking;
  const listing = location.state?.listing;

  return (
    <div className="container">
      <div className="h1 mb-5">Booking successful!</div>
      <h3>{listing.name}</h3>
      <p>From: {booking.checkIn.toDateString()}</p>
      <p>To: {booking.checkOut.toDateString()}</p>
      <Link to="/">Return to listings</Link>
    </div>
  )
}