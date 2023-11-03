import { AuthModalState } from '@/src/atoms/authModalAtom';
import { Button, Flex, Input, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { auth } from '../../../firebase/clientApp';
import { FIREBASE_ERRORS } from '../../../firebase/errors';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth'
type LoginProps = {};

const Login: React.FC<LoginProps> = () => {
    const setAuthModalState = useSetRecoilState(AuthModalState);
    const [loginForm, setLoginForm] = useState({
        email: "",
        password: "",
    });
   // Firebase logic
   const [
    signInWithEmailAndPassword,
    user,
    loading,
    error,
  ] = useSignInWithEmailAndPassword(auth);
    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        signInWithEmailAndPassword(loginForm.email, loginForm.password);
    };

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // update form state
        setLoginForm(prev => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
    };

    return (
        <form onSubmit={onSubmit}>
            <Input
                required
                name="email"
                placeholder="email"
                type="email"
                mb={2}
                onChange={onChange}
                fontSize="10pt"
                _placeholder={{ color: 'gray.500'}}
                _hover={{
                    bg:"white",
                    border:"1px solid",
                    borderColor: "blue.500",
                }}
                _focus ={{
                    outline: "none",
                    bg:"white",
                    border:"1px solid",
                    borderColor: "blue.500",
                }}
                bg="gray.50"
            />
            <Input
                required
                name="password"
                placeholder="password"
                type="password"
                mb={2}
                onChange={onChange}
                fontSize="10pt"
                _placeholder={{ color: 'gray.500'}}
                _hover={{
                    bg:"white",
                    border:"1px solid",
                    borderColor: "blue.500",
                }}
                _focus ={{
                    outline: "none",
                    bg:"white",
                    border:"1px solid",
                    borderColor: "blue.500",
                }}
                bg="gray.50"
            />
            <Text textAlign="center" color="red" fontSize="10pt">
                {FIREBASE_ERRORS[error?.message as keyof typeof FIREBASE_ERRORS]}
            </Text>
            <Button
                width="100%"
                height="36px"
                mt={2}
                mb={2}
                type="submit"
                isLoading={loading}
            >Log In</Button>
            <Flex justifyContent="center" mb={2}>
                <Text fontSize="9pt" mr={1}>Forgot your password</Text>
                <Text color="blue.500" fontSize="9pt" cursor="pointer"
               onClick={() => setAuthModalState(prev => ({
                ...prev,
                view: 'resetPassword'
            }))}
                >Reset</Text>
            </Flex>
            <Flex fontSize="9pt" justifyContent="center">
                <Text mr={1}>New Here ?</Text>
                <Text color="blue.500" fontWeight={700} cursor="pointer"
                onClick={() => setAuthModalState(prev => ({
                    ...prev,
                    view: 'singup'
                }))}
                >Sing Up</Text>
            </Flex>
        </form>
    );

};
export default Login;