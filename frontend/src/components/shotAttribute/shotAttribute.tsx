'use client'

import {AnyShotAttribute} from "@/util/Types"
import styles from './shotAttribute.module.scss'
import React, {ChangeEventHandler, useDebugValue} from "react"
import AsyncSelect from "react-select/async"
import {getClient} from "@/ApolloClient"
import gql from "graphql-tag"
import {useApolloClient} from "@apollo/client"

export default function ShotAttribute({attribute}: {attribute: AnyShotAttribute}){

    const SEARCH_QUERY = gql`
        query search($searchTerm: String!) {
            searchShotSelectAttributeOptions(
                searchDTO: { shotAttributeDefinitionId: 2, searchTerm: $searchTerm }
            ) {
                id
                name
            }
        }
    `

    const client = useApolloClient()

    const loadOptions = async (inputValue: string) => {
        try {
            const { data } = await client.query({
                query: SEARCH_QUERY,
                variables: { searchTerm: inputValue },
            });

            return data.searchShotSelectAttributeOptions.map((option: any) => ({
                value: option.id,
                label: option.name,
            }));
        } catch (error) {
            console.error('Error fetching options', error)
        }
    }

    const updateTextValue = (e: any) => {
        console.log(e)
    }

    switch (attribute.__typename) {
        case "ShotSingleSelectAttributeDTO":
            return (
                <div className={styles.shotAttribute}>
                </div>
            )
        case "ShotMultiSelectAttributeDTO":
            return (
                <div className={styles.shotAttribute}>
                    <AsyncSelect loadOptions={loadOptions} defaultOptions/>
                </div>
            )
        case "ShotTextAttributeDTO":
            return (
                <div className={styles.shotAttribute}>
                    <input type="text" defaultValue={attribute.textValue || ""} onChange={updateTextValue}/>
                </div>
            )
    }
}
