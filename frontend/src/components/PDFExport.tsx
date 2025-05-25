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
        backgroundColor: '#ffffff',
        padding: 20,
        fontSize: 9,
    },
    container: {
        borderBottom: '1px solid #000',
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
        paddingVertical: 2,
        paddingHorizontal: 3,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        height: '100%',
    },
    bigCell: {
        paddingVertical: 4,
    },
    number: {
        maxWidth: 30,
        borderLeft: '1px solid #000',
        justifyContent: 'center',
    },
    small: {
        fontSize: 9,
    },
    bottom: {
        padding: 4,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
});

// Create Document Component
export default function PDFExport({data}: { data: ShotlistDto }) {
    return (
        <Document>
            <Page size="A4" orientation="landscape" style={styles.page}>
                <View style={styles.container}>
                    <View style={[styles.row, styles.sceneDefinitions]}>
                        <Text style={[styles.cell, styles.number, styles.small]}>Scene</Text>
                        {(data.sceneAttributeDefinitions as AnySceneAttributeDefinition[]).map((attribute) => (
                            <Text style={[styles.cell]} key={attribute.id}>{attribute.name}</Text>
                        ))}
                    </View>
                    {(data.scenes as SceneDto[]).map((scene: SceneDto) => (
                        <View key={scene.id}>
                            <View style={[styles.row, styles.heading]}>
                                <View style={[styles.cell, styles.bigCell, styles.number]}>
                                    <Text>{scene.position+1}</Text>
                                </View>
                                {(scene.attributes as AnySceneAttribute[])?.map(attribute =>
                                    <View style={[styles.cell, styles.bigCell]} key={attribute.id}>
                                        <Text>{SceneAttributeParser.toValueString(attribute, false)}</Text>
                                    </View>
                                )}
                            </View>
                            <View style={[styles.row, styles.shotDefinitions]}>
                                <View style={[styles.cell, styles.number]}>
                                    <Text>Shot</Text>
                                </View>
                                {(data.shotAttributeDefinitions as AnyShotAttributeDefinition[]).map((attribute) => (
                                    <View style={[styles.cell]} key={attribute.id}>
                                        <Text>{attribute.name}</Text>
                                    </View>
                                ))}
                            </View>
                            {(scene.shots as ShotDto[])?.map((shot, index) =>
                                <View style={[styles.row , index%2==0 ? styles.rowOdd : {}]} key={shot.id}>
                                    <View style={[styles.cell, styles.number]}>
                                        <Text>{Utils.numberToShotLetter(shot.position)}</Text>
                                    </View>
                                    {(shot.attributes as AnyShotAttribute[])?.map((attribute) =>
                                        <View style={[styles.cell]} key={attribute.id}>
                                            <Text>{ShotAttributeParser.toValueString(attribute, false)}</Text>
                                        </View>
                                    )}
                                </View>
                            )}
                        </View>
                    ))}
                </View>
                <View style={styles.bottom} fixed>
                    <Text>created with &lt;3 using shotly.at</Text>
                    <Text render={({pageNumber, totalPages}) => (
                        `${pageNumber} / ${totalPages}`
                    )}/>
                    <Text>{data?.name || "Unnamed Shotlist"}</Text>
                </View>
            </Page>
        </Document>
    )
}