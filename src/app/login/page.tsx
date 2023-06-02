"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Center, Spinner } from "@chakra-ui/react";
import { useState } from "react";
import {
  Button,
  Container,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

const loginSchema = yup
  .object({
    email: yup.string().email().required("Email is a must"),
    password: yup
      .string()
      .min(6, "Password must have at least 6 characters")
      .required("Please enter a password"),
  })
  .required();

type FormData = yup.InferType<typeof loginSchema>;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    signIn("credentials", {
      ...data,
      redirect: false,
    }).then((callback) => {
      setIsLoading(false);
      if (callback?.ok && !callback?.error) {
        toast({
          title: "Login",
          description: "Logged In Successfully!",
          status: "success",
        });
        router.push("/");
        router.refresh();
      }

      if (callback?.error) {
        toast({
          title: "Error",
          description: callback?.error,
          status: "error",
        });
      }
    });
  };

  if (isLoading)
    return (
      <Center w="full" h="full">
        <Spinner />
      </Center>
    );

  return (
    <Container as="form" onSubmit={handleSubmit(onSubmit)} mt="16">
      <Flex
        flexDirection="column"
        gap={4}
        alignItems="center"
        mx="auto"
        maxW="20rem"
        padding={8}
        border="1px"
        borderRadius={12}
        borderColor="blue.200"
      >
        <Text fontSize="2xl" fontWeight="bold">
          Login
        </Text>
        <FormControl isInvalid={!!errors.email}>
          <FormLabel>Your Email</FormLabel>
          <Input borderColor="blue.200" type="email" {...register("email")} />
          <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.password}>
          <FormLabel>Your Password</FormLabel>
          <Input
            borderColor="blue.200"
            type="password"
            {...register("password")}
          />
          <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
        </FormControl>
        <Button
          colorScheme="messenger"
          variant="outline"
          type="submit"
          isLoading={isLoading}
        >
          Login
        </Button>
        <Divider />
        <Button
          w="full"
          variant="outline"
          leftIcon={<FcGoogle />}
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          Continue With Google
        </Button>
        <Button
          mt={4}
          as={Link}
          color="gray.600"
          variant="link"
          href="/register"
        >
          Create New Account
        </Button>
      </Flex>
    </Container>
  );
};

export default Login;
