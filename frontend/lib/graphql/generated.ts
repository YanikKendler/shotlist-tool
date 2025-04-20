import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BigDecimal: { input: any; output: any; }
  BigInteger: { input: any; output: any; }
  DateTime: { input: any; output: any; }
};

/** Mutation root */
export type Mutation = {
  __typename?: 'Mutation';
  createScene?: Maybe<SceneDto>;
  createSceneAttributeDefinition?: Maybe<SceneAttributeDefinitionBase>;
  createSceneSelectAttributeOption?: Maybe<SceneSelectAttributeOptionDefinition>;
  createShot?: Maybe<ShotDto>;
  createShotAttributeDefinition?: Maybe<ShotAttributeDefinitionBase>;
  createShotSelectAttributeOption?: Maybe<ShotSelectAttributeOptionDefinition>;
  createShotlist?: Maybe<ShotlistDto>;
  deleteScene?: Maybe<SceneDto>;
  deleteSceneAttributeDefinition?: Maybe<SceneAttributeDefinitionBase>;
  deleteSceneSelectAttributeOption?: Maybe<SceneSelectAttributeOptionDefinition>;
  deleteShot?: Maybe<ShotDto>;
  deleteShotAttributeDefinition?: Maybe<ShotAttributeDefinitionBase>;
  deleteShotSelectAttributeOption?: Maybe<ShotSelectAttributeOptionDefinition>;
  deleteShotlist?: Maybe<ShotlistDto>;
  updateSceneAttribute?: Maybe<SceneAttributeBase>;
  updateSceneAttributeDefinition?: Maybe<ShotAttributeDefinitionBase>;
  updateSceneSelectAttributeOption?: Maybe<SceneSelectAttributeOptionDefinition>;
  updateShotAttribute?: Maybe<ShotAttributeBase>;
  updateShotSelectAttributeOption?: Maybe<ShotSelectAttributeOptionDefinition>;
  updateShotlist?: Maybe<ShotlistDto>;
};


/** Mutation root */
export type MutationCreateSceneArgs = {
  shotlistId?: InputMaybe<Scalars['String']['input']>;
};


/** Mutation root */
export type MutationCreateSceneAttributeDefinitionArgs = {
  createDTO?: InputMaybe<SceneAttributeDefinitionCreateDtoInput>;
};


/** Mutation root */
export type MutationCreateSceneSelectAttributeOptionArgs = {
  createDTO?: InputMaybe<SceneSelectAttributeCreateDtoInput>;
};


/** Mutation root */
export type MutationCreateShotArgs = {
  sceneId?: InputMaybe<Scalars['String']['input']>;
};


/** Mutation root */
export type MutationCreateShotAttributeDefinitionArgs = {
  createDTO?: InputMaybe<ShotAttributeDefinitionCreateDtoInput>;
};


/** Mutation root */
export type MutationCreateShotSelectAttributeOptionArgs = {
  createDTO?: InputMaybe<ShotSelectAttributeCreateDtoInput>;
};


/** Mutation root */
export type MutationCreateShotlistArgs = {
  createDTO?: InputMaybe<ShotlistCreateDtoInput>;
};


/** Mutation root */
export type MutationDeleteSceneArgs = {
  id?: InputMaybe<Scalars['String']['input']>;
};


/** Mutation root */
export type MutationDeleteSceneAttributeDefinitionArgs = {
  id?: InputMaybe<Scalars['BigInteger']['input']>;
};


/** Mutation root */
export type MutationDeleteSceneSelectAttributeOptionArgs = {
  id?: InputMaybe<Scalars['BigInteger']['input']>;
};


/** Mutation root */
export type MutationDeleteShotArgs = {
  id?: InputMaybe<Scalars['String']['input']>;
};


/** Mutation root */
export type MutationDeleteShotAttributeDefinitionArgs = {
  id?: InputMaybe<Scalars['BigInteger']['input']>;
};


/** Mutation root */
export type MutationDeleteShotSelectAttributeOptionArgs = {
  id?: InputMaybe<Scalars['BigInteger']['input']>;
};


/** Mutation root */
export type MutationDeleteShotlistArgs = {
  id?: InputMaybe<Scalars['String']['input']>;
};


/** Mutation root */
export type MutationUpdateSceneAttributeArgs = {
  editDTO?: InputMaybe<SceneAttributeEditDtoInput>;
};


