import Dashboard from "@/app/dashboard/page"
import {useAuth0} from "@auth0/auth0-react"

export default function Home() {
    const {loginWithRedirect} = useAuth0();

    return (
        <div>
            <h1>hello</h1>
            <button onClick={() => loginWithRedirect()}>Log In</button>
        </div>
    );
}
