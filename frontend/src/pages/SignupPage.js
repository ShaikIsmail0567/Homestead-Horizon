import React from 'react';
import { Box, Container, Flex, Heading } from '@chakra-ui/react';
import SignupForm from '../components/auth/SignupForm';

const SignupPage = () => {
  return (
     <Flex align="center" 
    justify="center" h="100vh" 
   
    position="relative" 
    _before={{
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: `url('https://wallpapercave.com/wp/wp1875177.jpg')`,
      backgroundSize: "cover",
      backgroundPosition: "left", // Control the background image position
      opacity: 0.7,
      zIndex: -1
    }}
    
   >
      <Container maxW="lg">
      <Box ml="10%" mb="80%"  bg="blue.30" p={8} borderRadius="md" shadow="md" boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" width="400px">
        <Heading as="h1" mb={4}>
          {/* Host Signup */}
        </Heading>
        <SignupForm />
      </Box>
    </Container>
    </Flex>
  );
};

export default SignupPage;
