import { useEffect, useState } from "react";
import { Stack } from "@chakra-ui/react";
import {
  collection,
  DocumentData,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
  where,
} from "firebase/firestore";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue } from "recoil";
import { communityState } from "../atoms/communitiesAtom";
import { Post, PostVote } from "../atoms/postsAtom";
import CreatePostLink from "../components/Community/CreatePostLink";
import { auth, firestore } from "../firebase/clientApp";
import usePosts from "../hooks/usePosts";
import PageContent from "../components/Layout/pageContent";
import PostLoader from "../components/posts/PostLoader";
import PostItem from "../components/posts/PostItem";
import useCommunityData from "../hooks/useCommunityData";
import Recommendation from "../components/Community/Recommendation";
import Premium from "../components/Community/Premium";
import PresonalHomeFeed from "../components/Community/PresonalHomeFeed";

const Home: NextPage = () => {
  const [user, loadingUser] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const { communityStateValue } = useCommunityData();
  const { postStateValue, setPostStateValue, onSelectPost, onDeletePost, onVote } = usePosts();

  const buildUserHomeFeed = async () => {
    setLoading(true)
    try {
      if (communityStateValue.mySnippets.length) {
        // get post from user's communities
        const myCommunityIds = communityStateValue.mySnippets.map(
          (snippet) => snippet.communityId
        );
        const postQuery = query(collection(firestore, "posts"),
          where("communityId", "in", myCommunityIds),
          limit(10)
        );
        const postDocs = await getDocs(postQuery);
        const posts = postDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPostStateValue((prev) => ({
          ...prev,
          posts: posts as Post[],
        }));
      }
      else {
        getNoUserHomePosts();
      }


    } catch (error) {
      console.log('buildUserHomeFeed error', error)
    }
    setLoading(false);
  };

  const getNoUserHomePosts = async () => {

    setLoading(true);
    try {
      const postQuery = query(
        collection(firestore, 'posts'),
        orderBy("voteStatus", "desc"),
        limit(10)
      );

      const postDocs = await getDocs(postQuery);
      const posts = postDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));


      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as Post[],
      }));
    } catch (error: any) {
      console.log("getNoUserHomePosts error", error.message);
    }
    setLoading(false);
  };


  const getUserPostVotes = async () => {
    try {
      const postIds = postStateValue.posts.map((post) => post.id);
      const postVotesQuery = query(collection(firestore, `users/${user?.uid}/postVotes`),
      where('postId', 'in', postIds)
      );
      const postVoteDocs = await getDocs(postVotesQuery);
      const postVotes = postVoteDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPostStateValue((prev) => ({
        ...prev,
        postVotes: postVotes as PostVote[],
      }));
    } catch (error) {
      console.log('getUserPostVotes error', error);
    }
  };

  // useEffects
  useEffect(() => {
    if(communityStateValue.snippetsFetch){
      buildUserHomeFeed();
    }
  }, [communityStateValue.snippetsFetch]);

  useEffect(() => {
    if (!user && !loadingUser) {
      getNoUserHomePosts();
    }
  }, [user, loadingUser]);

  useEffect(() => {
   if(user && postStateValue.posts.length){
      getUserPostVotes();
      return () => {
        setPostStateValue((prev) => ({
          ...prev,
          postVotes: [],
        }));
      };
   };
  },[user, postStateValue.posts]);


  return (
    <>
      <PageContent>
        <>
          <CreatePostLink />
          {loading ? (
            <PostLoader />
          ) : (
            <Stack>
              {postStateValue.posts.map((post: Post, index) => (
                <PostItem
                  key={post.id}
                  post={post}
                  onSelectPost={onSelectPost}
                  onVote={onVote}
                  onDeletePost={onDeletePost}
                  userVoteValue={
                    postStateValue.postVotes.find(
                      (item) => item.postId === post.id
                    )?.voteValue
                  }
                  userIsCreator={user?.uid === post.creatorId}
                  homePage
                />
              ))}
            </Stack>
          )}
        </>
        <Stack spacing={5}>
         <Recommendation />
         <Premium />
         <PresonalHomeFeed />
        </Stack>
      </PageContent>
    </>
  )
};

export default Home;
