import {ShotAttributeValueCollection} from "@/util/Types"
import gql from "graphql-tag"
import {apolloClient, makeClient} from "@/ApolloWrapper"
import {ApolloClient, InMemoryCache} from "@apollo/client-integration-nextjs"
import {HttpLink} from "@apollo/client"

export default class ShotService {
    static async updateShot(shotId: number, position: number) {
        const {data, errors} = await apolloClient.mutate({
            mutation : gql`
                mutation updateShot($id: String!, $position: Int!) {
                    updateShot(editDTO:{
                        id: $id,
                        position: $position
                    }){
                        id
                        position
                    }
                }
            `,
            variables: {id: shotId, position: position},
        });
        if(errors) {
            console.error(errors)
        }

        return {data, errors}
    }

    static async updateAttribute(attributeId: number, value: ShotAttributeValueCollection) {
        const {data, errors} = await apolloClient.mutate({
            mutation : gql`
                mutation updateShotAttribute($id: BigInteger!, $textValue: String, $singleSelectValue: BigInteger, $multiSelectValue: [BigInteger]) {
                    updateShotAttribute(editDTO:{
                        id: $id
                        textValue: $textValue
                        singleSelectValue: $singleSelectValue
                        multiSelectValue: $multiSelectValue
                    }){
                        id
                    }
                }
            `,
            variables: {id: attributeId, ...value},
        });
        if(errors) {
            console.error(errors)
        }
    }

    static async updateAttributeDefinition(attributeDefinitionId: number, name: string, position: number) {
        const {data, errors} = await apolloClient.mutate({
            mutation : gql`
                mutation updateShotAttributeDefinition($id: BigInteger!, $name: String, $position: Int!) {
                    updateShotAttributeDefinition(editDTO:{
                        id: $id,
                        name: $name,
                        position: $position,
                    }){
                        id
                    }
                }
            `,
            variables: {id: attributeDefinitionId, name: name, position: position},
        });
        if(errors) {
            console.error(errors)
        }

        return {data, errors}
    }
}