/** Mutation root */
export type MutationUpdateSceneAttributeDefinitionArgs = {
  editDTO?: InputMaybe<ShotAttributeDefinitionEditDtoInput>;
};


/** Mutation root */
export type MutationUpdateSceneSelectAttributeOptionArgs = {
  editDTO?: InputMaybe<SceneSelectAttributeOptionEditDtoInput>;
};


/** Mutation root */
export type MutationUpdateShotAttributeArgs = {
  editDTO?: InputMaybe<ShotAttributeEditDtoInput>;
};


/** Mutation root */
export type MutationUpdateShotSelectAttributeOptionArgs = {
  editDTO?: InputMaybe<ShotSelectAttributeOptionEditDtoInput>;
};


/** Mutation root */
export type MutationUpdateShotlistArgs = {
  editDTO?: InputMaybe<ShotlistEditDtoInput>;
};

/** Query root */
export type Query = {
  __typename?: 'Query';
  sceneAttributeDefinitions?: Maybe<Array<Maybe<SceneAttributeDefinitionBase>>>;
  sceneSelectAttributeOptions?: Maybe<Array<Maybe<SceneSelectAttributeOptionDefinition>>>;
  scenes?: Maybe<Array<Maybe<SceneDto>>>;
  searchSceneSelectAttributeOptions?: Maybe<Array<Maybe<SceneSelectAttributeOptionDefinition>>>;
  searchShotSelectAttributeOptions?: Maybe<Array<Maybe<ShotSelectAttributeOptionDefinition>>>;
  shotAttributeDefinitions?: Maybe<Array<Maybe<ShotAttributeDefinitionBase>>>;
  shotSelectAttributeOptions?: Maybe<Array<Maybe<ShotSelectAttributeOptionDefinition>>>;
  shotlist?: Maybe<ShotlistDto>;
  shotlists?: Maybe<Array<Maybe<ShotlistDto>>>;
  shots?: Maybe<Array<Maybe<ShotDto>>>;
};


