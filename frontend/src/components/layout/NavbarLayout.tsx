import { Outlet, useLocation } from "react-router";
import Navbar from "./Navbar";
import { Suspense } from "react";
import LoadingSpinner from "../util/LoadingSpinner";

export default function NavbarLayout() {
    const location = useLocation();

    return(
        <>
            <Navbar />
            <Suspense key={location.key} fallback={<LoadingSpinner />}>
                <Outlet />
            </Suspense>
        </>
    );
};