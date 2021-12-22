import { GraphQLResolverMap } from 'apollo-graphql'
import { TextileDataSource } from '../../dataSource'

export type Resolvers = GraphQLResolverMap<{ dataSources: { hub: TextileDataSource } }>
