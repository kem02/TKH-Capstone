import express from "express";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import prisma from "../db/index.js";

const router = express.Router();

router.post("/signup", async (request, response) => {
  console.log(request.body);
  try {
    const foundProvider = await prisma.provider.findFirst({
      where: {
        provider_email: request.body.email,
      },
    });

    const foundClient = await prisma.client.findFirst({
      where: {
        client_email: request.body.email,
      },
    });

    console.log(foundProvider, "provider", foundClient, "client");
    if (foundProvider || foundClient) {
      response.status(400).json({
        success: false,
        message: "User already exists.",
      });
    } else {
      const pHashedPassword = await argon2.hash(request.body.password);
      const newProvider = await prisma.provider.create({
        data: {
          provider_email: request.body.email,
          provider_password: pHashedPassword,
          provider_fname: request.body.fname,
          provider_lname: request.body.lname,
          provider_phone: request.body.phone,
        },
      });
      const cHashedPassword = await argon2.hash(request.body.password);
      const newClient = await prisma.client.create({
        data: {
          client_email: request.body.email,
          client_password: cHashedPassword,
          client_fname: request.body.fname,
          client_lname: request.body.lname,
          client_phone: request.body.phone,
        },
      });
      response.status(201).json({
        success: true,
        message: "Account successfully created!",
        newProvider,
        newClient,
      });
    }
  } catch (e) {
    console.log(e);
    response.status(400).json({
      success: false,
      message: "Something went wrong.",
    });
  }
});

router.post("/login", async (request, response) => {
  try {
    const findProvider = await prisma.provider.findFirst({
      where: {
        provider_email: request.body.email,
      },
    });
    // const findClient = await prisma.client.findFirst({
    //   where: {
    //     client_email: request.body.client,
    //   },
    // });
    console.log(findProvider)
    try {
      const verifiedPassword = await argon2.verify(findProvider.provider_password, request.body.password);

      if (verifiedPassword) {
          const token = jwt.sign({
            Provider: {
                provider_email: findProvider.provider_email,
                provider_id: findProvider.provider_id
              }
          }, "showMeTheProvidersOrClients");

          response.status(200).json({
              success: true,
              token
          });
      } else {
        response.status(401).json({
              success: false,
              message: "Incorrect email or password."
          });
        }
      } catch (e) {
        response.status(500).json({
              success: false,
              message: "Something went wrong"
          });
      };

   
  } catch (e) {
    response.status(401).json({
      success: false,
      message: "Incorrect email or password",
    });
  }
});

export default router;
