import { gql } from '@apollo/client'

export const typeDefs = gql`
  type Thread {
    id: ID!
    name: String
  }

  extend type Query {
    listThreads: [Thread]
  }
`
