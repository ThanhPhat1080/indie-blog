export default function Profile() {
  return (
    <div className="border-r-1 mx-auto flex w-1/2 flex-col border-gray-500 pr-3">
      <div className="my-2 mx-auto">
        <img
          className="h-60 w-60 rounded-full"
          src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
          alt="Extra large avatar"
        />
      </div>
      <div className="flex h-full flex-col gap-4">
        <p className="my-2 text-center text-2xl">User Name</p>
        <button
          type="button"
          className="my-2 mb-2 w-full rounded-lg border border-gray-200 bg-white py-2.5 px-5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
        >
          Edit profile
        </button>
        <p className="my-2 inline-flex items-center gap-2 text-lg ">
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            version="1.1"
            width="18"
            height="18"
            data-view-component="true"
          >
            <path
              fill="#fff"
              fillRule="evenodd"
              d="M1.75 2A1.75 1.75 0 000 3.75v.736a.75.75 0 000 .027v7.737C0 13.216.784 14 1.75 14h12.5A1.75 1.75 0 0016 12.25v-8.5A1.75 1.75 0 0014.25 2H1.75zM14.5 4.07v-.32a.25.25 0 00-.25-.25H1.75a.25.25 0 00-.25.25v.32L8 7.88l6.5-3.81zm-13 1.74v6.441c0 .138.112.25.25.25h12.5a.25.25 0 00.25-.25V5.809L8.38 9.397a.75.75 0 01-.76 0L1.5 5.809z"
            />
          </svg>
          phat.truong@company.com
        </p>
      </div>
    </div>
  );
}
