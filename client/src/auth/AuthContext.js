import React, { createContext, useState, useEffect } from 'react';
import api from './api';
import { getData } from './Methods';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || null);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
 
    

    const setUserProfile = async ()=>{
          const userResp = await getData('/user/me');
          console.log(userResp.data)
          setUser(userResp.data)
    }

      useEffect(()=>{
        if(user===null) setUserProfile()
      },[])

    useEffect(() => {
        const fetchAccessToken = async () => {
            try {
                console.log("Thie is fetch access token function")
                const response = await api.post('/auth/refresh');
                setAccessToken(response.data.accessToken);
                console.log('this is resp',response)
                // setUser(userProfile)
                localStorage.setItem('accessToken', response.data.accessToken);
            } catch (error) {
                console.error('Failed to refresh access token:', error);
                setAccessToken(null);
                localStorage.removeItem('accessToken');
            } finally {
                setIsLoading(false);
            }


        };

        if (!accessToken) fetchAccessToken();
        else setIsLoading(false);
    }, [accessToken]);

    const updateAccessToken = (token) => {
        setAccessToken(token);
        if (token) {
            localStorage.setItem('accessToken', token);
        } else {
            localStorage.removeItem('accessToken');
        }
    };

    // if (isLoading) return <div>Loading...</div>;

    return (
        <AuthContext.Provider value={{ accessToken,user,setUser, setAccessToken: updateAccessToken }}>
            {children}
        </AuthContext.Provider>
    );
};
