import Head from "next/head";
import clientPromise from "../lib/mongodb";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

export default function Home({ profile, timeline }) {
  return (
    <>
      <Head>
        <title>{profile?.name || "Portfolio"}</title>
        <meta
          name="description"
          content={profile?.header || "Personal website"}
        />
      </Head>

      <main className="min-h-screen flex justify-center px-6 py-24 bg-white">
        <section className="w-full max-w-[420px] flex flex-col gap-8 relative">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <h1 className="text-[18px] font-medium text-[#111111]">
              {profile?.short_name}
            </h1>
            <p className="text-[15px] text-[rgba(0,0,0,.6)]">
              {profile?.header}
            </p>
          </div>

          <hr className="border-gray-200" />

          {/* Timeline */}
          <div className="flex flex-col gap-4">
            <p className="text-[14px] text-[#666666]">Previous</p>
            <div className="flex flex-col gap-2">
              {timeline.map((item) => (
                <div
                  key={`${item.type}-${item.year}-${item.title}`}
                  className="inline-flex items-center rounded-full bg-[#F5F5F5] px-3 py-1 text-[14px] gap-1 hover:bg-[#E5E5E5] transition-colors w-max"
                >
                  <span className="text-[#666666]">{item.year} ·</span>
                  {item.subtitle && (
                    <span className="text-[rgba(0,0,0,.6)]">
                      {item.subtitle} @
                    </span>
                  )}
                  {item.link ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() =>
                        window.va?.track("timeline_click", {
                          title: item.title,
                        })
                      }
                      className="underline underline-offset-2 text-black"
                    >
                      {item.title}
                    </a>
                  ) : (
                    <span className="underline underline-offset-2 text-black">
                      {item.title}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Contact */}
          <div className="flex flex-col gap-2 relative">
            <span className="text-[14px] text-[#666666]">Contact</span>
            <div className="flex flex-wrap gap-2">
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  onClick={() => window.va?.track("email_click")}
                  className="inline-flex items-center rounded-full bg-[#F5F5F5] px-3 py-1 text-[14px] text-black gap-2 hover:bg-[#E5E5E5] transition-colors w-max"
                >
                  email
                </a>
              )}
              {profile?.resume && (
                <a
                  href={profile.resume}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => window.va?.track("resume_click")}
                  className="inline-flex items-center rounded-full bg-[#F5F5F5] px-3 py-1 text-[14px] text-black gap-2 hover:bg-[#E5E5E5] transition-colors w-max"
                >
                  resume
                </a>
              )}
            </div>

            {/* Social Icons Bottom Right */}
            <div className="absolute bottom-0 right-0 flex gap-3 text-gray-600">
              {profile?.github && (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  onClick={() => window.va?.track("github_click")}
                  className="hover:text-gray-900 transition-colors text-lg"
                >
                  <FaGithub />
                </a>
              )}
              {profile?.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  onClick={() => window.va?.track("linkedin_click")}
                  className="hover:text-gray-900 transition-colors text-lg"
                >
                  <FaLinkedin />
                </a>
              )}
              {profile?.instagram && (
                <a
                  href={profile.instagram}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  onClick={() => window.va?.track("instagram_click")}
                  className="hover:text-gray-900 transition-colors text-lg"
                >
                  <FaInstagram />
                </a>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export async function getServerSideProps() {
  try {
    const client = await clientPromise;
    const db = client.db("Portfolio");

    const profile = await db.collection("profile").findOne({});

    const experience = await db
      .collection("experiences")
      .find({})
      .sort({ year: -1 })
      .toArray();

    const education = await db
      .collection("education")
      .find({})
      .sort({ year: -1 })
      .toArray();

    const timeline = [
      ...experience.map((item) => ({
        year: item.year,
        title: item.short_org,
        subtitle: item.short_desc,
        link: item.link || null,
        type: "experience",
      })),
      ...education.map((item) => ({
        year: item.year,
        title: item.short_institution,
        subtitle: item.degree,
        link: item.link,
        type: "education",
      })),
    ].sort((a, b) => Number(b.year) - Number(a.year));

    return {
      props: {
        profile: JSON.parse(JSON.stringify(profile)),
        timeline: JSON.parse(JSON.stringify(timeline)),
      },
    };
  } catch (err) {
    console.error(err);
    return {
      props: {
        profile: null,
        timeline: [],
      },
    };
  }
}
