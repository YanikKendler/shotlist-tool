import "./template.scss"
import {useParams, useSearchParams} from "next/navigation"
import {useApolloClient} from "@apollo/client"

export default function Template (){
    const params = useParams<{ id: string }>()
    const id = params?.id || ""

    const client = useApolloClient()

    function getData(){

    }

    return (
        <div>template</div>
    )
}