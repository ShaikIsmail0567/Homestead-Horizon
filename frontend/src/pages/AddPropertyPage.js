import React from 'react';
import { Box, Container, Flex } from '@chakra-ui/react';
import PropertyForm from '../components/properties/PropertyForm';

const AddPropertyPage = () => {
  return (
   <Flex justify="center" h="100vh" 
   
   position="relative" 
   _before={{
     content: '""',
     position: "absolute",
     top: 0,
     left: 0,
     width: "100%",
     height: "100%",
     background: `url('https://wallpapercave.com/wp/wp1875177.jpg')`,
    //  background: `url('https://e0.pxfuel.com/wallpapers/500/457/desktop-wallpaper-sky-night-vector-dark-wood-tree-loneliness-glade-polyana.jpg')`,
    //  backgroundSize: "cover",
     backgroundPosition: "left", // Control the background image position
     opacity: 0.7,
     zIndex: -1
   }}
>
     <Container  maxW="lg"
    >
      <Box ml="50%" mb="10%"  mt="10%" bg="blue.30" p={8} borderRadius="md" shadow="md" boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" width="400px" >
        <PropertyForm />
      </Box>
    </Container>
   </Flex>
  );
};

export default AddPropertyPage;




