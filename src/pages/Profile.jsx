import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { supabase } from "../supabase";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signoutFailure,
  signoutSuccess,
  signInStart,
  signoutStart,
} from "../redux/user/userSlice";
const Profile = () => {
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileUploadError, setFileUploadError] = useState("");
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateUser, setUpdateUser] = useState(false);
  const [showListingError, setShowListingError] = useState(false);
  const [UserListings, setUserListings] = useState([]);
  const fileRef = useRef(null);
  useEffect(() => {
    if (file) handleFileUpload(file);
  }, [file]);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  console.log(formData);
  const handleFileUpload = async (file) => {
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setFileUploadError("");

    const filename = `${Date.now()}-${file.name}`;

    // Upload directly to Supabase Storage
    const { data, error } = await supabase.storage
      .from("profile photo")
      .upload(filename, file, {
        cacheControl: "3600",
        upsert: true, // overwrite if same filename exists
      });
    console.log(error);
    if (error) {
      if (error.message == "The object exceeded the maximum allowed size") {
        setFileUploadError(
          "Oops! This image is larger than 2 MB. Try a smaller one"
        );
        setUploading(false);
        return;
      }
      setFileUploadError("PLease upload the file with jpeg or png format ");
      setUploading(false);
      return;
    }

    // Get public URL for display
    const { data: publicUrl } = supabase.storage
      .from("profile photo")
      .getPublicUrl(filename);
    console.log(data);
    setFormData((prev) => ({ ...prev, avatar: publicUrl.publicUrl })); //publicUrl.publicUrl is actual link of image
    setUploading(false);
  };
  const handleSubmit = async (e) => {
    try {
      // console.log(currentUser);
      e.preventDefault();
      dispatch(updateUserStart());
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/update/${currentUser._id}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data.user));
      setUpdateUser(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };
  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data);
        dispatch(deleteUserFailure(data.message));
      }
      dispatch(deleteUserSuccess());
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };
  const handleSignOut = async () => {
    try {
      dispatch(signoutStart());
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signout`, {
        credentials: "include",
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(signoutFailure(data.message));
      }
      dispatch(signoutSuccess());
    } catch (error) {
      dispatch(signoutFailure(error.message));
    }
  };
  const handlegetListings = async () => {
    try {
      setShowListingError(false);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/listings/${currentUser._id}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success === false) {
        setShowListingError(true);
        return;
      }
      setUserListings(data);
      // console.log(data);
    } catch (error) {
      setShowListingError(true);
    }
  };
  const handleDeleteListing = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/listing/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(error);
        return;
      }
    } catch (error) {
      console.log(error);
    }
    setUserListings((prev) => prev.filter((listing) => listing._id !== id));
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold py-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          ref={fileRef}
          hidden
          onChange={(e) => setFile(e.target.files[0])}
        />
        <img
          src={
            formData?.avatar ||
            currentUser.avatar ||
            "https://static.vecteezy.com/system/resources/previews/020/911/731/original/profile-icon-avatar-icon-user-icon-person-icon-free-png.png"
          }
          alt="image"
          className="w-24 h-24 rounded-full object-cover cursor-pointer mt-2 self-center"
          onClick={() => fileRef.current.click()}
        />
        {uploading && (
          <div className="text-center text-sm text-gray-600">Uploading...</div>
        )}
        {fileUploadError && (
          <div className="text-sm text-center text-red-600">
            {fileUploadError}
          </div>
        )}
        <input
          type="text"
          placeholder="username"
          id="username"
          className="p-3 rounded-lg bg-white focus:outline-none"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          className="p-3 rounded-lg bg-white focus:outline-none"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="p-3 rounded-lg bg-white focus:outline-none"
          onChange={handleChange}
        />
        <button
          type="submit"
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80 cursor-pointer flex justify-center items-center"
        >
          {/* {loading ? "Loading" : "Update"} */}

          {loading ? (
            <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div> //this dive creates loader symbol
          ) : (
            "Update"
          )}
        </button>
        <Link
          className="bg-green-700 text-white p-3 text-center uppercase hover:opacity-95 rounded-lg"
          to="/create-listing"
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer" onClick={handleDelete}>
          Delete account?
        </span>
        <span className="text-red-700 cursor-pointer" onClick={handleSignOut}>
          Sign out
        </span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-red-700 mt-5">
        {updateUser ? "User is Updated Successfully" : ""}
      </p>
      <button
        onClick={handlegetListings}
        className="text-green-700 text-center w-full"
      >
        Show Listings
      </button>
      <p className="text-red-700 mt-5 text-sm">
        {showListingError ? "Error showing lsitings" : ""}
      </p>
      {UserListings && UserListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl text-center uppercase mt-4 font-semibold">
            Your Listings
          </h1>
          {UserListings.map((listing) => (
            <div
              key={listing._id}
              className="flex justify-between items-center gap-4 rounded-lg p-3 border border-gray-300"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  className="w-16 h-16 rounded-lg object-contain"
                  alt="listing images"
                />
              </Link>
              <Link
                className="font-semibold text-slate-700 text-center truncate flex-1  hover:underline"
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>
              <div className="flex flex-col items-center">
                <button
                  onClick={() => handleDeleteListing(listing._id)}
                  className="text-red-700 uppercase"
                >
                  delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  {" "}
                  <button className="text-green-700 uppercase">edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
