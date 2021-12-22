import { Resolvers } from './types'
/**
 * https://github.com/application-research/next-bucket/blob/e348e0323d666b13bf47c20a1f749b2db7eae4f7/pages/api/buckets/add-file.js
 *
 */

export const Mutation: Resolvers['Mutation'] = {
  async createBucket() {},
  async deleteBucket() {},
  async addBucketFile(root, { input }, { dataSources }, info) {
    console.log('ADD BUCKET FILE')
    // console.time('TTT')
    // const { createReadStream } = await input.file
    // const data = await storeUpload(input.file)
    // const data = await createReadStream()
    // console.timeEnd('TTT')
    return { __typename: 'BucketFile', cid: 'NADA', path: 'NADA', name: 'NADA', filename: 'NADA' }
    // const bucketKey = ''
    // const { filename, mimetype, createReadStream } = await file
    // const stream = createReadStream()
    //   await dataSources.hub.buckets
    //     .pushPath(bucketKey, filename, stream)
    //     .catch((error) => new ApolloError(error))
  },
  async addBucketFiles(root, { files }, { dataSources }, info) {}
}
