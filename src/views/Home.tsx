import MediaRow from '../components/MediaRow';
import {useMedia} from '../hooks/graphQLHooks';
// import {useMedia} from '../hooks/apiHooks';

const Home = () => {
  const {mediaArray} = useMedia();

  return (
    <>
      <h2>My Media</h2>
      <table>
        <thead>
          <tr>
            <th className="w-3/12 border border-slate-700">Thumbnail</th>
            <th className="w-1/12 border border-slate-700">Title</th>
            <th className="w-2/12 border border-slate-700">Description</th>
            <th className="w-1/12 border border-slate-700">Created</th>
            <th className="w-1/12 border border-slate-700">Size</th>
            <th className="w-1/12 border border-slate-700">Type</th>
            <th className="w-1/12 border border-slate-700">Owner</th>
            <th className="w-2/12 border border-slate-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {mediaArray.map((item) => (
            <MediaRow key={item.media_id} item={item} />
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Home;
