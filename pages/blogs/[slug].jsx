import Head from "next/head";
import clientPromise from "../../lib/mongodb";
import Link from "next/link";

export default function BlogPost({ post }) {
  if (!post) return <div>Post not found</div>;

  return (
    <>
      <Head>
        <title>{post.title}</title>
        <meta name="description" content={post.excerpt || ""} />
      </Head>

      <main className="min-h-screen flex items-start justify-center font-[Inter] antialiased pt-[96px] px-[16px] pb-[40px] max-[599px]:pt-[32px] max-[599px]:px-[24px]">
        <div className="flex flex-col w-[352px] gap-[40px]">
          {/* Title */}
          <h1 className="text-[20px] font-semibold">{post.title}</h1>
          <div className="text-[14px] text-black/60">
            {post.date} {post.readingTime ? `· ${post.readingTime}` : ""}
          </div>

          {/* Content */}
          <div
            className="text-[14px] leading-[21px] text-black/90"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Back link */}
          <Link
            href="/blogs"
            className="text-[14px] text-black underline decoration-black/20 underline-offset-[2px] w-fit transition-colors duration-200 hover:decoration-black"
          >
            ← Back to Blogs
          </Link>
        </div>
      </main>
    </>
  );
}

// Fetch the post from MongoDB
export async function getServerSideProps({ params }) {
  try {
    const client = await clientPromise;
    const db = client.db("Portfolio");

    const post = await db
      .collection("blogs")
      .findOne({ slug: params.slug });

    if (!post) return { notFound: true };

    return {
      props: {
        post: JSON.parse(JSON.stringify(post)),
      },
    };
  } catch (e) {
    console.error(e);
    return { notFound: true };
  }
}
