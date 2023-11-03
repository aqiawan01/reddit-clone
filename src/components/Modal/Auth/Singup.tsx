
import { AuthModalState } from '@/src/atoms/authModalAtom';
import { Button, Flex, Input, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../../../firebase/clientApp';
import { FIREBASE_ERRORS } from '../../../firebase/errors';

const Singup:React.FC = () => {
    
    const setAuthModalState = useSetRecoilState(AuthModalState);
    const [SingupForm, setSingupForm] = useState({
        email: "",
        password: "",
        ConfirmPassword: "",
    });
   // Firebase logic
   const [error, setError]= useState('')
   const [
    createUserWithEmailAndPassword,
    user,
    loading,
    userError,
  ] = useCreateUserWithEmailAndPassword(auth);
    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(error) setError('');
        if(SingupForm.password !== SingupForm.ConfirmPassword){
            setError("Password do not match");
            return;
        }
        //password match
        createUserWithEmailAndPassword(SingupForm.email, SingupForm.password );
    };

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // update form state
        setSingupForm(prev => ({
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
            <Input
                required
                name="ConfirmPassword"
                placeholder="confirm Password"
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
            {error || userError && (
                <Text textAlign='center' color='red' fontSize='10pt'>{error || FIREBASE_ERRORS[userError.message as keyof typeof FIREBASE_ERRORS ]}</Text>
            )}
            
            <Button
                width="100%"
                height="36px"
                mt={2}
                mb={2}
                type="submit"
                isLoading={loading}
            >Sing Up</Button>
            <Flex fontSize="9pt" justifyContent="center">
                <Text mr={1}>Already a radditor?</Text>
                <Text color="blue.500" fontWeight={700} cursor="pointer"
                onClick={() => setAuthModalState(prev => ({
                    ...prev,
                    view: 'login'
                }))}
                >Log In</Text>
            </Flex>
        </form>
    );

}
export default Singup;