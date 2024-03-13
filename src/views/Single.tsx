import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MediaItemWithOwner } from '../types/DBTypes';
import Likes from '../components/Likes';
import Comments from '../components/Comments';
import { useMedia } from '../hooks/graphQLHooks';
import { useUserContext } from '../hooks/ContextHooks';

const Single = () => {

  const { state } = useLocation();
  const { user } = useUserContext();
  const navigate = useNavigate();
  const item: MediaItemWithOwner = state;
  const { postRating, getRatingsByMediaID } = useMedia();

  // Only userRating is needed
  const [userRating, setUserRating] = useState<number>(0); // For the input slider

  useEffect(() => {
    if (item.media_id) {
      getRatingsByMediaID(item.media_id.toString()).then((rating) => {
        if (rating) {
          setUserRating(rating);
        }
      });
    }
  }, [item.media_id, getRatingsByMediaID]);

  const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserRating(parseInt(e.target.value, 10));
  };

  const submitRating = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Authentication required');
        return;
      }
      await postRating(item.media_id, userRating, token); // Use userRating for submission
      alert('Rating submitted successfully');
      // Consider re-fetching the rating here if it needs to be updated after submission
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Failed to submit rating');
    }
  };


  return (
    <>
      <h3>{item.title}</h3>
      {item.media_type.includes('video') ? (
        <video controls src={item.filename}></video>
      ) : (
        <img src={item.filename} alt={item.title} />
      )}
      <Likes item={item} />
    {/* Conditional rendering based on the user being the owner or an admin */}
    {user && (Number(user.user_id) === Number(item.user_id) || user.level_name === 'Admin') && (
               <div>
               <label>
                 Rate this item:
                 <input type="range" min="0" max="10" value={userRating} onChange={handleRatingChange} />
                 <span> {userRating}</span> {/* Displaying the user's set rating value */}
               </label>
               <button onClick={submitRating}>Submit Rating</button>
             </div>
      )}
      {/* Display the fetched average or specific rating for all viewers */}
      <span> {userRating || "Not rated yet"}</span>
      {/* Rest of the component */}
      <p>{item.description}</p>
      <p>
        Uploaded at: {new Date(item.created_at).toLocaleString('fi-FI')}, by: {item.owner.username}
      </p>
      {/* <p>{item.filesize}</p> */}
      <p>{item.media_type}</p>
      <button
        onClick={() => {
          navigate(-1);
        }}
      >
        go back
      </button>
      <Comments item={item} />
    </>
  );
};

export default Single;
