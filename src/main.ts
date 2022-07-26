import { App, Aspects, Stack, StackProps } from "aws-cdk-lib";
import { Bucket, BucketEncryption } from "aws-cdk-lib/aws-s3";
import { AwsSolutionsChecks, NagSuppressions } from "cdk-nag";
import { Construct } from "constructs";

export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    const myBucket = new Bucket(this, "MyBucket", {
      encryption: BucketEncryption.S3_MANAGED,
      blockPublicAccess: {
        blockPublicAcls: true,
        blockPublicPolicy: true,
        ignorePublicAcls: true,
        restrictPublicBuckets: true,
      },
      enforceSSL: true,
      versioned: true,
    });

    NagSuppressions.addResourceSuppressions(myBucket, [
      {
        id: "AwsSolutions-S1",
        reason: "ServerAccessLogs not necessary",
      },
    ]);
  }
}

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new MyStack(app, "cdk-nag-demo-dev", { env: devEnv });

Aspects.of(app).add(new AwsSolutionsChecks());
// Aspects.of(app).add(new NIST80053R5Checks());

app.synth();
