import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MediaItemWithOwner, Tag } from '../types/DBTypes';
import Likes from '../components/Likes';
import Comments from '../components/Comments';
import { useMedia } from '../hooks/graphQLHooks';
import { useUserContext } from '../hooks/ContextHooks';

const Single = () => {

  const { state } = useLocation();
  const { user } = useUserContext();
  const navigate = useNavigate();
  const item: MediaItemWithOwner = state;
  const { postRating, getRatingsByMediaID, fetchTags, assignTagToMediaItem, fetchTagsByMediaId  } = useMedia();
  const [selectedTag, setSelectedTag] = useState<string>(''); // State for selected tag
  const [tags, setTags] = useState<string[]>([]);
  const [currentTags, setCurrentTags] = useState<Tag[]>([]);


  // Only userRating is needed
  const [userRating, setUserRating] = useState<number>(0); // For the input slider

  useEffect(() => {
    const fetchTagsData = async () => {
      const tags = await fetchTags();
      setTags(tags);
    };

    fetchTagsData();
  }, []);

  useEffect(() => {
    const fetchMediaTags = async () => {
      if (item.media_id) {
        const tagsForMedia = await fetchTagsByMediaId(item.media_id.toString());
        setCurrentTags(tagsForMedia);
      }
    };
    fetchMediaTags();
  }, []);

  const submitTagAssignment = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Authentication required');
        return;
      }
      if (!selectedTag) {
        alert('Please select a tag');
        return;
      }
      await assignTagToMediaItem(selectedTag, item.media_id.toString(), token);
      alert('Tag assigned successfully');
      // Optionally, refresh the tags list for the media item here
    } catch (error) {
      console.error('Error assigning tag:', error);
      alert('Failed to assign tag');
    }
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTag(e.target.value);
  };

  useEffect(() => {
    if (item.media_id) {
      getRatingsByMediaID(item.media_id.toString()).then((rating) => {
        if (rating) {
          setUserRating(rating);
        }
      });
    }
  }, []);

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
      await postRating(item.media_id, userRating, token);
      alert('Rating submitted successfully');

    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Failed to submit rating');
    }
  };


  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
      {item.media_type.includes('video') ? (
        <video controls src={item.filename} className="w-full h-auto rounded-lg"></video>
      ) : (
        <img src={item.filename} alt={item.title} className="w-full max-h-96 h-auto rounded-lg object-contain"/>
      )}
      <div className="mt-4">
        <Likes item={item} />
      </div>
      {user && (Number(user.user_id) === Number(item.user_id) || user.level_name === 'Admin') && (
        <div className="mt-4 space-y-4">
          <div>
            <label className="block font-bold">
              Rate this item:
              <input type="range" min="0" max="10" value={userRating} onChange={handleRatingChange} className="mt-1 w-full h-2 bg-gray-200 rounded-lg"/>
              <span className="ml-2 text-sm text-gray-500">{userRating}</span>
            </label>
            <button onClick={submitRating} className="mt-2 px-4 py-2 bg-sky-600 text-white font-bold rounded-lg hover:bg-sky-700">
              Submit Rating
            </button>
          </div>
          <div>
            <label className="block font-bold">
              Assign Tag:
              <select value={selectedTag} onChange={handleTagChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md">
                <option value="">Select Tag</option>
                {tags.map((tag) => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </label>
            <button onClick={submitTagAssignment} className="mt-2 px-4 py-2 bg-sky-600 text-white font-bold rounded-lg hover:bg-sky-700">
              Assign Tag
            </button>
          </div>
        </div>
      )}
      <div className="mt-4">
        <p className="font-bold">Status:</p>
        {currentTags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {currentTags.map((tag) => (
              <span key={tag.tag_id} className="px-3 py-1 bg-sky-100 text-sky-800 font-medium rounded-full">{tag.tag_name}</span>
            ))}
          </div>
        ) : (
          <span className="text-gray-500">No status assigned</span>
        )}
      </div>
      <div className="mt-4">
        <span className="font-bold">Rating:</span> {userRating || "Not rated yet"}/10
      </div>
      <div className="mt-4">
        <p><span className="font-bold">Notes:</span> {item.description || "No description provided."}</p>
        <p><a className="font-bold">Uploaded at:</a> {new Date(item.created_at).toLocaleString('fi-FI')}, by: {item.owner.username}</p>
      </div>
      <div className="mt-4">
        <button onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-300 text-gray-800 font-bold rounded-lg hover:bg-gray-400">
          Go back
        </button>
      </div>
      <Comments item={item} />
    </div>
  );
};

export default Single;
