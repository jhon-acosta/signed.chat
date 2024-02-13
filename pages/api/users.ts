import User from "@/api/models/User";
import mongoClient from "@/api/mongo";
import { NextApiResponse } from "next";
import { NextApiRequestWithSocket } from "@/types/api.socket";

const getAllUsers = async () => await User.find({}, { privateKey: 0 });

export default async function users(
  request: NextApiRequestWithSocket,
  response: NextApiResponse
) {
  await mongoClient();

  const handleGetRequest = async () => {
    response.status(200).json({ data: await getAllUsers() });
  };

  const handlePostRequest = async () => {
    const user = new User(request.body);
    await user.save();
    request.socket?.server?.io?.emit("getAllUsers", await getAllUsers());
    response.status(200).json({ data: user });
  };

  switch (request.method) {
    case "GET":
      handleGetRequest();
      break;
    case "POST":
      handlePostRequest();
      break;
    default:
      response.status(405).json({ message: "Method Not Allowed" });
  }
}
