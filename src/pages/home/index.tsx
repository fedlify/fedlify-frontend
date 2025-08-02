import { Route } from "react-router";
// import { ResourceProps } from "@refinedev/core";
import HomePage from "./HomePage";

export const getRoute = (): React.ReactElement => {
    return <Route path="/" element={<HomePage />} />;
}

// export const getResources = (): ResourceProps[] => {
//     return [
//         {
//             name: "Home",
//             list: "/",
//             meta: {
//                 name: "Home",
//                 label: "Health AI Platform",
//                 // icon: <DashboardOutlined />,
//             },
//         }
//     ];
// }