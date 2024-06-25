
import { Link } from "react-router-dom";
import {
  Banner,
  Card,
  Pagination,
  PopularPosts,
  PopularWriters,
} from "../components";
import { usePaginatedQuery,usePageState } from "../hooks/auth-hook";
import { CATEGORIES, popular } from "../utils/dummyData";

const Home = () => {
  // const [page, setPage] = useState(() => {
  //   const savedPage = localStorage.getItem("page");
  //   return savedPage ? Number(savedPage) : 1;
  // });
  const [page, handlePageChange] = usePageState("homePage");
  const { data: posts, totalPages,isLoading, isError, error } = usePaginatedQuery(
    `http://localhost:8800/posts?page=${page}`
  );

  const randomIndex = Math.floor(Math.random() * posts?.length);

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Error: {error.message}</div>;
  if (posts?.length < 1)
    return (
      <div className='w-full h-full py-8 flex items-center justify-center'>
        <span className='text-lg text-slate-500'>No Post Available</span>
      </div>
    );

  return (
    <div className='py-10 2xl:py-5'>
      <Banner post={posts && posts[randomIndex]} />

      <div className='px-0 lg:pl-20 2xl:px-20 '>
        {/* Categories */}
        <div className='mt-6 md:mt-0'>
          <p className='text-2xl font-semibold text-gray-600 dark:text-white'>
            Popular Categories
          </p>
          <div className='w-full flex flex-wrap py-10 gap-8'>
            {CATEGORIES.map((cat) => (
              <Link
                to={`/category?cat=${cat?.label}`}
                className={`flex items-center justify-center gap-3 ${cat.color} text-white font-semibold text-base px-4 py-2 rounded cursor-pointer`}
                key={cat.label}
              >
                {cat?.icon}
                <span>{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Blog Post */}
        <div className='w-full flex flex-col md:flex-row gap-10 2xl:gap-20'>
          {/* LEFT */}
          <div className='w-full md:w-2/3 flex flex-col gap-y-28 md:gap-y-14'>
            {posts?.map((post, index) => (
              <Card key={post?._id} post={post} index={index} />
            ))}

            <div className='w-full flex items-cemter justify-center'>
            <Pagination totalPages={totalPages} onPageChange={handlePageChange} currentPage={page} />
            </div>
          </div>

          {/* RIGHT */}
          <div className='w-full md:w-1/4 flex flex-col gap-y-12'>
            {/* POPULAR POSTS */}
            <PopularPosts posts={popular?.posts} />

            {/* POPULAR WRITERS */}
            <PopularWriters data={popular?.writers} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
