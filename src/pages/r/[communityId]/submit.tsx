import  PageContent  from "@/src/components/Layout/pageContent";
import React from 'react';
import { Box, Text } from "@chakra-ui/react";
import NewPostForm from "@/src/components/posts/NewPostForm";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/src/firebase/clientApp";
import { useRecoilValue } from "recoil";
import { communityState } from "@/src/atoms/communitiesAtom";
import useCommunityData from "@/src/hooks/useCommunityData";
import About from "@/src/components/Community/About";

const submitPostPage:React.FC = () => {
    const [user] = useAuthState(auth);
    // const communityStateValue = useRecoilValue(communityState);
    // console.log('COMMUNITY', communityStateValue);
    const { communityStateValue } = useCommunityData();

    return (
    
        <PageContent>
            <>
            <Box p="14px 0px" borderBottom="1px solid" borderColor="white">
                <Text>Create a post</Text>
            </Box>
            {user &&  <NewPostForm user={user} communityImageURL={communityStateValue.currentCommunity?.imageURL} />}
            </>
            <>
            {communityStateValue.currentCommunity && (
                <About communityData={communityStateValue.currentCommunity}  />
            )}
            </>
        </PageContent>
        
    )
}
export default submitPostPage;