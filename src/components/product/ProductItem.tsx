"use client";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Center,
  Divider,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ProductItem = ({ data }: { data: Product }) => {
  return (
    <Card>
      <CardBody as={Link} href={`/product/${data.id}`}>
        <Center w="full" height={150} position="relative">
          <Image
            src={data.imageUrl}
            alt={data.name}
            fill
            style={{ objectFit: "contain" }}
          />
        </Center>
        <Stack mt="6" spacing="3">
          <Heading size="md">{data.name}</Heading>
          <Text color="blue.600" fontSize="2xl">
            {data.price}
          </Text>
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter justifyContent="center" py={4}>
        <Button variant="outline" colorScheme="blue">
          Add to cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductItem;
