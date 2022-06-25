import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  // Configure authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
  callbacks: {
    async session({ session, token }) {
        session.user.tag = session.user.name.split(" ").join("").toLocaleLowerCase();
        session.user.uid = token.sub;
        return session;
    }  
  },
  jwt: {
    secret: process.env.SECRET,
    maxAge: 60 * 60 * 24 * 30,
  }
})