import React from 'react';
import {
  Box,
  Container,
  SimpleGrid,
  Stack,
  Text,
  Input,
  Button,
  Link,
  IconButton,
  VStack,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { FaTwitter, FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';

// 创建包装后的图标组件
const EmailIcon = (props: any) => (
  <Icon as={FaEnvelope} {...props} />
);

const TwitterIcon = (props: any) => (
  <Icon as={FaTwitter} {...props} />
);

const LinkedInIcon = (props: any) => (
  <Icon as={FaLinkedin} {...props} />
);

const GitHubIcon = (props: any) => (
  <Icon as={FaGithub} {...props} />
);

const Footer: React.FC = () => {
  return (
    <Box bg="gray.50" color="gray.700" mt="auto">
      <Container as={Stack} maxW="1200px" py={10}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={8}>
          {/* Get In Touch Section */}
          <Stack spacing={6}>
            <Text fontSize="lg" fontWeight="bold">Get In Touch</Text>
            <Stack spacing={4}>
              <HStack>
                <EmailIcon />
                <Text>contact@example.com</Text>
              </HStack>
              <HStack spacing={4}>
                <IconButton
                  aria-label="Twitter"
                  icon={<TwitterIcon />}
                  size="sm"
                  variant="ghost"
                  colorScheme="blue"
                />
                <IconButton
                  aria-label="LinkedIn"
                  icon={<LinkedInIcon />}
                  size="sm"
                  variant="ghost"
                  colorScheme="blue"
                />
                <IconButton
                  aria-label="GitHub"
                  icon={<GitHubIcon />}
                  size="sm"
                  variant="ghost"
                  colorScheme="blue"
                />
              </HStack>
            </Stack>
          </Stack>

          {/* Quick Links Section */}
          <Stack spacing={6}>
            <Text fontSize="lg" fontWeight="bold">Quick Links</Text>
            <Stack spacing={2}>
              <Link href="/" color="gray.600" _hover={{ color: 'blue.500' }}>Home</Link>
              <Link href="/about" color="gray.600" _hover={{ color: 'blue.500' }}>About Us</Link>
              <Link href="/terms" color="gray.600" _hover={{ color: 'blue.500' }}>Terms & Conditions</Link>
              <Text color="gray.400">(Others To Be Constructed)</Text>
            </Stack>
          </Stack>

          {/* Newsletter Section */}
          <Stack spacing={6}>
            <Text fontSize="lg" fontWeight="bold">Newsletter</Text>
            <VStack spacing={4}>
              <Input
                placeholder="Enter your email"
                bg="white"
                border={1}
                borderColor="gray.200"
                _hover={{
                  borderColor: 'gray.300',
                }}
              />
              <Button
                w="100%"
                colorScheme="blue"
              >
                Sign Up
              </Button>
            </VStack>
          </Stack>
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default Footer; 