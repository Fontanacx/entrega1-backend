import { connect, Types } from "mongoose";

export const connectDB = async () => {
  const URL = "mongodb+srv://fontanac:45963439@fontanac.np81n.mongodb.net/?retryWrites=true&w=majority&appName=Fontanac";
  try {
    connect(URL);
    console.log("conectado a mongoose");
  } catch (error) {
    console.log("error al conectar");
  }
};

export const isValidID = (id) => {
  return Types.ObjectId.isValid(id);
};