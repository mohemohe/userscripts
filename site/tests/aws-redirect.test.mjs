import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"
import vm from "node:vm"

const source = await readFile(new URL("../../AWS Redirect/aws-redirect.user.js", import.meta.url), "utf8")

function redirects(href) {
  const destinations = []
  vm.runInNewContext(source, {
    URL,
    window: { location: { href, replace: (url) => destinations.push(url) } },
  })
  return destinations
}

test("redirects other console hosts while retaining the path, query, and fragment", () => {
  for (const host of ["us-east-1.console.aws.amazon.com", "eu-west-1.console.aws.amazon.com", "console.aws.amazon.com"]) {
    assert.deepEqual(redirects(`https://${host}/ec2/home?foo=a%20b#Instances:instanceId=i-123`), [
      "https://ap-northeast-1.console.aws.amazon.com/ec2/home?foo=a%20b#Instances:instanceId=i-123",
    ])
  }
})

test("normalizes conflicting region parameters even on the target host", () => {
  for (const host of ["us-east-1.console.aws.amazon.com", "ap-northeast-1.console.aws.amazon.com"]) {
    const [destination] = redirects(`https://${host}/ec2/home?region=ap-northeast-1&region=us-east-1&foo=bar#Instances`)
    assert.equal(destination, "https://ap-northeast-1.console.aws.amazon.com/ec2/home?region=ap-northeast-1&foo=bar#Instances")
    assert.deepEqual(redirects(destination), [])
  }
})

test("does not reload URLs already in the target region", () => {
  for (const query of ["", "?region=ap-northeast-1&foo=a%20b"]) {
    assert.deepEqual(redirects(`https://ap-northeast-1.console.aws.amazon.com/ec2/home${query}#Instances`), [])
  }
})

test("leaves whitelist services untouched regardless of host or region query", () => {
  for (const host of ["us-east-1.console.aws.amazon.com", "eu-west-1.console.aws.amazon.com", "ap-northeast-1.console.aws.amazon.com"]) {
    for (const path of ["/route53", "/route53/", "/route53/v2/hostedzones", "/cloudfront", "/cloudfront/", "/cloudfront/v4/home"]) {
      assert.deepEqual(redirects(`https://${host}${path}?region=us-east-1#details`), [])
    }
  }
})

test("does not exempt services that only share a whitelist prefix", () => {
  for (const path of ["/route53domains/home", "/cloudfront-other/home", "/ec2/route53"]) {
    assert.deepEqual(redirects(`https://us-east-1.console.aws.amazon.com${path}`), [
      `https://ap-northeast-1.console.aws.amazon.com${path}`,
    ])
  }
})
