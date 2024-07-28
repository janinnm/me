import clientPromise from "../../lib/mongodb";

export default async (req, res) => {
   try {
       const client = await clientPromise;
       const db = client.db("Portfolio");

       const profile = await db
           .collection("profile")
           .find({})
           .limit(1)
           .toArray();

       res.json(profile);
   } catch (e) {
       console.error(e);
   }
}