import MediaRow from '../components/MediaRow';
import {useMedia} from '../hooks/graphQLHooks';
// import {useMedia} from '../hooks/apiHooks';

const Home = () => {
  const {mediaArray} = useMedia();

  return (
    <>
      <table className=" bg-sky-100 rounded-xl">
        <thead>
          <tr>
            <th className="w-3/12">Thumbnail</th>
            <th className="w-1/12">Title</th>
            <th className="w-1/12">Posted</th>
            <th className="w-1/12">Status</th>
            <th className="w-1/12">Rating</th>
            <th className="w-1/12">User</th>
            <th className="w-2/12">Actions</th>
          </tr>
        </thead>
        <tbody >
          {mediaArray.map((item) => (
            <MediaRow key={item.media_id} item={item} />
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Home;
