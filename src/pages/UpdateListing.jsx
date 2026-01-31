import React from "react";
import { useState } from "react";
import { supabase } from "../supabase";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
export default function CreateListing() {
  const params = useParams();
  const [files, setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    bedrooms: 1,
    bathrooms: 1,
    furnished: false,
    parking: false,
    regularPrice: 50,
    discountPrice: 10,
    type: "rent",
    offer: false,
  });
  useEffect(() => {
    const fetchListing = async () => {
      const id = params.listingId;
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/listing/get/${id}`);
      const data = await res.json();
      if (data.seccess === false) {
        console.log(data.message);
      }
      setFormData(data);
    };
    fetchListing();
  }, []);
  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }
    if (
      e.target.id === "name" ||
      e.target.id === "address" ||
      e.target.id === "description"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }
    if (e.target.type === "number") {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
    console.log(formData);
  };

  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setUploading(false);
          console.log(formData);
        })
        .catch((error) => {
          console.log(error);
          setImageUploadError("Image Upload Failed (2MB max per img)");
          setUploading(false);
        });
      setImageUploadError(false);
      console.log(promises);
    } else {
      setImageUploadError("You can only Upload 6 img per listing");
      setUploading(false);
    }
  };
  const storeImage = (file) => {
    return new Promise(async (resolve, reject) => {
      if (!file) {
        return reject("File is not provided");
      }
      const filename = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from("profile photo")
        .upload(filename, file);
      if (error) {
        return reject(error.message);
      }
      const { data: publicUrl } = supabase.storage
        .from("profile photo")
        .getPublicUrl(filename);
      console.log(publicUrl);
      return resolve(publicUrl.publicUrl);
    });
  };
  const handleRemoveImg = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.discountPrice > formData.regularPrice)
        return setError("Discount Price is less then Orignal Price");
      setLoading(true);
      if (formData.imageUrls.length < 1)
        return setError("You must upload at least 1 image");
      setError(false);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/listing/update/${params.listingId}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, useRef: currentUser._id }),
      });
      setLoading(false);
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setError(data.message);
      }
      console.log(data);
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setLoading(false);
      setError(error.message);
      console.log(error);
    }
  };
  return (
    <main className="p-3 max-w-4xl mx-auto ">
      <h1 className="text-3xl font-semibold text-center my-7">
        Update a Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className=" flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="name"
            id="name"
            maxLength="62"
            minLength="10"
            required
            className="bg-white p-3 rounded-lg"
            onChange={(e) => handleChange(e)}
            value={formData.name}
          />
          <textarea
            type="text"
            placeholder="description"
            id="description"
            required
            className="bg-white p-3 rounded-lg"
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="address"
            id="address"
            required
            className="bg-white p-3 rounded-lg"
            onChange={handleChange}
            value={formData.address}
          />

          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="sale"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="rent"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={formData.parking}
                type="checkbox"
                className="w-5"
                id="parking"
              />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
                id="furnished"
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={formData.offer}
                type="checkbox"
                className="w-5"
                id="offer"
              />
              <span>Offer</span>
            </div>
            <div className="flex flex-wrap gap-6 ">
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  id="bedrooms"
                  min="1"
                  max="10"
                  className="p-3 bg-white rounded-lg  border border-gray-300"
                  required
                  onChange={handleChange}
                  value={formData.bedrooms}
                />
                <p>Beds</p>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  id="bathrooms"
                  min="1"
                  max="10"
                  className="p-3 bg-white rounded-lg  border border-gray-300"
                  required
                  onChange={handleChange}
                  value={formData.bathrooms}
                />
                <p>Baths</p>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  id="regularPrice"
                  min="50"
                  max="100000"
                  className="p-3 bg-white rounded-lg  border border-gray-300"
                  required
                  onChange={handleChange}
                  value={formData.regularPrice}
                />
                <div className="flex flex-col items-center">
                  <p>Regular Price</p>
                  <span className="text-xs">($ / month)</span>
                </div>
              </div>
              {formData.offer && (
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    id="discountPrice"
                    min="0"
                    max="1000000"
                    className="p-3 bg-white rounded-lg border border-gray-300"
                    required
                    onChange={handleChange}
                    value={formData.discountPrice}
                  />
                  <div className="flex flex-col items-center">
                    <p>Discounted Price</p>
                    <span className="text-xs">($ / month)</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 flex-1 ">
          <p className="font-semibold">
            images:
            <span className="font-normal text-gray-700 ml-2">
              The first image will be the cover (max 6).
            </span>
          </p>
          <div className="flex gap-4">
            <input
              className="p-3 w-full border border-gray-300  rounded"
              type="file"
              id="images"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(e.target.files)}
            />
            <button
              type="button"
              disabled={uploading}
              onClick={handleImageSubmit}
              className="p-3 border border-gray-300 text-gray-700 hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading" : "Upload"}
            </button>
          </div>
          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div className="flex justify-between items-center p-3" key={url}>
                <img
                  src={url}
                  alt="listing image"
                  className="w-20 h-20 rounded"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImg(index)}
                  className="border border-gray-300 uppercase hover:opacity-55 p-3"
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            type="Submit"
            disabled={uploading || loading}
            className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "UPDATING..." : "UPDATE LISTING"}
          </button>
          <p className="text-red-700 text-sm">{error && error}</p>
        </div>
      </form>
    </main>
  );
}
