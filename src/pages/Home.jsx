import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import { Navigation } from "swiper/modules";
import ListingComp from "../Components/ListingComp";
export default function Home() {
  const [offerListing, setOfferListing] = useState([]);
  const [rentListing, setRentListing] = useState([]);
  const [saleListing, setSaleListing] = useState([]);
  SwiperCore.use([Navigation]);
  console.log(saleListing);
  useEffect(() => {
    const fetchoffer = async () => {
      try {
        const res = await fetch("/api/listing/get?offer=true&limit=4");
        const data = await res.json();
        setOfferListing(data);
        fetchrent();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchsale = async () => {
      try {
        const res = await fetch("/api/listing/get?type=sale&limit=4");
        const data = await res.json();
        setSaleListing(data);
        console.log(saleListing);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchrent = async () => {
      try {
        const res = await fetch("/api/listing/get?type=rent&limit=4");
        const data = await res.json();
        setRentListing(data);
        fetchsale();
      } catch (error) {
        console.log(error);
      }
    };

    fetchoffer();
  }, []);

  return (
    <div className="">
      {/* top section */}
      <div className="flex flex-col gap-7 p-28 px-3 max-w-6xl mx-auto ">
        <h1 className="text-slate-700 text-3xl lg:text-6xl font-bold">
          Find your next <span className="text-slate-500">perfect</span> place
          with ease
        </h1>
        <div className="text-gray-400 font-xs sm:font-sm">
          Sahand Estate will help you find your home fast,easy and comnfortable.
          <br />
          Our expert support are always available
        </div>
        <Link
          className="text-blue-800 text-xs sm:text-sm hover:underline font-bold"
          to="/search"
        >
          Let's Get Started...
        </Link>
      </div>
      {/* swiper */}
      <Swiper navigation>
        {offerListing &&
          offerListing.length > 0 &&
          offerListing.map((listing) => (
            <SwiperSlide>
              <div
                key={listing._id}
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="h-[500px]"
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>
      {/* listings */}
      <div className="max-w-6xl p-3 py-10 mx-auto flex flex-col gap-8">
        {offerListing && offerListing.length > 0 && (
          <div className="">
            <div className="p-3">
              <h2 className="text-2xl font-semibold text-slate-600 ">
                Recet offers
              </h2>
              <Link
                className="text-blue-800 text-sm hover:underline"
                to="/search?offer=true"
              >
                Show More Offers
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offerListing.map((listing) => (
                <ListingComp key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}
        {rentListing && rentListing.length > 0 && (
          <div className="">
            <div className="p-3">
              <h2 className="text-2xl font-semibold text-slate-600 ">
                Recet places for Rents
              </h2>
              <Link
                className="text-blue-800 text-sm hover:underline"
                to="/search?type=rent"
              >
                Show More places for Rent
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {rentListing.map((listing) => (
                <ListingComp key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}
        {saleListing && saleListing.length > 0 && (
          <div className="">
            <div className="p-3">
              <h2 className="text-2xl font-semibold text-slate-600 ">
                Recent places for Sale
              </h2>
              <Link
                className="text-blue-800 text-sm hover:underline"
                to="/search?type=sale"
              >
                Show More places for Sale
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offerListing.map((listing) => (
                <ListingComp key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
