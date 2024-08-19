import { FastifyInstance } from "fastify";

type FastifyErrorHandler = FastifyInstance["errorHandler"];

export const errorHandler: FastifyErrorHandler = (error, request, response) => {
  return response.status(500).send({ message: "Internal Server Error" });
};
