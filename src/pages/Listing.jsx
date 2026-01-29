import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import { useSelector } from "react-redux";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import Contact from "../Components/Contact";
SwiperCore.use([Navigation]);
export default function Listing() {
  const { currentUser } = useSelector((state) => state.user);
  const [copy, setCopy] = useState(false);
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [contact, setContact] = useState(false);
  useEffect(() => {
    setLoading(true);
    setError(false);
    const fetchListing = async () => {
      try {
        const id = params.listingId;
        const res = await fetch(`/api/listing/get/${id}`);
        const data = await res.json();
        console.log(data);

        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        console.log(listing);
        setError(false);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
      setError(false);
    };
    fetchListing();
  }, [params.listingId]);
  return (
    <main>
      {loading && <p className="text-2xl text-center ">Loading...</p>}
      {error && <p className="text-2xl text-center ">Something Went Wrong!</p>}
      <div>
        {listing && !error && !loading && (
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[350px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
        <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex items-center justify-center bg-slate-100 border-slate-300 cursor-pointer">
          <FaShare
            className="text-slate-500"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setCopy(true);
              setTimeout(() => {
                setCopy(false);
              }, 2000);
            }}
          />
        </div>
        {copy && (
          <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
            Link Copied!
          </p>
        )}
        {listing && (
          <div className="flex gap-4 flex-col max-w-4xl mx-auto p-3 my-7">
            <p className="text-2xl font-semibold">
              {listing.name} -${" "}
              {listing.offer
                ? (
                    +listing.regularPrice - +listing.discountPrice
                  ).toLocaleString("en-US")
                : listing.regularPrice.toLocaleString("en-US")}
              {listing.type === "rent" && " / month"}
              {listing.offer && (
                <span className="p-3 text-sm text-slate-400 line-through decoration-red-500 decoration-2">
                  {listing.regularPrice}
                </span>
              )}
            </p>
            <p className="flex items-center mt-6 gap-2 text-slate-600 text-sm">
              <FaMapMarkedAlt className="text-green-700" />
              {listing.address}
            </p>
            <div className="flex gap-4 ">
              <p className="bg-red-900 text-white w-full max-w-[200px] p-1 text-center rounded-md">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listing.offer && (
                <p className="bg-green-900 text-white w-full max-w-[200px] p-1 text-center rounded-md">
                  ${listing.discountPrice} discount
                </p>
              )}
            </div>
            <p className="text-slte-700">
              <span className="font-semibold text-black">Description - </span>{" "}
              {listing.description}
            </p>
            <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaBed className="text-lg" />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds`
                  : `${listing.bedrooms} bed`}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaBath className="text-lg" />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths`
                  : `${listing.bathrooms} bath`}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaParking className="text-lg" />
                {listing.parking ? `Parking Spot` : `No parking`}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaChair className="text-lg" />
                {listing.furnished ? `Furnished` : `UnFurnished`}
              </li>
            </ul>
            {currentUser && currentUser._id !== listing.useRef && !contact && (
              <button
                onClick={() => setContact(true)}
                className="bg-slate-700 rounded-lg p-3 text-white"
              >
                Contact landlord
              </button>
            )}
            {contact && <Contact listing={listing} />}
          </div>
        )}
      </div>
    </main>
  );
}
