import {create} from 'zustand';
import {Comment} from './types/DBTypes';

type CommentWithUsername = Partial<Comment & {username: string}>;

type CommentStore = {
  comments: CommentWithUsername[];
  setComments: (comments: CommentWithUsername[]) => void;
};

export const useCommentStore = create<CommentStore>((set) => ({
  comments: [],
  setComments: (comments) =>
    set(() => ({
      comments: comments,
    })),
}));
