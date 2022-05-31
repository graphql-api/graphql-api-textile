import { Buckets, PrivateKey, Filecoin, Client, ThreadID } from '@textile/hub'
import { createStream } from '../lib/createStream'
import { isEmpty, getBucketDataFromHeader } from '../lib/utilities'

export async function nextHandler(req, res) {
  // await S.cors(req, res)

  const { bucketName, bucketKey, key } = getBucketDataFromHeader(req.headers.authorization)

  // NOTE(jim)
  // You might want to protect this endpoint some more.
  if (isEmpty(bucketName)) {
    return res.status(500).json({ error: true })
  }

  if (isEmpty(bucketKey)) {
    return res.status(500).json({ error: true })
  }

  if (isEmpty(key)) {
    return res.status(500).json({ error: true })
  }

  // const { buckets, bucketRoot, error } = await T.getBucketAPIFromUserToken({
  //   key,
  //   bucketName
  // })

  // if (error) {
  //   return res.status(500).json({ error })
  // }
}
