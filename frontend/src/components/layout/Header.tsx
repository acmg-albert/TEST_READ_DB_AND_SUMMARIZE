import React from 'react';
import { Box, Flex, Image, Link, Menu, MenuButton, MenuList, MenuItem, Button } from '@chakra-ui/react';

const Header: React.FC = () => {
  return (
    <Box as="header" bg="white" boxShadow="sm" position="fixed" width="100%" zIndex="1000" top="0">
      <Flex maxW="1200px" mx="auto" px={4} py={4} align="center" justify="space-between">
        {/* Logo */}
        <Box>
          <Link href="/">
            <Image src="/logo.png" alt="Logo" h="40px" />
          </Link>
        </Box>

        {/* Navigation */}
        <Flex align="center" gap={6}>
          <Link href="/" color="gray.600" _hover={{ color: 'blue.500' }}>
            Home
            <Box as="span" ml={1} color="gray.400" fontSize="sm">(To Be Constructed)</Box>
          </Link>

          <Menu>
            <MenuButton as={Button} variant="ghost" color="gray.600" _hover={{ color: 'blue.500' }}>
              Sales Market
              <Box as="span" ml={1} color="gray.400" fontSize="sm">(To Be Constructed)</Box>
            </MenuButton>
          </Menu>

          <Menu>
            <MenuButton as={Button} variant="ghost" color="gray.600" _hover={{ color: 'blue.500' }}>
              Rental Market
            </MenuButton>
            <MenuList>
              <MenuItem as={Link} href="/rental/apartments-rent">Apartments Rent</MenuItem>
              <MenuItem as={Link} href="/rental/apartments-vacancy">Apartments Vacancy</MenuItem>
              <MenuItem as={Link} href="/rental/time-on-market">
                Apartments Time on Market
                <Box as="span" ml={1} color="gray.400" fontSize="sm">(To Be Constructed)</Box>
              </MenuItem>
              <MenuItem>
                Others
                <Box as="span" ml={1} color="gray.400" fontSize="sm">(To Be Constructed)</Box>
              </MenuItem>
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton as={Button} variant="ghost" color="gray.600" _hover={{ color: 'blue.500' }}>
              Affordability
              <Box as="span" ml={1} color="gray.400" fontSize="sm">(To Be Constructed)</Box>
            </MenuButton>
          </Menu>

          <Link href="/about" color="gray.600" _hover={{ color: 'blue.500' }}>
            About Us
            <Box as="span" ml={1} color="gray.400" fontSize="sm">(To Be Constructed)</Box>
          </Link>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header; 