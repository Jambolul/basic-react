import {useEffect, useState} from "react";
import {MediaItem, MediaItemWithOwner, User} from "../types/DBTypes";
import {fetchData} from "../lib/functions";

const useMedia = (): MediaItemWithOwner[] => {
  const [mediaArray, setMediaArray] = useState<MediaItemWithOwner[]>([]);

  const getMedia = async () => {
    try {
      const mediaItems = await fetchData<MediaItem[]>(import.meta.env.VITE_MEDIA_API + '/media');
      // Get usernames (file owners) for all media files from auth api
      const itemsWithOwner: MediaItemWithOwner[] = await Promise.all(mediaItems.map(async (item) => {
        const owner = await fetchData<User>(import.meta.env.VITE_AUTH_API + '/users/' + item.user_id);
        const itemWithOwner: MediaItemWithOwner = {...item, username: owner.username};
        return itemWithOwner;
      }));
      setMediaArray(itemsWithOwner);
      console.log('mediaArray updated:', itemsWithOwner);
    } catch (error) {
      console.error('getMedia failed', error);
    }
  };

  useEffect(() => {
    getMedia();
  }, []);

  return mediaArray;
};

const useUser = () => {
  // todo: implement network connections for auth/user server
};

export {useMedia, useUser};
