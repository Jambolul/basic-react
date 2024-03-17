import {useEffect, useState} from 'react';
import {
  Comment,
  Like,
  MediaItem,
  MediaItemWithOwner,
  Tag,
  User,


} from '../types/DBTypes';
import {fetchData, makeQuery} from '../lib/functions';
import {Credentials, GraphQLResponse} from '../types/LocalTypes';
import {
  LoginResponse,
  MediaResponse,
  MessageResponse,
  UploadResponse,
  UserResponse,
} from '../types/MessageTypes';
import {useUpdateContext} from './ContextHooks';

const useMedia = () => {
  const [mediaArray, setMediaArray] = useState<MediaItemWithOwner[]>([]);
  const {update} = useUpdateContext();
  const [ratings] = useState<number[]>([]);
  const [tags] = useState<Tag[]>([]); // State for storing tags

  const fetchTags = async (): Promise<string[]> => {
    const query = `
      query Query {
        tags {
          tag_id
          tag_name
        }
      }
    `;
    try {
      const result = await makeQuery<
  GraphQLResponse<{ tags: { tag_name: string }[] }>, // First type argument
  undefined // Second type argument (variables)
>(query);
      const tags = result.data.tags.map(tag => tag.tag_name);
      return tags;
    } catch (error) {
      console.error('Error fetching tags:', error);
      return []; // Return an empty array in case of error
    }
  };

  const fetchTagsByMediaId = async (mediaId: string): Promise<Tag[]> => {
    const query = `
      query Query($mediaId: ID!) {
        mediaItem(media_id: $mediaId) {
          tags {
            tag_id
            tag_name
          }
        }
      }
    `;
    const variables = { mediaId };
    try {
      const result = await makeQuery<
        GraphQLResponse<{ mediaItem: { tags: Tag[] } }>,
        { mediaId: string }
      >(query, variables);
      // Adjusting this line to correctly access the tags
      const tags = result.data.mediaItem.tags || [];
      return tags;
    } catch (error) {
      console.error('Error fetching tags by media ID:', error);
      return []; // Return an empty array in case of error
    }
  }

  const deleteTagFromMediaItem = async (tagId: string, mediaId: string, token: string) => {
    const mutation = `
      mutation DeleteTagFromMediaItem($input: TagInputID!) {
        deleteTagFromMediaItem(input: $input) {
          message
        }
      }
    `;
    const variables = {
      input: {
        tag_id: tagId,
        media_id: mediaId
      }
    };
    try {
      await makeQuery<GraphQLResponse<{ deleteTagFromMediaItem: MessageResponse }>, { input: { tag_id: string; media_id: string } }>(mutation, variables, token);
    } catch (error) {
      console.error('Error deleting tag from media item:', error);
    }
  };

  const assignTagToMediaItem = async (tagName: string, mediaId: string, token: string) => {
    // Step 1: Check for existing tags
    const existingTags = await fetchTagsByMediaId(mediaId); // Implement this based on your API
    if (existingTags.length > 0) {
      // Extract the tag_id from the first tag object
      const existingTagId = existingTags[0].tag_id;

      // Then delete the existing tag from the media item
      await deleteTagFromMediaItem(existingTagId, mediaId, token);
    }

    // Step 2: Assign the new tag
    // Note: Adjust this to match your updated mutation if needed
    const mutation = `
      mutation AssignTagToMediaItem($input: TagInput!) {
        createTag(input: $input) {
          tag_id
          tag_name
        }
      }
    `;
    const variables = {
      input: {
        tag_name: tagName,
        media_id: mediaId
      }
    };
    try {
      const result = await makeQuery<GraphQLResponse<{ createTag: Tag }>, { input: { tag_name: string; media_id: string } }>(mutation, variables, token);
      console.log("Tag Assignment Result:", result);
    } catch (error) {
      console.error('Error assigning tag to media item:', error);
    }
  };

  const getRatingsByMediaID = async (mediaId: string): Promise<number | null> => {
    const query = `
      query Query($mediaId: ID!) {
        ratingsByMediaID(media_id: $mediaId) {
          rating_value
        }
      }
    `;
    const variables = { mediaId };
    try {
      const result = await makeQuery<GraphQLResponse<{ ratingsByMediaID: [{ rating_value: number }] }>, { mediaId: string }>(
        query, variables
      );
      // Assuming the API returns an array of ratings, and you're interested in the first one for simplicity
      // In a real scenario, the API might return only the rating for the current user, or you might need to filter it
      if (result.data && result.data.ratingsByMediaID && result.data.ratingsByMediaID.length > 0) {
        return result.data.ratingsByMediaID[0].rating_value; // Return the first rating value
      } else {
        return null; // Return null if no ratings are found
      }
    } catch (error) {
      console.error('Error fetching ratings by media ID:', error);
      return null; // Return null in case of an error
    }
  };

  const getMedia = async () => {
    try {
      const query = `
      query MediaItems {
        mediaItems {
          media_id
          user_id
          owner {
            username
            user_id
          }
          filename
          thumbnail
          filesize
          media_type
          title
          description
          created_at
          comments_count
          average_rating
        }
      }
    `;

      const result = await makeQuery<
        GraphQLResponse<{mediaItems: MediaItemWithOwner[]}>,
        undefined
      >(query);
      setMediaArray(result.data.mediaItems);
    } catch (error) {
      console.error('getMedia failed', error);
    }
  };

  useEffect(() => {
    getMedia();
  }, [update]);


  const postMedia = async (file: UploadResponse, inputs: Record<string, string>, token: string) => {
    const query = `
    mutation Mutation($input: MediaItemInput!) {
      createMediaItem(input: $input) {
        description
        title
        filename
        filesize
        media_type
      }
    }
  `;
    const media: Omit<MediaItem, 'media_id' | 'thumbnail' | 'created_at'> = {
      title: inputs.title,
      description: inputs.description,
      filename: file.data.filename,
      filesize: file.data.filesize,
      media_type: file.data.media_type,
      user_id: file.data.user_id,
    };
    console.log(file.data);
    const variables = { input: media };
    console.log(media);
    const result = await makeQuery<GraphQLResponse<{ createMediaItem: MediaResponse }>, { input: Omit<MediaItem, 'media_id' | 'thumbnail' | 'created_at'> }>(query, variables, token);
    console.log(result)
    return result
  }

  const deleteMedia = async (media_id: string, token: string, isAdmin: boolean = false) => {
    // Hypothetical admin bypass token - this is not secure and is just for demonstration
    const adminBypassToken = "admin-bypass-token";

    const variables = { mediaId: media_id };

    const deleteResult = await makeQuery<
      GraphQLResponse<{ deleteMediaItem: MessageResponse }>,
      { mediaId: string }
    >(
      `mutation DeleteMediaItem($mediaId: ID!) {
        deleteMediaItem(media_id: $mediaId) {
          message
        }
      }`,
      variables,
      isAdmin ? adminBypassToken : token
    );

    return deleteResult.data.deleteMediaItem;
  };
  const postRating = async (mediaId: string, ratingValue: number, token: string) => {
    const query = `
      mutation createRating($mediaId: ID!, $ratingValue: Int!) {
        createRating(media_id: $mediaId, rating_value: $ratingValue) {
          message
        }
      }
    `;
    const variables = { mediaId, ratingValue };
    try {
      const result = await makeQuery<GraphQLResponse<{ createRating: MessageResponse }>, typeof variables>(
        query, variables, token
      );

      console.log("Rating result:", result);
      return result;
    } catch (error) {
      console.error('Error posting rating:', error);
      throw error;
    }
  };

  return {mediaArray, postMedia, deleteMedia, postRating, getRatingsByMediaID, ratings, fetchTags, tags, assignTagToMediaItem, fetchTagsByMediaId};
};

