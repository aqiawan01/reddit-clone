import { Community, communityState } from "@/src/atoms/communitiesAtom";
import About from "@/src/components/Community/About";
import CreatePostLink from "@/src/components/Community/CreatePostLink";
import Header from "@/src/components/Community/Header";
import CommunityNotFound from "@/src/components/Community/NotFound";
import NotFound from "@/src/components/Community/NotFound";
import PageContent from "@/src/components/Layout/pageContent";
import Posts from "@/src/components/posts/Posts";
import { firestore } from "@/src/firebase/clientApp";
import { async } from "@firebase/util";
import { doc, getDoc } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import React, { useEffect } from 'react';
import { useSetRecoilState } from "recoil";
import  safeJsonStringify  from "safe-json-stringify";

type CommunityPageProps = {
    communityData: Community;
};

const CommunityPage:React.FC<CommunityPageProps> = ({ communityData }) => {
    const setCommunityStateValue = useSetRecoilState(communityState);
    if(!communityData){
        return  <CommunityNotFound />;
    }

    useEffect(() => {
        setCommunityStateValue((prev) => ({
            ...prev,
            currentCommunity: communityData,
        }));
    }, [communityData]);

    return (
        <>
        <Header communityData={ communityData } />
        <PageContent>
            <>
             <CreatePostLink />
             <Posts communityData={ communityData } />
            </>
            <>
             <About communityData={ communityData } />
            </>
        </PageContent>
        </>
        );
};



export async function getServerSideProps(context: GetServerSidePropsContext) {
    
    // get community data and pass it to client 
    try {
     const communityDocRef = doc(
        firestore, 
        'communities', 
        context.query.communityId as string
        );
        const communityDoc = await getDoc(communityDocRef);

        return {
            props: {
                communityData: communityDoc.exists() 
                ? JSON.parse(
                    safeJsonStringify({ id: communityDoc.id, ...communityDoc.data() })
                ) : "" ,
            },
        };
    }catch (error){
       console.log('getServerSideProps error', error)
    }
};
export default CommunityPage;


