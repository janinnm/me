import Head from "next/head";
import Link from "next/link";
import clientPromise from "../lib/mongodb";

export default function Blogs({ posts }) {
  return (
    <>
      <Head>
        <title>Writing</title>
        <meta name="description" content="Writing by Janin Manalili" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </Head>

      <main className="min-h-screen flex items-start justify-center font-[Inter] antialiased pt-[96px] px-[16px] pb-[40px] max-[599px]:pt-[32px] max-[599px]:px-[24px]">
        <div className="flex flex-col w-[352px] gap-[40px]">
          {/* Header */}
          <div>
            <p className="text-[14px] text-black m-0">Writing</p>
            <p className="mt-[8px] text-[14px] leading-[21px] text-black/60 m-0">
              Short notes about engineering, systems, and learning.
            </p>
          </div>

          <hr className="h-[0.5px] w-full bg-black/10 border-0 m-0" />

          {/* Posts */}
          <ul className="list-none p-0 m-0">
            {posts.map((post) => (
              <li key={post._id} className="mt-[24px]">
                <Link
                  href={`/blogs/${post.slug}`}
                  className="text-[14px] text-black underline decoration-black/20 decoration-[1px] underline-offset-[2px] transition-colors duration-200 hover:decoration-black"
                >
                  {post.title}
                </Link>

                <div className="mt-[4px] text-[14px] text-black/60">
                  {post.date} {post.readingTime ? `· ${post.readingTime}` : ""}
                </div>

                {post.excerpt && (
                  <p className="mt-[8px] text-[14px] leading-[21px] text-black/60 m-0">
                    {post.excerpt}
                  </p>
                )}
              </li>
            ))}
          </ul>

          <Link
            href="/"
            className="text-[14px] text-black underline decoration-black/20 decoration-[1px] underline-offset-[2px] w-fit transition-colors duration-200 hover:decoration-black"
          >
            ← Home
          </Link>
        </div>
      </main>

      <style jsx global>{`
        body {
          margin: 0;
        }
        ::selection {
          background: #42d2ff;
          color: #fff;
        }
      `}</style>
    </>
  );
}

export async function getServerSideProps() {
  try {
    const client = await clientPromise;
    const db = client.db("Portfolio");

    const posts = await db
      .collection("blogs")
      .find({})
      .sort({ date: -1 }) // latest first
      .toArray();

    return {
      props: {
        posts: JSON.parse(JSON.stringify(posts)),
      },
    };
  } catch (e) {
    console.error(e);
    return { props: { posts: [] } };
  }
}
