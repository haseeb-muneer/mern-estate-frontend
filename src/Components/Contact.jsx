import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");
  useEffect(() => {
    try {
      const fetchLandlord = async () => {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/${listing.useRef}`, { credentials: "include" });
        const data = await res.json();
        if (data.success === false) {
          console.log(data.message);
        }
        console.log(data);
        setLandlord(data);
      };
      fetchLandlord();
      console.log(landlord);
    } catch (error) {
      console.log(error);
    }
  }, [listing.useRef]);
  return (
    <>
      {landlord && (
        <div className=" flex flex-col gap-2">
          <p className="">
            Contact <span className="font-semibold">{landlord.username}</span>{" "}
            for{" "}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            rows="2"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter Message for Landlord..."
            className="w-full rounded-lg border border-slate-300 p-3 bg-white"
          ></textarea>
          <Link
            to={`mailto:${landlord.email}?subject=Regarding:${listing.name}&body=${message}`}
            className="w-full text-center bg-slate-700 text-white rounded-lg p-3 hover:opacity-95"
          >
            Conatct Landlord
          </Link>
        </div>
      )}
    </>
  );
}