const useUser = () => {
  // TODO: implement network functions for auth server user endpoints
  const getUserByToken = async (token: string) => {
    const options = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    return await fetchData<UserResponse>(
      import.meta.env.VITE_AUTH_API + '/users/token/',
      options,
    );
  };

  const postUser = async (user: Record<string, string>) => {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    };

    await fetchData<UserResponse>(
      import.meta.env.VITE_AUTH_API + '/users',
      options,
    );
  };

  const getUsernameAvailable = async (username: string) => {
    return await fetchData<{available: boolean}>(
      import.meta.env.VITE_AUTH_API + '/users/username/' + username,
    );
  };

  const getEmailAvailable = async (email: string) => {
    return await fetchData<{available: boolean}>(
      import.meta.env.VITE_AUTH_API + '/users/email/' + email,
    );
  };

  const getUserById = async (user_id: number) => {
    return await fetchData<User>(
      import.meta.env.VITE_AUTH_API + '/users/' + user_id,
    );
  };

  return {
    getUserByToken,
    postUser,
    getUsernameAvailable,
    getEmailAvailable,
    getUserById,
  };
};

const useAuthentication = () => {
  const postLogin = async (creds: Credentials) => {
    const query = `
    mutation Login($username: String!, $password: String!) {
      login(username: $username, password: $password) {
        token
        message
        user {
          user_id
          username
          email
          level_name
          created_at
        }
      }
    }
  `;
    const loginResult = await makeQuery<
      GraphQLResponse<{login: LoginResponse}>,
      Credentials
    >(query, creds);
    console.log(loginResult);
    return loginResult.data.login;
  };

  return {postLogin};
};

