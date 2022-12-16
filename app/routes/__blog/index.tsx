import { useLoaderData } from "@remix-run/react";
import { getPublishPosts } from "~/models/note.server";
import { json } from "@remix-run/node";
import { PostArticle } from "~/components";

export async function loader() {
  const postArticles = await getPublishPosts();

  return json({ postArticles });
}

export default function Index() {
  const { postArticles } = useLoaderData<typeof loader>();

  return (
    <>
      <div className="relative dark:bg-slate-800">
        <section className="relative z-10 mx-auto flex w-full flex-col items-center gap-8 py-80 sm:px-4 md:px-0 dark:text-white sm:flex-row md:max-w-3xl lg:max-w-5xl 2xlg:max-w-7xl">
          <div className="flex-1">
            <h1 className="my-5 text-4xl font-semibold lg:text-7xl">
              Hi, I am
              <span className=" relative mx-5 inline-block before:absolute before:-inset-1 before:block before:-skew-y-3 before:bg-pink-500">
                <em className="relative inline-block font-semibold text-white">
                  Robot
                </em>
              </span>
            </h1>
            <h1 className="my-5 text-3xl font-semibold lg:text-5xl">
              Welcome to the my blog.
            </h1>
            <em className="text-lg font-semibold lg:text-3xl ">
              Let{" "}
              <em className="text-sky-500 underline decoration-wavy">share</em>{" "}
              and{" "}
              <em className="text-sky-500 underline decoration-wavy">learn</em>{" "}
              together.
            </em>
          </div>
          <div>
            <img
              src="assets/images/robot-cute.webp"
              alt="robot-cute-Ouch"
              width={256}
              height={311}
              className="flex-1"
            />
          </div>
        </section>
        <div className="bg-wave relative">
          <div className="absolute left-0 bottom-[600px] w-full before:absolute before:bottom-[-580px] before:h-[600px] before:w-full before:bg-sky-300 before:dark:bg-slate-500">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path
                className="fill-sky-300 dark:fill-slate-500"
                fillOpacity="1"
                d="M0,96L18.5,122.7C36.9,149,74,203,111,234.7C147.7,267,185,277,222,250.7C258.5,224,295,160,332,133.3C369.2,107,406,117,443,138.7C480,160,517,192,554,208C590.8,224,628,224,665,218.7C701.5,213,738,203,775,170.7C812.3,139,849,85,886,85.3C923.1,85,960,139,997,133.3C1033.8,128,1071,64,1108,69.3C1144.6,75,1182,149,1218,165.3C1255.4,181,1292,139,1329,128C1366.2,117,1403,139,1422,149.3L1440,160L1440,320L1421.5,320C1403.1,320,1366,320,1329,320C1292.3,320,1255,320,1218,320C1181.5,320,1145,320,1108,320C1070.8,320,1034,320,997,320C960,320,923,320,886,320C849.2,320,812,320,775,320C738.5,320,702,320,665,320C627.7,320,591,320,554,320C516.9,320,480,320,443,320C406.2,320,369,320,332,320C295.4,320,258,320,222,320C184.6,320,148,320,111,320C73.8,320,37,320,18,320L0,320Z"
              ></path>
            </svg>
          </div>
          <div className="absolute left-0 bottom-[400px] w-full before:absolute before:bottom-[-390px] before:h-[400px] before:w-full before:bg-sky-200 before:dark:bg-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path
                className="fill-sky-200 dark:fill-slate-600"
                fillOpacity="1"
                d="M0,160L18.5,138.7C36.9,117,74,75,111,74.7C147.7,75,185,117,222,165.3C258.5,213,295,267,332,250.7C369.2,235,406,149,443,122.7C480,96,517,128,554,133.3C590.8,139,628,117,665,96C701.5,75,738,53,775,80C812.3,107,849,181,886,181.3C923.1,181,960,107,997,80C1033.8,53,1071,75,1108,101.3C1144.6,128,1182,160,1218,176C1255.4,192,1292,192,1329,170.7C1366.2,149,1403,107,1422,85.3L1440,64L1440,320L1421.5,320C1403.1,320,1366,320,1329,320C1292.3,320,1255,320,1218,320C1181.5,320,1145,320,1108,320C1070.8,320,1034,320,997,320C960,320,923,320,886,320C849.2,320,812,320,775,320C738.5,320,702,320,665,320C627.7,320,591,320,554,320C516.9,320,480,320,443,320C406.2,320,369,320,332,320C295.4,320,258,320,222,320C184.6,320,148,320,111,320C73.8,320,37,320,18,320L0,320Z"
              />
            </svg>
          </div>
          <div className="absolute left-0 bottom-[100px] w-full before:absolute before:bottom-[-100px] before:h-[100px] before:w-full before:bg-sky-100 before:dark:bg-slate-700">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path
                className="fill-sky-100 dark:fill-slate-700"
                fillOpacity="1"
                d="M0,32L26.7,58.7C53.3,85,107,139,160,170.7C213.3,203,267,213,320,229.3C373.3,245,427,267,480,245.3C533.3,224,587,160,640,128C693.3,96,747,96,800,96C853.3,96,907,96,960,133.3C1013.3,171,1067,245,1120,250.7C1173.3,256,1227,192,1280,144C1333.3,96,1387,64,1413,48L1440,32L1440,320L1413.3,320C1386.7,320,1333,320,1280,320C1226.7,320,1173,320,1120,320C1066.7,320,1013,320,960,320C906.7,320,853,320,800,320C746.7,320,693,320,640,320C586.7,320,533,320,480,320C426.7,320,373,320,320,320C266.7,320,213,320,160,320C106.7,320,53,320,27,320L0,320Z"
              />
            </svg>
          </div>
          <div className="absolute left-0 bottom-0 w-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path
                className="fill-white dark:fill-slate-800"
                fillOpacity="1"
                d="M0,160L34.3,133.3C68.6,107,137,53,206,48C274.3,43,343,85,411,133.3C480,181,549,235,617,261.3C685.7,288,754,288,823,250.7C891.4,213,960,139,1029,128C1097.1,117,1166,171,1234,197.3C1302.9,224,1371,224,1406,224L1440,224L1440,320L1405.7,320C1371.4,320,1303,320,1234,320C1165.7,320,1097,320,1029,320C960,320,891,320,823,320C754.3,320,686,320,617,320C548.6,320,480,320,411,320C342.9,320,274,320,206,320C137.1,320,69,320,34,320L0,320Z"
              />
            </svg>
          </div>
        </div>
      </div>
      <section className="mx-auto mb-5 flex flex-col px-6 md:w-4/5 lg:max-w-2xl 2xl:max-w-3xl">
        {postArticles.map((post, index) => (
          <div className="my-5" key={post.id}>
            <PostArticle
              {...post}
              author={post.user}
              createdAt={new Date(post.createdAt)}
              updatedAt={new Date(post.updatedAt)}
            />
            {index < postArticles.length - 1 && <hr className="line-wavy" />}
          </div>
        ))}
      </section>
    </>
  );
}
