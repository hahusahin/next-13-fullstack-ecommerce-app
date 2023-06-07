"use client";

import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Heading,
  ListItem,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import { Product } from "@prisma/client";
import Image from "next/image";
import React from "react";

interface ProductProps {
  product: Product;
}

const ProductDetail = ({ product }: ProductProps) => {
  return (
    <>
      <Heading textAlign="center" mt={6} mb={8}>
        Product Details
      </Heading>
      <Flex flexDirection={{ base: "column", lg: "row" }} w="full">
        <Center
          flex={2}
          w="full"
          height="auto"
          maxHeight="300px"
          position="relative"
        >
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            style={{ objectFit: "contain" }}
          />
        </Center>
        <Flex flex={5} flexDirection="column" gap={4}>
          <Text fontSize="2xl" fontWeight="medium">
            {product.name}
          </Text>
          <Text color="yellow.700" fontSize="xl">
            {product.rating > 0
              ? `User Rating: ${product.rating} / 5`
              : "User Rating: No Reviews Yet"}
          </Text>
          <Text color="blue.400" fontSize="xl">{`$ ${product.price}`}</Text>
          <UnorderedList spacing={2}>
            {product.description.split("'*'").map((paragraph, i) => (
              <ListItem key={i}>{paragraph}</ListItem>
            ))}
          </UnorderedList>
          <Button mt={4} w="max-content" variant="outline" colorScheme="messenger">
            Add to cart
          </Button>
        </Flex>
      </Flex>
    </>
  );
};

export default ProductDetail;
