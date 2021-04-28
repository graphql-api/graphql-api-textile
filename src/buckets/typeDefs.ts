import { gql } from 'apollo-server-core'

export const typeDefs = gql`
  scalar Upload
  scalar DateTime

  interface BucketEntry {
    path: String
  }

  type BucketEntryEdge {
    node: BucketEntry
  }

  type BucketFolderConnection {
    edges: [BucketEntryEdge]
    children: [BucketEntryEdge]
    parent: BucketFolder
  }

  """
  Folder
  """
  type BucketFolder implements BucketEntry {
    path: String!
    connection: BucketFolderConnection
  }

  type BucketFileConnection {
    siblings: [BucketEntryEdge]
    parent: BucketFolder
  }

  """
  File
  """
  type BucketFile implements BucketEntry {
    path: String!
    id: ID!
    filename: String!
    mimetype: String
    connection: BucketFileConnection
  }

  type BucketLinks {
    cid: ID!
    http: String
  }

  type BucketRootConnection {
    edges: [BucketEntryEdge]
    children: [BucketEntryEdge]
  }

  """
  Bucket
  """
  type Bucket {
    cid: ID
    name: String
    createdAt: DateTime
    key: String
    path: String
    thread: String
    updatedAt: DateTime
    connection: BucketRootConnection
  }

  type Query {
    folder(path: String): BucketFolder
    file(path: String): BucketFile
    listFiles(path: String): [BucketFile]
    buckets: [Bucket]
  }

  type Mutation {
    createBucket(name: String): Bucket
    addFile(file: Upload): BucketFile
    addFiles(files: Upload): [BucketFile]
  }
`
