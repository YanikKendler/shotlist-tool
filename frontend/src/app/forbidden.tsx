import ErrorPage from "@/components/errorPage/errorPage"

export default function Forbidden() {
    return (
        <ErrorPage settings={{
            title: "Forbidden",
            description: "You do not have permission to access this page. Please contact the administrator if you believe this is an error.",
            link: {
                text: "Back to your dashboard",
                href: "/",
            },
        }}/>
    )
}