import { auth } from '@/src/firebase/clientApp';
import { useDisclosure, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Flex, Text } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState } from "recoil";
import { AuthModalState } from "../../../atoms/authModalAtom";
import AuthInput from './AuthInput';
import OAuthButtons from './OAuthButtons';
import ResetPassword from './ResetPassword';

const AuthModal: React.FC = () => {
    const [modalState, setModalState] = useRecoilState(AuthModalState)
    const [user, loading, error] = useAuthState(auth)

    const handleClose = () => {
        setModalState(prev => ({
            ...prev,
            open: false,
        }));
    };

    useEffect(() => {
        if (user) handleClose();
        console.log("user", user);
    }, [user])

    return (
        <>
            <Modal isOpen={modalState.open} onClose={handleClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader textAlign="center">
                        {modalState.view === 'login' && 'Login'}
                        {modalState.view === 'singup' && 'Sing Up'}
                        {modalState.view === 'resetPassword' && 'Reset Password'}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display='flex'
                        flexDirection='column'
                        alignItems='center'
                        justifyContent='center'>

                        <Flex
                            direction='column'
                            align='center'
                            justify='center'
                            width="70%"
                            pb={6}
                        >
                            {modalState.view === 'login' || modalState.view === 'singup' ? (
                                <>
                                    <OAuthButtons />
                                    <Text color='gray.500' fontWeight={700}>OR</Text>
                                    <AuthInput /> </>
                            )
                                :
                                (
                                    <>
                                        <ResetPassword />
                                    </>

                                )

                            }


                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};
export default AuthModal;