import {NavigateFunction, useLocation, useNavigate} from "react-router-dom";
import {MediaItem} from "../types/DBTypes";

const Single = () => {
  const {state} = useLocation();
  const navigate: NavigateFunction = useNavigate();
  const item: MediaItem = state;

  return (
  <>
    <h3>{item.title}</h3>
    {item.media_type.includes("video") ? (
      <video controls src={item.filename} />
    ) : (
      <img src={item.filename} alt={item.title} />
    )}
    <p>{item.description}</p>
    <p>{new Date(item.created_at).toLocaleString('fi-FI')}</p>
    <p>{item.filesize}</p>
    <p>{item.media_type}</p>
    <button onClick={() => {
      navigate(-1);
    }}>Back</button>
  </>
  )
}



export default Single;
