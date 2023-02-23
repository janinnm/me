import clientPromise from "../../lib/mongodb";

export default async (req, res) => {
   try {
       const client = await clientPromise;
       const db = client.db("Portfolio");

       const projects = await db
           .collection("projects")
           .find({})
           .limit(10)
           .toArray();

       res.json(projects);
   } catch (e) {
       console.error(e);
   }
};