import React from 'react';
import { Box, Container, Heading } from '@chakra-ui/react';
import SignupForm from '../components/auth/SignupForm';

const SignupPage = () => {
  return (
    <Container maxW="lg">
      <Box p={8} borderWidth={1} borderRadius="md">
        <Heading as="h1" mb={4}>
          Host Signup
        </Heading>
        <SignupForm />
      </Box>
    </Container>
  );
};

export default SignupPage;
