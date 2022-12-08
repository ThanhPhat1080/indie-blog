import type { Post } from "@prisma/client";
import { isEmptyOrNotExist } from "~/utils";
import PostArticle from "./PostArticle";

const ListPostArticles = ({ postArticles }: { postArticles: Post[] }) => {
    return (
      <>
        {postArticles.map((post: Post, index: Number) => (
          <div className="my-5" key={post.id}>
            <PostArticle
              {...post}
              createdAt={new Date(post.createdAt)}
              updatedAt={new Date(post.updatedAt)}
            />
            {index < postArticles.length - 1 && <hr className="line-wavy" />}
          </div>
        ))}
        {isEmptyOrNotExist(postArticles) && <p className="text-center mx-auto text-xl text-sky-500">Empty!</p>}
      </>
    );
  };

  export default ListPostArticles;