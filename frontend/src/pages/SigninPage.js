import React from 'react';
import { Box, Container, Heading } from '@chakra-ui/react';
import SigninForm from '../components/auth/SigninForm';

const SigninPage = () => {
  return (
    <Container maxW="lg">
      <Box p={8} borderWidth={1} borderRadius="md">
        <Heading as="h1" mb={4}>
          Host Signin
        </Heading>
        <SigninForm />
      </Box>
    </Container>
  );
};

export default SigninPage;
