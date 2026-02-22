import { supabase, supabaseAdmin } from "../config/supabase";

export class AuthService {

  async login(email: string, password: string) {

    const { data, error } =
      await supabase.auth.signInWithPassword({

        email,
        password

      });

    if (error) {
      throw new Error(error.message);
    }

    return data;

  }

  async getUser(token: string) {

    const { data, error } =
      await supabase.auth.getUser(token);

    if (error) {
      throw new Error(error.message);
    }

    return data.user;

  }

  async createAuthUser(email: string, password: string) {

    const { data, error } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true
      });

    if (error) {
      throw new Error(error.message);
    }

    return data.user;

  }

}