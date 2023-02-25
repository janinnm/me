import clientPromise from "../lib/mongodb";
import Head from 'next/head'
import Link from 'next/link'

export default function Projects({ projects }) {
    return (
        <div className="bg-slate-900 min-h-screen min-w-fit">
          <section id="projects" className="bg-slate-900 p-10">
            <div className="text-white text-left p-10 flex flex-wrap" key={projects.id}>
              <h3 className="text-white text-3xl py-1">Projects</h3>
              <ul className="py-5 list-outside ml-6">
                {projects.map((project) => (
                    <li>
                        <h2 className="mt-5  text-2xl text-teal-600 border-t-[1px] border-gray-500">{project.title}</h2>
                        <p className="text-sm text-md leading-8 text-gray-400">{project.description}</p>
                    </li>
                ))}
            </ul>
            </div>
          </section>
  
        <footer className="text-white flex justify-center items-center fixed bottom-0 left-0 bg-slate-800 w-full h-10">
          <h2>© Copyright 2022 Janin Manalili.</h2>
        </footer>

        </div>
    );
}

export async function getServerSideProps() {
    try {
        const client = await clientPromise;
        const db = client.db("Portfolio");

        const projects = await db
            .collection("projects")
            .find({})
            .limit(20)
            .toArray();

        return {
            props: { projects: JSON.parse(JSON.stringify(projects)) },
        };
    } catch (e) {
        console.error(e);
    }
}

