import {Link} from 'react-router-dom';
import {MediaItemWithOwner} from '../types/DBTypes';
import {useUpdateContext, useUserContext} from '../hooks/ContextHooks';
import {useMedia} from '../hooks/graphQLHooks';
import { useEffect, useState } from 'react';

const MediaRow = (props: {item: MediaItemWithOwner}) => {
  const {item} = props;
  const {user} = useUserContext();
  const {deleteMedia, getRatingsByMediaID} = useMedia();
  const [rating, setRating] = useState<number | string | null>(null);
  const {update, setUpdate} = useUpdateContext();



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
    }
  }, [item.media_id, getRatingsByMediaID]);

  const deleteHandler = async () => {
    const cnf = confirm('Are you sure you want to delete this media?');
    if (!cnf) {
      return;
    }
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }
      const result = await deleteMedia(item.media_id, token);
      alert(result.message);
      setUpdate(!update);
    } catch (e) {
      console.error('delete failed', (e as Error).message);
    }
  };

  return (
    <tr className="*:p-4">
      <td className="flex items-center justify-center border border-slate-700">
        <img
          className="h-60 w-72 object-cover"
          src={item.thumbnail}
          alt={item.title}
        />
      </td>
      <td className="border border-slate-700">{item.title}</td>
      <td className="text-ellipsis border border-slate-700">
        {item.description}
      </td>
      <td className="border border-slate-700">
        {new Date(item.created_at).toLocaleString('fi-FI')}
      </td>
      <td className="border border-slate-700">{rating}/10</td>
      <td className="border border-slate-700">{item.owner.username}</td>
      <td className="border border-slate-700">
        <div className="flex flex-col">
          <Link
            className="bg-slate-600 p-2 text-center hover:bg-slate-950"
            to="/single"
            state={item}
          >
            View
          </Link>
{user && (
  <>
{/*   {console.log(user.user_id)}
  {console.log(item.user_id)} */}

    {(Number(user.user_id) === Number(item.user_id) || user.level_name === 'Admin') ? (
      <>
        <button
          className="bg-slate-700 p-2 hover:bg-slate-950"
          onClick={() => console.log('modify', item)}
        >
          Modify
        </button>
        <button
          className="bg-slate-800 p-2 hover:bg-slate-950"
          onClick={deleteHandler}
        >
          Delete
        </button>
      </>
    ) : null}
  </>
)}
        </div>
        <p>Comments: {item.comments_count}</p>
      </td>
    </tr>
  );
}


export default MediaRow;
