import { createContext,useState,useEffect } from "react";
import { supabase } from "../services/supabase";

interface AuthContextType 
{
    user:any;
    login:(email:string,password:string)=>Promise<void>;
    logout:()=>Promise<void>;
} 

export const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({children}:any)=>
    {
        const [user,setUser] = useState<any>(null);
        const login= async(email:string,password:string)=>
        {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if(error) throw new Error(error.message);
            localStorage.setItem("token",data.session.access_token);
            setUser(data.user); 
        }
        const logout=async()=>
        {
            localStorage.removeItem("token");
            setUser(null);
        }
       useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            supabase.auth
                .getUser(token)
                .then(({ data }) => {
                    setUser(data.user);
                });
        }
            }, []);

    return (
        <AuthContext.Provider value={{user,login,logout }}>
            {children}
        </AuthContext.Provider>
    );
};
