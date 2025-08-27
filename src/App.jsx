/// chunks 해결하기

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import { allData } from "./components/combinedData";

// 컴포넌트들을 lazy로 import
const Home = lazy(() => import("./pages/Home"));
const Root = lazy(() => import("./pages/Root"));
const Error = lazy(() => import("./pages/Error"));
const Contents = lazy(() => import("./components/Contents"));
const Detail = lazy(() => import("./components/Detail"));

// 필터링된 데이터
const ficData = allData.filter((item) => item.type === "Fiction");
const artData = allData.filter((item) => item.type === "Artwork");
const afterData = allData.filter((item) => item.type === "After");

// Suspense 래퍼 함수
const withSuspense = (Component) => (
  <Suspense fallback={<div></div>}>{Component}</Suspense>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: withSuspense(<Root />),
    errorElement: withSuspense(<Error />),
    children: [
      {
        index: true,
        element: withSuspense(<Home ficData={ficData} artData={artData} />),
      },
      {
        path: "fiction",
        element: withSuspense(<Contents title="Fiction" data={ficData} />),
      },
      {
        path: "fiction/:id",
        element: withSuspense(<Detail data={ficData} type="Fiction" />),
      },
      {
        path: "artwork",
        element: withSuspense(<Contents title="Artwork" data={artData} />),
      },
      {
        path: "artwork/:id",
        element: withSuspense(<Detail data={artData} type="Artwork" />),
      },
      {
        path: "after",
        element: withSuspense(<Contents title="After" data={afterData} />),
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
