import { gql } from 'apollo-server-core'
import { UserAuth } from '@textile/hub'

export const typeDefs = gql`
  type User {
    id: ID!
    name: String
  }

  type UserAuth {
    key: String
    sig: String
    msg: String
    token: String
  }


  type Mutation {
    login: UserAuth
  }
`
