import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { Suspense } from "react";
import LoadingSpinner from "../util/LoadingSpinner";

export default function NavbarLayout() {
    return(
        <>
            <Navbar />
            <Suspense fallback={<LoadingSpinner />}>
                <Outlet />
            </Suspense>
        </>
    );
};