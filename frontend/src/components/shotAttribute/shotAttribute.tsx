'use client'

import {AnyShotAttribute} from "@/util/Types"
import styles from './shotAttribute.module.scss'
import React from "react"
import AsyncSelect from "react-select/async"
import {query} from "@/ApolloClient"
import gql from "graphql-tag"

export default function ShotAttribute({attribute}: {attribute: AnyShotAttribute}){

    const loadOptions = (
        inputValue: string,
        callback: (options: any[]) => void
    ) => {
        query({
            query: gql`
                query search{
                    searchShotSelectAttributeOptions(searchDTO:{shotAttributeDefinitionId:2, searchTerm: "d"}){
                        id
                        name
                    }
                }
            `,
            variables: { inputValue },
        })
        .then(({data, error}) => {
            if(error) {
                console.error('Error fetching shotlist:', error);
                return;
            }

            callback(
                data.searchShotSelectAttributeOptions.map((option: any) => ({
                    value: option.id,
                    label: option.name,
                }))
            )
        })
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
                    <AsyncSelect loadOptions={loadOptions} />
                </div>
            )
        case "ShotTextAttributeDTO":
            return (
                <div className={styles.shotAttribute}>
                    <input type="text" value={attribute.textValue || ""}/>
                </div>
            )
    }
}
