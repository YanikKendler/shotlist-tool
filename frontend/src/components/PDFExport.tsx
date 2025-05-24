"use client"

import React, {useEffect, useState} from 'react';
import {Document, Page, StyleSheet, Text, View} from '@react-pdf/renderer';
import {useApolloClient, useQuery} from "@apollo/client"
import gql from "graphql-tag"
import {SceneDto, ShotDto, ShotlistDto} from "../../lib/graphql/generated"
import {AnySceneAttribute} from "@/util/Types"
import {SceneAttributeParser} from "@/util/AttributeParser"
import {makeClient} from "@/ApolloWrapper"

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4',
        padding: 30,
    },
    scene: {
    },
    row: {
        display: "flex",
        width: "100%",
    }
});

// Create Document Component
export default function PDFExport({data}: { data: ShotlistDto }) {
    return (
        <Document>
            <Page size="A4" orientation="landscape" style={styles.page}>
                {(data.scenes as SceneDto[]).map((scene: SceneDto) => (
                    <View style={styles.scene}>
                        <View style={styles.row}>
                            <Text>{scene.position}</Text>
                            {(scene.attributes as AnySceneAttribute[])?.map(attribute =>
                                <Text key={attribute.id}>{SceneAttributeParser.toValueString(attribute)}</Text>
                            )}
                        </View>
                        {(scene.shots as ShotDto[])?.map(shot =>
                            <View key={shot.id}>shot</View>
                        )}
                    </View>
                ))}
            </Page>
        </Document>
    )
}