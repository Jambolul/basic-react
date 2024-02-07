import { MediaItem, MediaItemWithOwner, User } from "../types/DBTypes";
import MediaRow from "../components/MediaRow";
import { useEffect, useState } from "react";
import { fetchData } from "../lib/functions";

const Home = () => {

  const [mediaArray, setMediaArray] = useState<MediaItemWithOwner[]>([])
//console.log(mediaArray);

const getMedia = async () => {
  try {
    const mediaItems = await fetchData<MediaItem[]>(import.meta.env.VITE_MEDIA_API + "/media");

    const itemsWithOwner: MediaItemWithOwner[] = await Promise.all(mediaItems.map(async (item) => {
      const owner = await fetchData<User>(import.meta.env.VITE_AUTH_API + "/users/" + item.user_id)
      const itemWithOwner: MediaItemWithOwner = {...item, username: owner.username}
      return itemWithOwner;
    }))

    setMediaArray(itemsWithOwner);
    console.log("mediaArray updated", itemsWithOwner);
  } catch (error) {
    console.error("Error fetching media", error);
  }
}

useEffect(() => {
  getMedia();
}, [])


  return (
    <>
    <h2>My Media</h2>
    <table>
      <thead>
        <tr>
          <th>Thumbnail</th>
          <th>Title</th>
          <th>Description</th>
          <th>Created</th>
          <th>Size</th>
          <th>Type</th>
          <th>Owner</th>
        </tr>
      </thead>
      <tbody>
        {mediaArray.map((item) => (
          <MediaRow
            key={item.media_id}
            item={item}
          />
        ))}
      </tbody>
    </table>
  </>
  )
}

export default Home
