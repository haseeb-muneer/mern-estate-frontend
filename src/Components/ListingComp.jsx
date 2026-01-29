import React from "react";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
export default function ListingComp({ listing }) {
  return (
    <div className="bg-white rounded-lg  shadow-md hover:shadow-lg transition-shadow overflow-hidden w-full sm:w-[330px]">
      <Link to={`/listing/${listing._id}`} className="flex flex-col gap-4">
        <img
          src={listing.imageUrls[0]}
          alt="listing image"
          className="w-full h-[320px] sm:h-[220px] object-cover hover:scale-105 transition-scale duration-300"
        />
        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="text-lg font-semibold text-slate-700 truncate">
            {listing.name}
          </p>
          <div className="flex items-center gap-1">
            <MdLocationOn className="text-green-700 h-4 w-4" />
            <p className="text-gray-600 truncate text-sm">{listing.address}</p>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">
            {listing.description}
          </p>
          <p className="mt-2 text-slate-500 font-semibold ">
            $
            {listing.offer
              ? listing.discountPrice.toLocaleString("en-US")
              : listing.regularPrice.toLocaleString("en-US")}{" "}
            {""}
            {listing.type === "rent" && " / month"}
          </p>
          <div className="text-gray-700 flex items-center gap-4">
            <div className="text-xs font-bold">
              {listing.bedrooms} {listing.bedrooms > 1 ? "beds" : "bed"}
            </div>
            <div className="text-xs font-bold">
              {listing.bathrooms} {listing.bathrooms > 1 ? "baths" : "bath"}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