const useFile = () => {
  const postFile = async (file: File, token: string) => {
    const formData = new FormData();
    formData.append('file', file);
    const options = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
      },
      body: formData,
    };
    return await fetchData<UploadResponse>(
      import.meta.env.VITE_UPLOAD_SERVER + '/upload',
      options,
    );
  };

  return {postFile};
};

const useLike = () => {
  const postLike = async (media_id: string, token: string) => {
    const mutation = `
    mutation Mutation($mediaId: ID!) {
      createLike(media_id: $mediaId) {
        message
      }
    }
  `;
    const variables = {mediaId: media_id};
    return await makeQuery<
      GraphQLResponse<{createLike: MessageResponse}>,
      {mediaId: string}
    >(mutation, variables, token);
  };

  const deleteLike = async (like_id: string, token: string) => {
  const mutation = `
  mutation Mutation($likeId: ID!) {
  deleteLike(like_id: $likeId) {
    message
  }
}
`;
  const variables = {likeId: like_id};
  return await makeQuery<
    GraphQLResponse<{deleteLike: MessageResponse}>,
    {likeId: string}
  >(mutation, variables, token);
  };

  const getCountByMediaId = async (media_id: string) => {
    const query = `
    query Query($mediaId: ID!) {
      mediaItem(media_id: $mediaId) {
        likes {
          like_id
        }
      }
    }
  `;
    const result = await makeQuery<
      GraphQLResponse<{mediaItem: {likes: Like[]}}>,
      {mediaId: string}
    >(query, {mediaId: media_id});
    return {count: result.data.mediaItem.likes.length};
  };

  const getUserLike = async (media_id: string, token: string) => {
    const query = `
      query Query($mediaId: ID!) {
        mediaItem(media_id: $mediaId) {
          likes {
            user {
              user_id
            }
            like_id
          }
        }
      }
    `;
    const result = await makeQuery<
      GraphQLResponse<{ mediaItem: { likes: { user: { user_id: string }, like_id: string }[] } }>,
      { mediaId: string }
    >(query, { mediaId: media_id }, token);

    const userLikes = result.data.mediaItem.likes.map(like => ({
      user_id: like.user.user_id,
      like_id: like.like_id
    }));

    return userLikes;
  };



  return {postLike, deleteLike, getCountByMediaId, getUserLike};
};



const useComment = () => {
  const postComment = async (
    comment_text: string,
    media_id: string,
    token: string,
  ) => {
    try {
      // Construct the GraphQL mutation string
      const mutation = `
        mutation Mutation($mediaId: ID!, $commentText: String!) {
          createComment(media_id: $mediaId, comment_text: $commentText) {
            message
          }
        }
      `;

      // Define variables for the GraphQL mutation
      const variables = { commentText: comment_text, mediaId: media_id };

      // Execute the GraphQL mutation
      const result = await makeQuery<
        GraphQLResponse<{ createComment: MessageResponse }>,
        { mediaId: string; commentText: string }
      >(mutation, variables, token);

      // Return the result
      return result;
    } catch (error) {
      console.error('Error posting comment:', error);
      throw error;
    }
  };


  const {getUserById} = useUser();

  const getCommentsByMediaId = async (media_id: string) => {
    try {
      const query = `
        query Query($mediaId: ID!) {
          commentsByMediaID(media_id: $mediaId) {
            comment_text
            created_at
            user {
              user_id
              username
            }
          }
        }
      `;

      const result = await makeQuery<
        GraphQLResponse<{ commentsByMediaID: Comment[] }>,
        { mediaId: string }
      >(query, { mediaId: media_id });

      const comments = result.data.commentsByMediaID || [];

      // Map over the comments array to add usernames
      const commentsWithUsername = await Promise.all(
        comments.map(async (comment) => {
          // Assuming the user_id is available in each comment
          if (comment.user && comment.user.user_id) {
            // Retrieve user information based on user_id
            const user = await getUserById(comment.user.user_id);
            // Add username to the comment object
            return { ...comment, username: user.username };
          } else {
            // Handle the case where user_id is missing
            return { ...comment, username: 'Unknown' };
          }
        })
      );

      return commentsWithUsername;
    } catch (error) {
      console.error('getCommentsByMediaId failed', error);
      throw error;
    }
  };




  return { postComment, getCommentsByMediaId };
}

export {useMedia, useUser, useAuthentication, useFile, useLike, useComment, };
