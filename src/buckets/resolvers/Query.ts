import { Resolvers } from './types'

export const Query: Resolvers['Query'] = {
  async bucketDirectory(root, { input: { path } }, { dataSources }) {
    // dataSources.hub.buckets.listPath(path)
  },
  async bucketFile(root, { input: { path } }, { dataSources }) {
    dataSources.hub.buckets
  },
  async bucket(root, args, { dataSources }) {},
  async listBuckets(root, args, { dataSources }) {
    console.log('LIST BUCKETS')
    return dataSources.hub.listBuckets()
  }
}
