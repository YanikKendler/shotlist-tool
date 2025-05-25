"use client"

import React, {useEffect, useState} from 'react';
import {Document, Page, StyleSheet, Text, View} from '@react-pdf/renderer';
import {useApolloClient, useQuery} from "@apollo/client"
import gql from "graphql-tag"
import {SceneDto, ShotDto, ShotlistDto} from "../../lib/graphql/generated"
import {
    AnySceneAttribute,
    AnySceneAttributeDefinition,
    AnyShotAttribute,
    AnyShotAttributeDefinition
} from "@/util/Types"
import {SceneAttributeParser, ShotAttributeParser} from "@/util/AttributeParser"
import {makeClient} from "@/ApolloWrapper"
import {wuText} from "@yanikkendler/web-utils/dist"
import Utils from "@/util/Utils"

// Create styles
const styles = StyleSheet.create({
    page: {
        backgroundColor: '#E4E4E4',
        padding: 30,
        fontSize: 9,
    },
    row: {
        display: "flex",
        flexDirection: 'row',
        width: "100%",
        borderTop: '1px solid #000',
        'var(--cellColor)': '#323232',
    },
    rowOdd: {
        backgroundColor: '#efefef',
    },
    heading: {
        backgroundColor: '#c7c7c7',
        fontWeight: 'bold',
        fontSize: 11,
    },
    shotDefinitions: {
        backgroundColor: '#c7c7c7',
    },
    sceneDefinitions: {
        fontSize: 10,
        textAlign: 'center',
    },
    cell: {
        flex: 1,
        borderRight: '1px solid #000',
        textAlign: 'left',
        paddingVertical: 2,
        paddingHorizontal: 3,
    },
    bigCell: {
        paddingVertical: 4,
    },
    number: {
        maxWidth: 30,
        borderLeft: '1px solid #000',
        textAlign: 'center',
    },
    small: {
        fontSize: 9,
    },
    credit: {
        borderTop: '1px solid #000',
        padding: 4,
        textAlign: 'center',
        color: '#2c2c2c',
    }
});

// Create Document Component
export default function PDFExport({data}: { data: ShotlistDto }) {
    return (
        <Document>
            <Page size="A4" orientation="landscape" style={styles.page}>
                <View style={[styles.row, styles.sceneDefinitions]}>
                    <Text style={[styles.cell, styles.number, styles.small]}>Scene</Text>
                    {(data.sceneAttributeDefinitions as AnySceneAttributeDefinition[]).map((attribute) => (
                        <Text style={[styles.cell]} key={attribute.id}>{attribute.name}</Text>
                    ))}
                </View>
                {(data.scenes as SceneDto[]).map((scene: SceneDto) => (
                    <View key={scene.id}>
                        <View style={[styles.row, styles.heading]}>
                            <Text style={[styles.cell, styles.bigCell, styles.number]}>{scene.position+1}</Text>
                            {(scene.attributes as AnySceneAttribute[])?.map(attribute =>
                                <Text style={[styles.cell, styles.bigCell]} key={attribute.id}>{SceneAttributeParser.toValueString(attribute)}</Text>
                            )}
                        </View>
                        <View style={[styles.row, styles.shotDefinitions]}>
                            <Text style={[styles.cell, styles.number]}>Shot</Text>
                            {(data.shotAttributeDefinitions as AnyShotAttributeDefinition[]).map((attribute) => (
                                <Text style={[styles.cell]} key={attribute.id}>{attribute.name}</Text>
                            ))}
                        </View>
                        {(scene.shots as ShotDto[])?.map((shot, index) =>
                            <View style={[styles.row , index%2==0 ? styles.rowOdd : {}]} key={shot.id}>
                                <Text style={[styles.cell, styles.number]}>{Utils.numberToShotLetter(shot.position)}</Text>
                                {(shot.attributes as AnyShotAttribute[])?.map((attribute) =>
                                    <Text style={[styles.cell]} key={attribute.id}>{ShotAttributeParser.toValueString(attribute)}</Text>
                                )}
                            </View>
                        )}
                    </View>
                ))}
                <Text style={styles.credit}>created with &lt;3 using shotly.at</Text>
                {/*TODO create proper footer and header*/}
                <Text render={({ pageNumber, totalPages }) => (
                    `${pageNumber} / ${totalPages}`
                )} fixed />
            </Page>
        </Document>
    )
}