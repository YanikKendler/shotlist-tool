import ErrorPage from "@/pages/errorPage/errorPage"

export default function notFound(){
    return <ErrorPage settings={{
        title: "404",
        description: "Page not found",
        link: {
            href: "/dashboard",
            text: "Dashboard",
        },
    }}/>
}