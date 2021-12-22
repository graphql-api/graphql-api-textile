import { GraphQLResolverMap } from 'apollo-graphql'
import { TextileDataSource } from '../dataSource'

export const resolvers: GraphQLResolverMap<{ dataSources: { hub: TextileDataSource } }> = {
  User: {},

  Query: {},
  Mutation: {
    async login(root, args, { dataSources }) {
      const userAuth = await dataSources.hub.getUser()
      console.log('LOGIN', userAuth)
      return userAuth
    }
  },
  Subscription: {
    resolveChallenge() {}
  }
}
