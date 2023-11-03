import { AuthModalState } from '@/src/atoms/authModalAtom';
import { Flex } from '@chakra-ui/react';
import React from 'react';
import { useRecoilValue } from 'recoil';
import Login from './Login';
import SingUp from './Singup';

type AuthInputProps = {
    
};

const AuthInput:React.FC<AuthInputProps> = () => {
    const modalState = useRecoilValue(AuthModalState)
    return (
        <Flex direction='column' align='center' width='100%' mt={4}>
            {modalState.view === 'login' &&  <Login /> }
            {modalState.view === 'singup' &&    <SingUp /> }
           
          
        </Flex>
    );
};
export default AuthInput;