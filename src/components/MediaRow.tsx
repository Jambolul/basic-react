import {Link} from 'react-router-dom';
import {MediaItemWithOwner} from '../types/DBTypes';
import {useUpdateContext, useUserContext} from '../hooks/ContextHooks';
import {useMedia} from '../hooks/graphQLHooks';
import { useEffect, useState } from 'react';

const MediaRow = (props: {item: MediaItemWithOwner}) => {
  const {item} = props;
  const {user} = useUserContext();
  const {deleteMedia, getRatingsByMediaID, fetchTagsByMediaId} = useMedia();
  const [rating, setRating] = useState<number | string | null>(null);
  const {update, setUpdate} = useUpdateContext();
  const [tags, setTags] = useState<string[]>([]);

console.log(item.likes_count);


  useEffect(() => {
    if (item.media_id) {
      getRatingsByMediaID(item.media_id.toString()).then((rating) => {
        if (rating) {
          setRating(rating);
        } else {
          setRating('No rating');
        }
      }).catch(error => {
        console.error('Failed to fetch rating:', error);
        setRating('Error fetching rating');
      });

      // Fetch tags inside useEffect
      fetchTagsByMediaId(item.media_id).then((fetchedTags) => {
        const tagNames = fetchedTags.map(tag => tag.tag_name);
        setTags(tagNames);
      }).catch(error => {
        console.error('Failed to fetch tags:', error);
      });
    }
  }, []);

  const deleteHandler = async () => {
    const cnf = confirm('Are you sure you want to delete this media?');
    if (!cnf) {
      return;
    }

    const token = localStorage.getItem('token');

    // Check if the user is an admin and has a token; proceed if yes
    if (user && user.level_name === 'Admin' && token) {
      try {
        const result = await deleteMedia(item.media_id, token);
        if (result && result.message) {
          alert(result.message);
        } else {
          alert("Deletion was not successful.");
        }
        setUpdate(!update);
      } catch (e) {
        console.error('Admin delete failed', e);
      }
      return;
    } else if (!token) {
      alert('You must be logged in to perform this action.');
      return;
    }

    // This code path assumes non-admin users who are logged in
    try {
      const result = await deleteMedia(item.media_id, token);
      if (result && result.message) {
        alert(result.message);
      } else {
        alert("Deletion was not successful.");
      }
      setUpdate(!update);
    } catch (e) {
      console.error('Delete failed', e);
    }
  };
  return (
<tr className="bg-white border-b border-gray-200 hover:bg-gray-50">
  <td className="py-4 px-6">
    <div className="flex items-center justify-center">
      <img
        className="h-32 w-44 object-cover rounded-lg"
        src={item.thumbnail}
        alt={item.title}
      />
    </div>
  </td>
  <td className="text-gray-900 font-medium py-4 px-6">{item.title}</td>
  <td className="text-gray-900 py-4 px-6">
    {new Date(item.created_at).toLocaleString('fi-FI')}
  </td>
  <td className="text-gray-900 py-4 px-6">{tags.join(', ') || 'No status'}</td>
  <td className="text-gray-900 py-4 px-6">{rating}/10</td>
  <td className="text-gray-900 py-4 px-6">{item.owner.username}</td>
  <td className="py-4 px-6">
    <div className="flex flex-col items-center space-y-2">
      <Link
        className="inline-block bg-sky-600 text-white py-2 px-4 rounded hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50"
        to="/single"
        state={item}
      >
        View
      </Link>
      {user && (Number(user.user_id) === Number(item.user_id) || user.level_name === 'Admin') && (
        <button
          className="bg-sky-800 text-white py-2 px-4 rounded hover:bg-sky-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50"
          onClick={deleteHandler}
        >
          Delete
        </button>
      )}
    </div>
    <div className="flex flex-col items-center mt-2">
    <p className="text-gray-900 mt-2 justify-end">Comments: {item.comments_count}</p>
    </div>

  </td>
</tr>
  );
}


export default MediaRow;
