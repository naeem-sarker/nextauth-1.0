import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials"
import { jwtDecode } from "jwt-decode"

async function refreshAccessToken(token) {
    try {
        const res = await fetch("http://localhost:4000/refresh", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ refreshToken: token.refreshToken }),
        })

        const data = await res.json();

        if (!res.ok) throw data;

        const decoded = jwtDecode(data.accessToken);

        return {
            ...token,
            accessToken: data.accessToken,
            accessTokenExpires: decoded?.exp * 1000,
            refreshToken: data.refreshToken ?? token.refreshToken
        }
    } catch (error) {
        console.log(error)
        return {
            ...token,
            user: null,
            accessToken: null,
            accessTokenExpires: 0,
            refreshToken: null,
            error: "RefreshAccessTokenError"
        }
    }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {}
            },
            authorize: async (credentials) => {
                if (!credentials) return null;
                const { email, password } = credentials;

                const res = await fetch("http://localhost:4000/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, password })
                })

                if (!res.ok) return null;

                const { data } = await res.json();

                const decoded = jwtDecode(data?.accessToken);

                if (data?.user && data?.accessToken) {
                    return {
                        id: data.user.id,
                        name: data.user.name,
                        email: data.user.email,
                        accessToken: data.accessToken,
                        accessTokenExpires: decoded.exp * 1000,
                        refreshToken: data.refreshToken
                    }
                }

                return null;
            },

        }),

    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
                token.accessToken = user.accessToken;
                token.accessTokenExpires = user.accessTokenExpires;
                token.refreshToken = user.refreshToken;
            }

            if (Date.now() < token.accessTokenExpires) {
                return token;
            }

            return await refreshAccessToken(token);
        },

        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.email = token.email;
                session.accessToken = token.accessToken;
                session.accessTokenExpires = token.accessTokenExpires,
                    session.refreshToken = token.refreshToken;
            }

            return session;
        },

    },
    session: {
        strategy: "jwt"
    }
})