import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingComp from "../Components/ListingComp";
export default function Search() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState();
  console.log(listings);
  const [sideBarData, setSideBarData] = useState({
    searchTerm: "",
    offer: false,
    parking: false,
    furnished: false,
    order: "desc",
    sort: "created_at",
    typr: "all",
  });
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");
    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSideBarData({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }
    const fetchlisting = async () => {
      setShowMore(false);
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      setListings(data);
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setLoading(false);
    };
    fetchlisting();
  }, [location.search]);
  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSideBarData({ ...sideBarData, type: e.target.id });
    }
    if (e.target.id === "searchTerm") {
      setSideBarData({ ...sideBarData, searchTerm: e.target.value });
    }
    if (
      e.target.id === "offer" ||
      e.target.id === "parking" ||
      e.target.id === "furnished"
    ) {
      setSideBarData({
        ...sideBarData,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }
    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";
      const order = e.target.value.split("_")[1] || "desc";
      setSideBarData({ ...sideBarData, sort, order });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sideBarData.searchTerm);
    urlParams.set("offer", sideBarData.offer);
    urlParams.set("parking", sideBarData.parking);
    urlParams.set("furnished", sideBarData.furnished);
    urlParams.set("order", sideBarData.order);
    urlParams.set("sort", sideBarData.sort);
    urlParams.set("type", sideBarData.type);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  const handleShowMore = async () => {
    const NumberofListings = listings.length;
    const startIndex = NumberofListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };
  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen border-slate-300">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <input
              value={sideBarData.searchTerm}
              onChange={handleChange}
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="p-3 rounded-lg w-full border border-slate-300 bg-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Type:</label>
            <div className="flex gap-2 flex-wrap">
              <input
                type="checkbox"
                id="all"
                className="w-5"
                checked={sideBarData.type === "all"}
                onChange={handleChange}
              />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={sideBarData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                checked={sideBarData.type === "sale"}
                onChange={handleChange}
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                checked={sideBarData.offer}
                onChange={handleChange}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Amenities:</label>
            <div className="flex gap-2 flex-wrap">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                checked={sideBarData.parking}
                onChange={handleChange}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                checked={sideBarData.furnished}
                onChange={handleChange}
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort</label>
            <select
              className="p-3 bg-white border border-slate-300 rounded-lg"
              id="sort_order"
              onChange={handleChange}
              defaultValue="created_at_desc"
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button className="p-3 bg-slate-700 rounded-lg uppercase text-slate-200 hover:opacity-95% font-semibold">
            Search
          </button>
        </form>
      </div>
      <div className="flex-1">
        <h1 className="text-3xl text-slate-700 mt-5 font-semibold border-b border-slate-300 p-3 w-full">
          Listing results:
        </h1>
        <div className="flex flex-wrap gap-4 p-7">
          {!loading && listings.length === 0 && (
            <p className="text-xl text-slate-700">No listings found!</p>
          )}
          {loading && (
            <p className="text-xl text-slate-700 text-center w-full">
              Loading...
            </p>
          )}
          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingComp key={listing._id} listing={listing} />
            ))}
        </div>
        {showMore && (
          <button
            className="text-green-700 hover:underline text-center w-full p-7 "
            onClick={handleShowMore}
          >
            Show More
          </button>
        )}
      </div>
    </div>
  );
}
