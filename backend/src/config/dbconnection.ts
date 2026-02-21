import { supabase } from "./supabase";

export const testConnection = async () => {

  const { data, error } =
    await supabase.from("employees").select("*");

  if (error) {
    console.error("Connection failed:", error.message);
  } else {
    console.log("Connection successful");
    console.log(data);
  }

};