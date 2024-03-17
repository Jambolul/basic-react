import {useEffect, useRef} from 'react';
import {useUserContext} from '../hooks/ContextHooks';
import {useForm} from '../hooks/formHooks';
import {useCommentStore} from '../store';
import {MediaItemWithOwner} from '../types/DBTypes';
import {useComment} from '../hooks/graphQLHooks';
// import {useComment} from '../hooks/apiHooks';

const Comments = ({item}: {item: MediaItemWithOwner}) => {
  const {comments, setComments} = useCommentStore();
  const {user} = useUserContext();
  const formRef = useRef<HTMLFormElement>(null);
  const {getCommentsByMediaId, postComment} = useComment();

  const initValues = {comment_text: ''};

  const doComment = async () => {
    const token = localStorage.getItem('token');
    if (!user || !token) {
      return;
    }
    try {
      await postComment(inputs.comment_text, item.media_id, token);
      await getComments();
      // resetoi lomake
      if (formRef.current) {
        formRef.current.reset();
      }
    } catch (error) {
      console.error('postComment failed', error);
    }
  };

  const {handleSubmit, handleInputChange, inputs} = useForm(
    doComment,
    initValues,
  );

  const getComments = async () => {
    try {
      const comments = await getCommentsByMediaId(item.media_id);
      setComments(comments);
    } catch (error) {
      console.error('getComments failed', error);
      setComments([]);
    }
  };

  useEffect(() => {
    getComments();
  }, []);

  return (
<>
  {user && (
    <>

      <form onSubmit={handleSubmit} className="mb-6">

        <div className="flex flex-col md:flex-row items-center gap-4 mt-10">

          <label htmlFor="comment" className="block font-bold mb-2 md:mb-0 md:text-right flex-start w-full md:w-1/4">
            Post a comment:
          </label>
          <input
            className="flex-grow shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
            id="comment"
            name="comment_text"
            type="text"
            placeholder="Your comment"
            onChange={handleInputChange}
          />
        </div>
        <div className="flex justify-end mt-4">
          <button
            className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Post
          </button>
        </div>
      </form>
    </>
  )}
  {comments.length > 0 && (
    <>
      <h3 className="text-xl font-bold text-gray-900 mb-4">Comments</h3>
      <ul className="space-y-4">
        {comments.map((comment, index) => (
          <li key={comment.comment_id ?? index} className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900">{comment.username}</span>
              <span className="text-sm text-gray-500">{new Date(comment.created_at!).toLocaleDateString('fi-FI')}</span>
            </div>
            <p className="mt-2 text-gray-700">{comment.comment_text}</p>
          </li>
        ))}
      </ul>
    </>
  )}
</>
  );
};

export default Comments;