/** Query root */
export type QuerySceneAttributeDefinitionsArgs = {
  shotlistId?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QuerySceneSelectAttributeOptionsArgs = {
  attributeDefinitionId?: InputMaybe<Scalars['BigInteger']['input']>;
};


/** Query root */
export type QueryScenesArgs = {
  shotlistId?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QuerySearchSceneSelectAttributeOptionsArgs = {
  searchDTO?: InputMaybe<SceneSelectAttributeOptionSearchDtoInput>;
};


/** Query root */
export type QuerySearchShotSelectAttributeOptionsArgs = {
  searchDTO?: InputMaybe<ShotSelectAttributeOptionSearchDtoInput>;
};


/** Query root */
export type QueryShotAttributeDefinitionsArgs = {
  shotlistId?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryShotSelectAttributeOptionsArgs = {
  attributeDefinitionId?: InputMaybe<Scalars['BigInteger']['input']>;
};


/** Query root */
export type QueryShotlistArgs = {
  id?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryShotsArgs = {
  sceneId?: InputMaybe<Scalars['String']['input']>;
};

export type Scene = {
  __typename?: 'Scene';
  attributes?: Maybe<Array<Maybe<SceneAttributeBase>>>;
  /** ISO-8601 */
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  number: Scalars['Int']['output'];
  shots?: Maybe<Array<Maybe<Shot>>>;
};

export type SceneAttributeBase = {
  __typename?: 'SceneAttributeBase';
  definition?: Maybe<SceneAttributeDefinitionBase>;
  id?: Maybe<Scalars['BigInteger']['output']>;
};

export type SceneAttributeBaseDto = {
  definition?: Maybe<SceneAttributeDefinitionBase>;
  id?: Maybe<Scalars['BigInteger']['output']>;
};

export type SceneAttributeDefinitionBase = {
  __typename?: 'SceneAttributeDefinitionBase';
  id?: Maybe<Scalars['BigInteger']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  position: Scalars['Int']['output'];
};

export type SceneAttributeDefinitionCreateDtoInput = {
  shotlistId?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<SceneAttributeType>;
};

export type SceneAttributeDefinitionEditDtoInput = {
  id?: InputMaybe<Scalars['BigInteger']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  position: Scalars['Int']['input'];
};

export type SceneAttributeEditDtoInput = {
  id?: InputMaybe<Scalars['BigInteger']['input']>;
  multiSelectValue?: InputMaybe<Array<InputMaybe<Scalars['BigInteger']['input']>>>;
  singleSelectValue?: InputMaybe<Scalars['BigInteger']['input']>;
  textValue?: InputMaybe<Scalars['String']['input']>;
};

export type SceneAttributeTemplateBase = {
  __typename?: 'SceneAttributeTemplateBase';
  id?: Maybe<Scalars['BigInteger']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  position: Scalars['Int']['output'];
  template?: Maybe<Template>;
  type?: Maybe<Scalars['String']['output']>;
};

export enum SceneAttributeType {
  SceneMultiSelectAttribute = 'SceneMultiSelectAttribute',
  SceneSingleSelectAttribute = 'SceneSingleSelectAttribute',
  SceneTextAttribute = 'SceneTextAttribute'
}

export type SceneDto = {
  __typename?: 'SceneDTO';
  attributes?: Maybe<Array<Maybe<SceneAttributeBaseDto>>>;
  /** ISO-8601 */
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  number: Scalars['Int']['output'];
  shotlist?: Maybe<Shotlist>;
  shots?: Maybe<Array<Maybe<ShotDto>>>;
};

export type SceneMultiSelectAttributeDto = SceneAttributeBaseDto & {
  __typename?: 'SceneMultiSelectAttributeDTO';
  definition?: Maybe<SceneAttributeDefinitionBase>;
  id?: Maybe<Scalars['BigInteger']['output']>;
  multiSelectValue?: Maybe<Array<Maybe<SceneSelectAttributeOptionDefinition>>>;
};

export type SceneSelectAttributeCreateDtoInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  selectAttributeId?: InputMaybe<Scalars['BigInteger']['input']>;
};

export type SceneSelectAttributeOptionDefinition = {
  __typename?: 'SceneSelectAttributeOptionDefinition';
  id?: Maybe<Scalars['BigInteger']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  sceneAttributeDefinition?: Maybe<SceneAttributeDefinitionBase>;
};

export type SceneSelectAttributeOptionEditDtoInput = {
  id?: InputMaybe<Scalars['BigInteger']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type SceneSelectAttributeOptionSearchDtoInput = {
  sceneAttributeDefinitionId?: InputMaybe<Scalars['BigInteger']['input']>;
  searchTerm?: InputMaybe<Scalars['String']['input']>;
};

export type SceneSingleSelectAttributeDto = SceneAttributeBaseDto & {
  __typename?: 'SceneSingleSelectAttributeDTO';
  definition?: Maybe<SceneAttributeDefinitionBase>;
  id?: Maybe<Scalars['BigInteger']['output']>;
  singleSelectValue?: Maybe<SceneSelectAttributeOptionDefinition>;
};

export type SceneTextAttributeDto = SceneAttributeBaseDto & {
  __typename?: 'SceneTextAttributeDTO';
  definition?: Maybe<SceneAttributeDefinitionBase>;
  id?: Maybe<Scalars['BigInteger']['output']>;
  textValue?: Maybe<Scalars['String']['output']>;
};

export type Shot = {
  __typename?: 'Shot';
  attributes?: Maybe<Array<Maybe<ShotAttributeBase>>>;
  /** ISO-8601 */
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  isSubshot: Scalars['Boolean']['output'];
  number: Scalars['Int']['output'];
};

export type ShotAttributeBase = {
  __typename?: 'ShotAttributeBase';
  definition?: Maybe<ShotAttributeDefinitionBase>;
  id?: Maybe<Scalars['BigInteger']['output']>;
};

export type ShotAttributeBaseDto = {
  definition?: Maybe<ShotAttributeDefinitionBase>;
  id?: Maybe<Scalars['BigInteger']['output']>;
};

export type ShotAttributeDefinitionBase = {
  __typename?: 'ShotAttributeDefinitionBase';
  id?: Maybe<Scalars['BigInteger']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  position: Scalars['Int']['output'];
};

export type ShotAttributeDefinitionCreateDtoInput = {
  shotlistId?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<ShotAttributeType>;
};

export type ShotAttributeDefinitionEditDtoInput = {
  id?: InputMaybe<Scalars['BigInteger']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  position: Scalars['Int']['input'];
};

export type ShotAttributeEditDtoInput = {
  id?: InputMaybe<Scalars['BigInteger']['input']>;
  multiSelectValue?: InputMaybe<Array<InputMaybe<Scalars['BigInteger']['input']>>>;
  singleSelectValue?: InputMaybe<Scalars['BigInteger']['input']>;
  textValue?: InputMaybe<Scalars['String']['input']>;
};

export type ShotAttributeTemplateBase = {
  __typename?: 'ShotAttributeTemplateBase';
  id?: Maybe<Scalars['BigInteger']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  position: Scalars['Int']['output'];
  template?: Maybe<Template>;
  type?: Maybe<Scalars['String']['output']>;
};

export enum ShotAttributeType {
  ShotMultiSelectAttribute = 'ShotMultiSelectAttribute',
  ShotSingleSelectAttribute = 'ShotSingleSelectAttribute',
  ShotTextAttribute = 'ShotTextAttribute'
}

export type ShotDto = {
  __typename?: 'ShotDTO';
  attributes?: Maybe<Array<Maybe<ShotAttributeBaseDto>>>;
  /** ISO-8601 */
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  number: Scalars['Int']['output'];
  scene?: Maybe<Scene>;
  subshot: Scalars['Boolean']['output'];
};

export type ShotMultiSelectAttributeDto = ShotAttributeBaseDto & {
  __typename?: 'ShotMultiSelectAttributeDTO';
  definition?: Maybe<ShotAttributeDefinitionBase>;
  id?: Maybe<Scalars['BigInteger']['output']>;
  multiSelectValue?: Maybe<Array<Maybe<ShotSelectAttributeOptionDefinition>>>;
};

export type ShotSelectAttributeCreateDtoInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  selectAttributeId?: InputMaybe<Scalars['BigInteger']['input']>;
};

export type ShotSelectAttributeOptionDefinition = {
  __typename?: 'ShotSelectAttributeOptionDefinition';
  id?: Maybe<Scalars['BigInteger']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  shotAttributeDefinition?: Maybe<ShotAttributeDefinitionBase>;
};

export type ShotSelectAttributeOptionEditDtoInput = {
  id?: InputMaybe<Scalars['BigInteger']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type ShotSelectAttributeOptionSearchDtoInput = {
  searchTerm?: InputMaybe<Scalars['String']['input']>;
  shotAttributeDefinitionId?: InputMaybe<Scalars['BigInteger']['input']>;
};

export type ShotSingleSelectAttributeDto = ShotAttributeBaseDto & {
  __typename?: 'ShotSingleSelectAttributeDTO';
  definition?: Maybe<ShotAttributeDefinitionBase>;
  id?: Maybe<Scalars['BigInteger']['output']>;
  singleSelectValue?: Maybe<ShotSelectAttributeOptionDefinition>;
};

export type ShotTextAttributeDto = ShotAttributeBaseDto & {
  __typename?: 'ShotTextAttributeDTO';
  definition?: Maybe<ShotAttributeDefinitionBase>;
  id?: Maybe<Scalars['BigInteger']['output']>;
  textValue?: Maybe<Scalars['String']['output']>;
};

export type Shotlist = {
  __typename?: 'Shotlist';
  /** ISO-8601 */
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** ISO-8601 */
  editedAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  sceneAttributeDefinitions?: Maybe<Array<Maybe<SceneAttributeDefinitionBase>>>;
  scenes?: Maybe<Array<Maybe<Scene>>>;
  shotAttributeDefinitions?: Maybe<Array<Maybe<ShotAttributeDefinitionBase>>>;
  template?: Maybe<Template>;
};

export type ShotlistCreateDtoInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  templateId?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
};

export type ShotlistDto = {
  __typename?: 'ShotlistDTO';
  /** ISO-8601 */
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** ISO-8601 */
  editedAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  owner?: Maybe<User>;
  sceneAttributeDefinitions?: Maybe<Array<Maybe<SceneAttributeDefinitionBase>>>;
  scenes?: Maybe<Array<Maybe<SceneDto>>>;
  shotAttributeDefinitions?: Maybe<Array<Maybe<ShotAttributeDefinitionBase>>>;
  template?: Maybe<Template>;
};

export type ShotlistEditDtoInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type Template = {
  __typename?: 'Template';
  /** ISO-8601 */
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  sceneAttributes?: Maybe<Array<Maybe<SceneAttributeTemplateBase>>>;
  shotAttributes?: Maybe<Array<Maybe<ShotAttributeTemplateBase>>>;
};

export type User = {
  __typename?: 'User';
  /** ISO-8601 */
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  shotlists?: Maybe<Array<Maybe<Shotlist>>>;
  templates?: Maybe<Array<Maybe<Template>>>;
  username?: Maybe<Scalars['String']['output']>;
};

export type ShotlistsQueryVariables = Exact<{ [key: string]: never; }>;


export type ShotlistsQuery = { __typename?: 'Query', shotlists?: Array<{ __typename?: 'ShotlistDTO', id?: string | null, name?: string | null } | null> | null };

export type ShotlistQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type ShotlistQuery = { __typename?: 'Query', shotlist?: { __typename?: 'ShotlistDTO', id?: string | null, name?: string | null, scenes?: Array<{ __typename?: 'SceneDTO', id?: string | null, number: number, attributes?: Array<{ __typename?: 'SceneMultiSelectAttributeDTO', id?: any | null, multiSelectValue?: Array<{ __typename?: 'SceneSelectAttributeOptionDefinition', name?: string | null } | null> | null, definition?: { __typename?: 'SceneAttributeDefinitionBase', name?: string | null, position: number } | null } | { __typename?: 'SceneSingleSelectAttributeDTO', id?: any | null, singleSelectValue?: { __typename?: 'SceneSelectAttributeOptionDefinition', name?: string | null } | null, definition?: { __typename?: 'SceneAttributeDefinitionBase', name?: string | null, position: number } | null } | { __typename?: 'SceneTextAttributeDTO', textValue?: string | null, id?: any | null, definition?: { __typename?: 'SceneAttributeDefinitionBase', name?: string | null, position: number } | null } | null> | null } | null> | null, sceneAttributeDefinitions?: Array<{ __typename?: 'SceneAttributeDefinitionBase', id?: any | null, name?: string | null, position: number } | null> | null, shotAttributeDefinitions?: Array<{ __typename?: 'ShotAttributeDefinitionBase', id?: any | null, name?: string | null, position: number } | null> | null } | null };

export type SearchQueryVariables = Exact<{
  definitionId: Scalars['BigInteger']['input'];
  searchTerm: Scalars['String']['input'];
}>;


export type SearchQuery = { __typename?: 'Query', searchShotSelectAttributeOptions?: Array<{ __typename?: 'ShotSelectAttributeOptionDefinition', id?: any | null, name?: string | null } | null> | null };

export type CreateMutationVariables = Exact<{
  definitionId: Scalars['BigInteger']['input'];
  name: Scalars['String']['input'];
}>;


export type CreateMutation = { __typename?: 'Mutation', createShotSelectAttributeOption?: { __typename?: 'ShotSelectAttributeOptionDefinition', id?: any | null, name?: string | null } | null };

export type UpdateMutationVariables = Exact<{
  id: Scalars['BigInteger']['input'];
  textValue: Scalars['String']['input'];
  singleSelectValue: Scalars['BigInteger']['input'];
  multiSelectValue: Array<Scalars['BigInteger']['input']> | Scalars['BigInteger']['input'];
}>;


export type UpdateMutation = { __typename?: 'Mutation', updateShotAttribute?: { __typename?: 'ShotAttributeBase', id?: any | null } | null };

export type ShotsQueryVariables = Exact<{
  sceneId: Scalars['String']['input'];
}>;


export type ShotsQuery = { __typename?: 'Query', shots?: Array<{ __typename?: 'ShotDTO', id?: string | null, number: number, attributes?: Array<{ __typename?: 'ShotMultiSelectAttributeDTO', id?: any | null, multiSelectValue?: Array<{ __typename?: 'ShotSelectAttributeOptionDefinition', name?: string | null } | null> | null, definition?: { __typename?: 'ShotAttributeDefinitionBase', id?: any | null, name?: string | null, position: number } | null } | { __typename?: 'ShotSingleSelectAttributeDTO', id?: any | null, singleSelectValue?: { __typename?: 'ShotSelectAttributeOptionDefinition', name?: string | null } | null, definition?: { __typename?: 'ShotAttributeDefinitionBase', id?: any | null, name?: string | null, position: number } | null } | { __typename?: 'ShotTextAttributeDTO', textValue?: string | null, id?: any | null, definition?: { __typename?: 'ShotAttributeDefinitionBase', id?: any | null, name?: string | null, position: number } | null } | null> | null } | null> | null };


export const ShotlistsDocument = gql`
    query shotlists {
  shotlists {
    id
    name
  }
}
    `;

/**
 * __useShotlistsQuery__
 *
 * To run a query within a React component, call `useShotlistsQuery` and pass it any options that fit your needs.
 * When your component renders, `useShotlistsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useShotlistsQuery({
 *   variables: {
 *   },
 * });
 */
export function useShotlistsQuery(baseOptions?: Apollo.QueryHookOptions<ShotlistsQuery, ShotlistsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ShotlistsQuery, ShotlistsQueryVariables>(ShotlistsDocument, options);
      }
export function useShotlistsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ShotlistsQuery, ShotlistsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ShotlistsQuery, ShotlistsQueryVariables>(ShotlistsDocument, options);
        }
export function useShotlistsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ShotlistsQuery, ShotlistsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ShotlistsQuery, ShotlistsQueryVariables>(ShotlistsDocument, options);
        }
export type ShotlistsQueryHookResult = ReturnType<typeof useShotlistsQuery>;
export type ShotlistsLazyQueryHookResult = ReturnType<typeof useShotlistsLazyQuery>;
export type ShotlistsSuspenseQueryHookResult = ReturnType<typeof useShotlistsSuspenseQuery>;
export type ShotlistsQueryResult = Apollo.QueryResult<ShotlistsQuery, ShotlistsQueryVariables>;
export const ShotlistDocument = gql`
    query shotlist($id: String!) {
  shotlist(id: $id) {
    id
    name
    scenes {
      id
      number
      attributes {
        id
        definition {
          name
          position
        }
        ... on SceneSingleSelectAttributeDTO {
          singleSelectValue {
            name
          }
        }
        ... on SceneMultiSelectAttributeDTO {
          multiSelectValue {
            name
          }
        }
        ... on SceneTextAttributeDTO {
          textValue
        }
      }
    }
    sceneAttributeDefinitions {
      id
      name
      position
    }
    shotAttributeDefinitions {
      id
      name
      position
    }
  }
}
    `;

/**
 * __useShotlistQuery__
 *
 * To run a query within a React component, call `useShotlistQuery` and pass it any options that fit your needs.
 * When your component renders, `useShotlistQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useShotlistQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useShotlistQuery(baseOptions: Apollo.QueryHookOptions<ShotlistQuery, ShotlistQueryVariables> & ({ variables: ShotlistQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ShotlistQuery, ShotlistQueryVariables>(ShotlistDocument, options);
      }
export function useShotlistLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ShotlistQuery, ShotlistQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ShotlistQuery, ShotlistQueryVariables>(ShotlistDocument, options);
        }
export function useShotlistSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ShotlistQuery, ShotlistQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ShotlistQuery, ShotlistQueryVariables>(ShotlistDocument, options);
        }
export type ShotlistQueryHookResult = ReturnType<typeof useShotlistQuery>;
export type ShotlistLazyQueryHookResult = ReturnType<typeof useShotlistLazyQuery>;
export type ShotlistSuspenseQueryHookResult = ReturnType<typeof useShotlistSuspenseQuery>;
export type ShotlistQueryResult = Apollo.QueryResult<ShotlistQuery, ShotlistQueryVariables>;
export const SearchDocument = gql`
    query search($definitionId: BigInteger!, $searchTerm: String!) {
  searchShotSelectAttributeOptions(
    searchDTO: {shotAttributeDefinitionId: $definitionId, searchTerm: $searchTerm}
  ) {
    id
    name
  }
}
    `;

/**
 * __useSearchQuery__
 *
 * To run a query within a React component, call `useSearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchQuery({
 *   variables: {
 *      definitionId: // value for 'definitionId'
 *      searchTerm: // value for 'searchTerm'
 *   },
 * });
 */
export function useSearchQuery(baseOptions: Apollo.QueryHookOptions<SearchQuery, SearchQueryVariables> & ({ variables: SearchQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchQuery, SearchQueryVariables>(SearchDocument, options);
      }
export function useSearchLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchQuery, SearchQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchQuery, SearchQueryVariables>(SearchDocument, options);
        }
export function useSearchSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SearchQuery, SearchQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SearchQuery, SearchQueryVariables>(SearchDocument, options);
        }
export type SearchQueryHookResult = ReturnType<typeof useSearchQuery>;
export type SearchLazyQueryHookResult = ReturnType<typeof useSearchLazyQuery>;
export type SearchSuspenseQueryHookResult = ReturnType<typeof useSearchSuspenseQuery>;
export type SearchQueryResult = Apollo.QueryResult<SearchQuery, SearchQueryVariables>;
export const CreateDocument = gql`
    mutation create($definitionId: BigInteger!, $name: String!) {
  createShotSelectAttributeOption(
    createDTO: {selectAttributeId: $definitionId, name: $name}
  ) {
    id
    name
  }
}
    `;
export type CreateMutationFn = Apollo.MutationFunction<CreateMutation, CreateMutationVariables>;

/**
 * __useCreateMutation__
 *
 * To run a mutation, you first call `useCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMutation, { data, loading, error }] = useCreateMutation({
 *   variables: {
 *      definitionId: // value for 'definitionId'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateMutation(baseOptions?: Apollo.MutationHookOptions<CreateMutation, CreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateMutation, CreateMutationVariables>(CreateDocument, options);
      }
export type CreateMutationHookResult = ReturnType<typeof useCreateMutation>;
export type CreateMutationResult = Apollo.MutationResult<CreateMutation>;
export type CreateMutationOptions = Apollo.BaseMutationOptions<CreateMutation, CreateMutationVariables>;
export const UpdateDocument = gql`
    mutation update($id: BigInteger!, $textValue: String!, $singleSelectValue: BigInteger!, $multiSelectValue: [BigInteger!]!) {
  updateShotAttribute(
    editDTO: {id: $id, textValue: $textValue, singleSelectValue: $singleSelectValue, multiSelectValue: $multiSelectValue}
  ) {
    id
  }
}
    `;
export type UpdateMutationFn = Apollo.MutationFunction<UpdateMutation, UpdateMutationVariables>;

/**
 * __useUpdateMutation__
 *
 * To run a mutation, you first call `useUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMutation, { data, loading, error }] = useUpdateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      textValue: // value for 'textValue'
 *      singleSelectValue: // value for 'singleSelectValue'
 *      multiSelectValue: // value for 'multiSelectValue'
 *   },
 * });
 */
export function useUpdateMutation(baseOptions?: Apollo.MutationHookOptions<UpdateMutation, UpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateMutation, UpdateMutationVariables>(UpdateDocument, options);
      }
export type UpdateMutationHookResult = ReturnType<typeof useUpdateMutation>;
export type UpdateMutationResult = Apollo.MutationResult<UpdateMutation>;
export type UpdateMutationOptions = Apollo.BaseMutationOptions<UpdateMutation, UpdateMutationVariables>;
export const ShotsDocument = gql`
    query shots($sceneId: String!) {
  shots(sceneId: $sceneId) {
    id
    number
    attributes {
      id
      definition {
        id
        name
        position
      }
      ... on ShotSingleSelectAttributeDTO {
        singleSelectValue {
          name
        }
      }
      ... on ShotMultiSelectAttributeDTO {
        multiSelectValue {
          name
        }
      }
      ... on ShotTextAttributeDTO {
        textValue
      }
    }
  }
}
    `;

/**
 * __useShotsQuery__
 *
 * To run a query within a React component, call `useShotsQuery` and pass it any options that fit your needs.
 * When your component renders, `useShotsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useShotsQuery({
 *   variables: {
 *      sceneId: // value for 'sceneId'
 *   },
 * });
 */
export function useShotsQuery(baseOptions: Apollo.QueryHookOptions<ShotsQuery, ShotsQueryVariables> & ({ variables: ShotsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ShotsQuery, ShotsQueryVariables>(ShotsDocument, options);
      }
export function useShotsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ShotsQuery, ShotsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ShotsQuery, ShotsQueryVariables>(ShotsDocument, options);
        }
export function useShotsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ShotsQuery, ShotsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ShotsQuery, ShotsQueryVariables>(ShotsDocument, options);
        }
export type ShotsQueryHookResult = ReturnType<typeof useShotsQuery>;
export type ShotsLazyQueryHookResult = ReturnType<typeof useShotsLazyQuery>;
export type ShotsSuspenseQueryHookResult = ReturnType<typeof useShotsSuspenseQuery>;
export type ShotsQueryResult = Apollo.QueryResult<ShotsQuery, ShotsQueryVariables>;