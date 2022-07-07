import 'source-map-support/register'

import * as AWS from 'aws-sdk'
import * as AWSXRAY from 'aws-xray-sdk'

const XAWS = AWSXRAY.captureAWS(AWS)

export class TodosStorage {
    constructor(
        private readonly s3 = new XAWS.S3({signatureVersion: 'v4'}),
        private readonly bucketName = process.env.ATTACHMENTS_S3_BUCKET,
        private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION
    ) {
    }

    async getAttachmentUrl(attachmentId: string): Promise<string> {
        return `https://${this.bucketName}.s3.amazonaws.com/${attachmentId}`
    }

    async getUploadUrl(attachmentId: string): Promise<string> {
        return this.s3.getSignedUrl('putObject', {
            Bucket: this.bucketName,
            Key: attachmentId,
            Expires: this.urlExpiration
        })
    }
}