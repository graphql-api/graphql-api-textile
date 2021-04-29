import { gql } from 'apollo-server-core'
import { typeDefs as bucketDefs } from './buckets/typeDefs'

export const typeDefs = gql`
  ${bucketDefs}
`
